const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require("tailwindcss/colors");

module.exports = withMT({
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        slate: colors.slate,
        white: "#ffffff",
        // Modern Indigo/Violet Palette
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Main Brand Color
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Dark Mode Backgrounds
        "dark-bg": "#0f172a", // Slate 900 - Rich dark blue/black
        "dark-secondary": "#1e293b", // Slate 800
        "dark-tertiary": "#334155", // Slate 700
        "stroke-dark": "#475569", // Slate 600

        // Accents
        "accent-success": "#10b981",
        "accent-warning": "#f59e0b",
        "accent-error": "#ef4444",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", // Indigo to Violet
        "gradient-dark": "linear-gradient(to bottom right, #0f172a, #1e293b)",
        "glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
      },
    },
  },
  plugins: [],
});