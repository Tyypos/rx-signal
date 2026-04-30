export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface-0/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Logo mark */}
                    <div className="relative w-7 h-7 flex-shrink-0">
                        <svg
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7"
                        >
                            <defs>
                                <linearGradient
                                    id="logo-grad"
                                    x1="0"
                                    y1="0"
                                    x2="28"
                                    y2="28"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            <rect
                                width="28"
                                height="28"
                                rx="7"
                                fill="url(#logo-grad)"
                                opacity="0.15"
                            />
                            <path
                                d="M8 18 L8 10 Q8 8 10 8 L14 8 Q17 8 17 11.5 Q17 15 14 15 L8 15"
                                stroke="url(#logo-grad)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <path
                                d="M14 15 L18 20"
                                stroke="url(#logo-grad)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="21"
                                cy="14"
                                r="2.5"
                                stroke="#06b6d4"
                                strokeWidth="1.5"
                                fill="none"
                            />
                            <circle cx="21" cy="14" r="0.8" fill="#06b6d4" />
                        </svg>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-[15px] font-semibold tracking-tight text-text-primary">
                            RxSignal
                        </span>
                        <span className="hidden sm:inline text-[11px] text-text-tertiary font-medium uppercase tracking-widest">
                            FDA Event Explorer
                        </span>
                    </div>
                </div>

                <nav className="flex items-center gap-1">
                    <a
                        href="https://open.fda.gov/apis/drug/event/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-150"
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        openFDA Docs
                    </a>
                    <a
                        href="https://github.com/Tyypos/rx-signal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-150"
                        aria-label="GitHub"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>
                </nav>
            </div>
        </header>
    );
}
