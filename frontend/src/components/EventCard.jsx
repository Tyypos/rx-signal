const OUTCOME_STYLES = {
  Recovered:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Recovering:  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400" },
  Fatal:       { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20",     dot: "bg-red-400" },
  "Not Recovered":           { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/20", dot: "bg-orange-400" },
  "Recovered with Sequelae": { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",  dot: "bg-amber-400" },
  Unknown:     { bg: "bg-surface-3",       text: "text-text-tertiary", border: "border-border-subtle", dot: "bg-text-tertiary" },
};

const REACTION_COLORS = [
  "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  "bg-sky-500/10 text-sky-300 border-sky-500/20",
  "bg-teal-500/10 text-teal-300 border-teal-500/20",
  "bg-purple-500/10 text-purple-300 border-purple-500/20",
  "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  "bg-blue-500/10 text-blue-300 border-blue-500/20",
];

function OutcomeBadge({ outcome }) {
  const style = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.Unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${style.bg} ${style.text} ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {outcome}
    </span>
  );
}

function SeriousBadge({ flags }) {
  if (!flags || flags.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/8 border border-red-500/20 text-red-400 text-[10px] font-medium uppercase tracking-wide">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Serious
    </span>
  );
}

export default function EventCard({ event, index }) {
  const {
    reactions = [],
    patient_age,
    patient_sex,
    report_date,
    outcome,
    serious,
    serious_flags = [],
    concomitant_drugs = [],
  } = event;

  const formattedDate = report_date
    ? new Date(report_date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const cardNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="card-hover p-5 group animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-text-tertiary bg-surface-3 px-2 py-0.5 rounded-md">
            #{cardNumber}
          </span>
          {serious && <SeriousBadge flags={serious_flags} />}
        </div>
        <OutcomeBadge outcome={outcome} />
      </div>

      {/* Reactions */}
      {reactions.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-medium mb-2">
            Reactions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {reactions.map((r, i) => (
              <span
                key={i}
                className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-medium ${REACTION_COLORS[i % REACTION_COLORS.length]}`}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Patient info & meta */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-text-secondary">
        {(patient_age || patient_sex !== "Unknown") && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {[
              patient_age ? `${patient_age} yrs` : null,
              patient_sex !== "Unknown" ? patient_sex : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}

        {formattedDate && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </span>
        )}
      </div>

      {/* Concomitant drugs */}
      {concomitant_drugs.length > 1 && (
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <p className="text-[10px] uppercase tracking-widest text-text-tertiary font-medium mb-1.5">
            Co-administered drugs
          </p>
          <p className="text-xs text-text-tertiary">
            {concomitant_drugs.slice(0, 4).join(", ")}
            {concomitant_drugs.length > 4 && ` +${concomitant_drugs.length - 4} more`}
          </p>
        </div>
      )}
    </div>
  );
}
