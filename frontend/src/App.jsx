import { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import EventCard from './components/EventCard';
import AiAnalysis from './components/AiAnalysis';
import EmptyState from './components/EmptyState';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function App() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    async function handleSearch(drug) {
        if (!drug.trim()) return;
        setLoading(true);
        setError(null);
        setData(null);
        setSearched(true);
        try {
            const res = await fetch(
                `${API_BASE}/api/events/?drug=${encodeURIComponent(drug.trim())}`,
            );
            const json = await res.json();
            if (!res.ok) {
                setError(json.error ?? 'An unexpected error occurred.');
            } else {
                setData(json);
            }
        } catch {
            setError(
                'Unable to connect to the server. Make sure the backend is running.',
            );
        } finally {
            setLoading(false);
        }
    }

    const hasResults = data && data.events && data.events.length > 0;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero search */}
                <section className="pt-16 pb-12">
                    <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border-base text-text-secondary text-xs font-medium mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse-slow" />
                            Powered by openFDA + Groq AI
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary mb-4">
                            Explore adverse drug{' '}
                            <span className="gradient-text">
                                events instantly
                            </span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Search any drug to surface FDA adverse event reports
                            and receive an AI-generated plain&#8209;English
                            analysis in seconds.
                        </p>
                    </div>

                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSearch={handleSearch}
                        loading={loading}
                    />
                </section>

                {/* Results area */}
                {(loading || hasResults || error) && (
                    <section className="pb-16 animate-slide-up">
                        {/* Stats bar */}
                        {hasResults && !loading && (
                            <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
                                <span>
                                    Showing{' '}
                                    <span className="text-text-primary font-medium">
                                        {data.total_results}
                                    </span>{' '}
                                    reports for{' '}
                                    <span className="text-accent-purple font-medium capitalize">
                                        {data.drug}
                                    </span>
                                </span>
                                <span className="flex-1 h-px bg-border-subtle" />
                                <span className="text-text-tertiary text-xs">
                                    Source: openFDA
                                </span>
                            </div>
                        )}

                        {/* AI analysis — full width */}
                        <div className="mb-6">
                            <AiAnalysis
                                analysis={data?.ai_analysis}
                                loading={loading}
                                drug={data?.drug}
                            />
                        </div>

                        {/* Event cards grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))
                            ) : error ? (
                                <div className="col-span-full">
                                    <ErrorState message={error} />
                                </div>
                            ) : hasResults ? (
                                data.events.map((event, i) => (
                                    <EventCard key={i} event={event} index={i} />
                                ))
                            ) : null}
                        </div>
                    </section>
                )}

                {/* Empty / initial state */}
                {!searched && !loading && <EmptyState />}
            </main>

            <footer className="border-t border-border-subtle mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-text-tertiary text-xs">
                        Data sourced from{' '}
                        <a
                            href="https://open.fda.gov"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                            openFDA
                        </a>
                        . For informational purposes only — not medical advice.
                    </p>
                    <p className="text-text-tertiary text-xs">
                        RxSignal &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
                <div className="shimmer-line h-4 w-32 rounded-md" />
                <div className="shimmer-line h-5 w-20 rounded-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
                {[60, 80, 55, 70].map((w, i) => (
                    <div
                        key={i}
                        className={`shimmer-line h-5 rounded-full`}
                        style={{ width: w }}
                    />
                ))}
            </div>
            <div className="flex gap-4">
                <div className="shimmer-line h-3 w-24 rounded" />
                <div className="shimmer-line h-3 w-16 rounded" />
            </div>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="card p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-text-primary font-medium mb-1">
                No results found
            </h3>
            <p className="text-text-secondary text-sm">{message}</p>
        </div>
    );
}
