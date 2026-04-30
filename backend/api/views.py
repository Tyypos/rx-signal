import requests
from groq import Groq
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

FDA_BASE_URL = "https://api.fda.gov/drug/event.json"

SEX_MAP = {"0": "Unknown", "1": "Male", "2": "Female"}

OUTCOME_MAP = {
    "1": "Recovered",
    "2": "Recovering",
    "3": "Not Recovered",
    "4": "Recovered with Sequelae",
    "5": "Fatal",
    "6": "Unknown",
}


def _parse_event(raw: dict) -> dict:
    patient = raw.get("patient", {})

    reactions = [
        r.get("reactionmeddrapt", "").title()
        for r in patient.get("reaction", [])
        if r.get("reactionmeddrapt")
    ]

    age_raw = patient.get("patientage") or patient.get("patientonsetage")
    try:
        age = float(age_raw)
        age_unit = patient.get("patientageunit") or patient.get("patientonsetageunit", "801")
        # 801 = years, 802 = months, 803 = weeks, 804 = days
        if age_unit == "802":
            age = round(age / 12, 1)
        elif age_unit == "803":
            age = round(age / 52, 1)
        elif age_unit == "804":
            age = round(age / 365, 1)
        age = int(age) if age == int(age) else age
    except (TypeError, ValueError):
        age = None

    sex_code = str(patient.get("patientsex", "0"))
    sex = SEX_MAP.get(sex_code, "Unknown")

    receive_date = raw.get("receivedate", "")
    if len(receive_date) == 8:
        receive_date = f"{receive_date[:4]}-{receive_date[4:6]}-{receive_date[6:]}"

    outcome_code = str(patient.get("patientoutcome", "6"))
    outcome = OUTCOME_MAP.get(outcome_code, "Unknown")

    serious_flags = []
    if raw.get("seriousnessdeath") == "1":
        serious_flags.append("Death")
    if raw.get("seriousnesshospitalization") == "1":
        serious_flags.append("Hospitalization")
    if raw.get("seriousnesslifethreatening") == "1":
        serious_flags.append("Life Threatening")
    if raw.get("seriousnessdisabling") == "1":
        serious_flags.append("Disabling")

    drugs = [
        d.get("medicinalproduct", "").title()
        for d in patient.get("drug", [])
        if d.get("medicinalproduct")
    ]

    return {
        "reactions": reactions[:8],
        "patient_age": age,
        "patient_sex": sex,
        "report_date": receive_date,
        "outcome": outcome,
        "serious": bool(serious_flags),
        "serious_flags": serious_flags,
        "concomitant_drugs": drugs[:5],
    }


def _fetch_fda_events(drug: str) -> list[dict]:
    params = {
        "search": f'patient.drug.medicinalproduct:"{drug}"',
        "limit": 20,
    }
    resp = requests.get(FDA_BASE_URL, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    return [_parse_event(r) for r in data.get("results", [])]


def _build_analysis_prompt(drug: str, events: list[dict]) -> str:
    reaction_counts: dict[str, int] = {}
    outcomes: dict[str, int] = {}
    ages = []
    sexes: dict[str, int] = {}
    serious_count = 0

    for e in events:
        for r in e["reactions"]:
            reaction_counts[r] = reaction_counts.get(r, 0) + 1
        outcomes[e["outcome"]] = outcomes.get(e["outcome"], 0) + 1
        if e["patient_age"] is not None:
            ages.append(e["patient_age"])
        sexes[e["patient_sex"]] = sexes.get(e["patient_sex"], 0) + 1
        if e["serious"]:
            serious_count += 1

    top_reactions = sorted(reaction_counts.items(), key=lambda x: -x[1])[:10]
    avg_age = round(sum(ages) / len(ages), 1) if ages else None

    summary_lines = [
        f"Drug: {drug.upper()}",
        f"Total reports analyzed: {len(events)}",
        f"Serious events: {serious_count}/{len(events)}",
        f"Average patient age: {avg_age} years" if avg_age else "Average age: unknown",
        f"Patient sex distribution: {dict(sexes)}",
        f"Top reactions (reaction: count): {dict(top_reactions)}",
        f"Outcomes: {dict(outcomes)}",
    ]

    return f"""You are a clinical pharmacovigilance assistant. Analyze these FDA adverse event reports and provide a concise, plain-English summary for a healthcare professional or informed patient.

Data summary:
{chr(10).join(summary_lines)}

Provide your analysis in this exact structure:

**Overview**
[2-3 sentence summary of the key findings]

**Most Common Adverse Reactions**
[Bullet list of top reactions with brief clinical context]

**Patient Demographics**
[Age range, sex distribution, any notable patterns]

**Severity Assessment**
[Assessment of serious vs non-serious events, most concerning outcomes]

**Clinical Takeaways**
[2-3 practical insights for clinicians or patients]

Keep the tone professional but accessible. Do not diagnose or recommend stopping medications. Remind readers this is based on spontaneous reports which may have reporting bias."""


def _call_groq(prompt: str) -> str:
    if not settings.GROQ_API_KEY:
        return "AI analysis unavailable — GROQ_API_KEY not configured."
    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )
    return response.choices[0].message.content


class AdverseEventsView(APIView):
    def get(self, request):
        drug = request.query_params.get("drug", "").strip()
        if not drug:
            return Response(
                {"error": "Query parameter 'drug' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            events = _fetch_fda_events(drug)
        except requests.exceptions.HTTPError as exc:
            if exc.response is not None and exc.response.status_code == 404:
                return Response(
                    {"error": f"No adverse event records found for '{drug}'."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(
                {"error": "Failed to fetch data from openFDA. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except requests.exceptions.RequestException:
            return Response(
                {"error": "Network error connecting to openFDA."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if not events:
            return Response(
                {"error": f"No adverse event records found for '{drug}'."},
                status=status.HTTP_404_NOT_FOUND,
            )

        prompt = _build_analysis_prompt(drug, events)
        try:
            ai_analysis = _call_groq(prompt)
        except Exception:
            ai_analysis = "AI analysis temporarily unavailable."

        return Response(
            {
                "drug": drug,
                "total_results": len(events),
                "events": events,
                "ai_analysis": ai_analysis,
            }
        )
