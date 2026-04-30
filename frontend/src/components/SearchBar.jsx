import { useRef } from "react";

const SUGGESTIONS = ["aspirin", "ibuprofen", "metformin", "lisinopril", "atorvastatin", "amoxicillin"];

export default function SearchBar({ value, onChange, onSearch, loading }) {
  const inputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch(value);
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Search input */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent-purple/40 via-accent-blue/30 to-accent-cyan/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />

        <div className="relative flex items-center bg-surface-2 border border-border-base group-focus-within:border-accent-purple/60 rounded-2xl transition-all duration-200">
          <div className="pl-4 pr-2 text-text-tertiary group-focus-within:text-accent-purple transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search a drug name — e.g. aspirin, metformin…"
            disabled={loading}
            className="flex-1 bg-transparent py-3.5 px-2 text-text-primary placeholder:text-text-tertiary text-sm outline-none disabled:opacity-50"
            autoComplete="off"
            spellCheck={false}
          />

          {value && !loading && (
            <button
              onClick={() => { onChange(""); inputRef.current?.focus(); }}
              className="p-2 mr-1 text-text-tertiary hover:text-text-secondary transition-colors rounded-lg"
              aria-label="Clear"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onSearch(value)}
            disabled={loading || !value.trim()}
            className="flex items-center gap-2 m-1.5 px-4 py-2 rounded-xl bg-accent-purple hover:bg-accent-purple-dim disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all duration-150 active:scale-95"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
        <span className="text-text-tertiary text-xs">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { onChange(s); onSearch(s); }}
            disabled={loading}
            className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border-subtle text-text-secondary text-xs hover:border-border-base hover:text-text-primary hover:bg-surface-3 transition-all duration-150 disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
