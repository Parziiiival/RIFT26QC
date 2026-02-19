import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      keyframes: {
        "glow": {
          "0%, 100%": { "box-shadow": "0 0 5px rgba(59, 130, 246, 0.5)" },
          "50%": { "box-shadow": "0 0 20px rgba(59, 130, 246, 0.8)" }
        },
        "pulse-slow": {
          "0%, 100%": { "opacity": "1" },
          "50%": { "opacity": "0.5" }
        }
      },
      animation: {
        "glow": "glow 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};

export default config;
