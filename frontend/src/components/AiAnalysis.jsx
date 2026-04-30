import { useEffect, useRef } from "react";

function MarkdownRenderer({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Bold heading **text**
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const heading = line.slice(2, -2);
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-text-primary mt-5 mb-2 first:mt-0">
          {heading}
        </h3>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.trimStart().startsWith("- ") || line.trimStart().startsWith("* ")) {
      const bullets = [];
      while (
        i < lines.length &&
        (lines[i].trimStart().startsWith("- ") || lines[i].trimStart().startsWith("* "))
      ) {
        bullets.push(lines[i].trimStart().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 mb-3">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-purple/60 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(b) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-sm text-text-secondary leading-relaxed mb-3">
        <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function inlineMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-medium">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-text-primary">$1</em>');
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 rounded-full bg-accent-purple/20 animate-pulse-slow" />
        <div className="shimmer-line h-4 w-32 rounded" />
      </div>
      {[100, 85, 95, 70, 90, 80].map((w, i) => (
        <div
          key={i}
          className="shimmer-line h-3 rounded"
          style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }}
        />
      ))}
      <div className="pt-2 space-y-2">
        {[75, 88, 65].map((w, i) => (
          <div
            key={i}
            className="shimmer-line h-3 rounded"
            style={{ width: `${w}%`, animationDelay: `${(i + 6) * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AiAnalysis({ analysis, loading, drug }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (analysis && panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
  }, [analysis]);

  return (
    <div className="rounded-xl border border-border-base bg-surface-1 overflow-hidden flex flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border-subtle bg-surface-2/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-purple/30 to-accent-blue/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">AI Analysis</p>
            <p className="text-[10px] text-text-tertiary">Llama 3.1 8B Instant · Groq</p>
          </div>
        </div>

        {loading && (
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-accent-purple">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing
          </div>
        )}

        {analysis && !loading && (
          <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 14.5l-4-4 1.41-1.41L11 13.67l6.59-6.58L19 8.5l-8 8z" />
            </svg>
            Ready
          </div>
        )}
      </div>

      {/* Panel body */}
      <div
        ref={panelRef}
        className="flex-1"
      >
        {loading ? (
          <LoadingSkeleton />
        ) : analysis ? (
          <div className="p-5 animate-fade-in">
            {drug && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[11px] font-medium mb-4 capitalize">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {drug}
              </div>
            )}
            <MarkdownRenderer text={analysis} />
            <div className="mt-5 pt-4 border-t border-border-subtle">
              <p className="text-[10px] text-text-tertiary leading-relaxed">
                This analysis is generated by AI from FDA adverse event data and is for informational
                purposes only. It does not constitute medical advice. Always consult a qualified
                healthcare provider.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-text-tertiary text-sm">
              AI analysis will appear here after a search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
