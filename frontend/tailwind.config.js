/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#08080a",
          1: "#0f0f12",
          2: "#141418",
          3: "#1c1c22",
          4: "#242430",
        },
        border: {
          subtle: "#1e1e26",
          base: "#2a2a36",
          strong: "#3a3a4a",
        },
        accent: {
          purple: "#8b5cf6",
          "purple-dim": "#6d46d6",
          blue: "#3b82f6",
          cyan: "#06b6d4",
        },
        text: {
          primary: "#f2f2f5",
          secondary: "#9898a8",
          tertiary: "#5a5a6a",
          inverse: "#0a0a0c",
        },
        outcome: {
          recovered: "#10b981",
          recovering: "#3b82f6",
          fatal: "#ef4444",
          unknown: "#6b7280",
          sequelae: "#f59e0b",
          "not-recovered": "#f97316",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 1.8s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
