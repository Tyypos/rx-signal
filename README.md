# RxSignal

**AI-powered FDA adverse drug event explorer.**

Search any drug name to instantly surface FDA adverse event reports and receive a plain-English clinical analysis powered by Google Gemini — all in a polished, dark-themed interface.

🔗 **Live demo:** _coming soon_

---

## Screenshot

> _Search results for "aspirin" showing adverse event report cards (left) and AI analysis panel (right)._

![RxSignal screenshot placeholder](https://via.placeholder.com/1200x675/0f0f12/8b5cf6?text=RxSignal+Screenshot)

---

## Tech stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Python · Django 4.2 · Django REST Framework     |
| Frontend  | React 18 · Vite · Tailwind CSS                  |
| AI        | Google Gemini 1.5 Flash (`google-generativeai`) |
| Data      | openFDA Drug Event API (no key required)        |
| Deploy    | Railway (backend) · Static files via WhiteNoise |

---

## Project structure

```
rx-signal/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── rxsignal/          # Django project settings & routing
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/               # Single Django app
│       ├── views.py        # openFDA fetch + Gemini analysis
│       └── urls.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── SearchBar.jsx
│   │       ├── EventCard.jsx
│   │       ├── AiAnalysis.jsx
│   │       └── EmptyState.jsx
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── Procfile
└── railway.json
```

---

## Local setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier works)

### 1 — Clone and configure environment

```bash
git clone https://github.com/your-username/rx-signal.git
cd rx-signal
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_actual_key
```

### 2 — Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
# → http://localhost:8000
```

Test the API directly:
```
GET http://localhost:8000/api/events/?drug=aspirin
```

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:8000` automatically.

---

## Environment variables

| Variable              | Required | Description                                         |
|-----------------------|----------|-----------------------------------------------------|
| `GEMINI_API_KEY`      | Yes      | Google Gemini API key for AI analysis               |
| `DJANGO_SECRET_KEY`   | No       | Django secret key (auto-generated in dev)           |
| `DEBUG`               | No       | `True` in dev, `False` in production (default True) |
| `ALLOWED_HOSTS`       | No       | Comma-separated hostnames for Django                |
| `CORS_ALLOWED_ORIGINS`| No       | Comma-separated allowed CORS origins for production |

---

## API reference

### `GET /api/events/?drug={name}`

Returns adverse event data and an AI analysis for the given drug name.

**Example response:**
```json
{
  "drug": "aspirin",
  "total_results": 20,
  "events": [
    {
      "reactions": ["Gastrointestinal Haemorrhage", "Nausea"],
      "patient_age": 67,
      "patient_sex": "Female",
      "report_date": "2023-04-12",
      "outcome": "Recovered",
      "serious": true,
      "serious_flags": ["Hospitalization"],
      "concomitant_drugs": ["Warfarin", "Lisinopril"]
    }
  ],
  "ai_analysis": "**Overview**\nBased on 20 spontaneous reports..."
}
```

---

## Deployment (Railway)

1. Push to GitHub.
2. Create a new Railway project → **Deploy from GitHub repo**.
3. Set environment variables in the Railway dashboard (see table above).
4. Railway auto-detects the `Procfile` and deploys the Django backend.
5. For the frontend, either:
   - Build locally (`npm run build`) and copy `dist/` into `backend/templates/` + `backend/static/`, then run `collectstatic`, **or**
   - Deploy the frontend to Vercel/Netlify as a separate service and point `VITE_API_URL` at the Railway backend URL.

---

## Data source & disclaimer

Adverse event data is sourced from the **FDA Adverse Event Reporting System (FAERS)** via the [openFDA API](https://open.fda.gov/apis/drug/event/). Reports are submitted voluntarily by patients and healthcare providers. This application is for informational and educational purposes only — it is **not** a substitute for professional medical advice, diagnosis, or treatment.
