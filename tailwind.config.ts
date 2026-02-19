import type { Config } from "tailwindcss"

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e27",
        foreground: "#e0e7ff",
        card: "#1a1f3a",
        "card-hover": "#252d4a",
        accent: "#00d9ff",
        danger: "#ff4444",
        success: "#44ff44",
        warning: "#ffaa00",
        muted: "#6b7280",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
