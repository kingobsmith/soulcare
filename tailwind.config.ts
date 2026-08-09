import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12181B",
        parchment: "#F7F3EA",
        brass: "#C9A227",
        "brass-light": "#E4C766",
        teal: "#2F5D62",
        "teal-dark": "#1F3F42",
        clay: "#8B5E3C",
        mist: "#DDE3E1"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(18,24,27,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
