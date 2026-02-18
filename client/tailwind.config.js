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
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Clean Blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Dark Mode Backgrounds - Pitch Black Aesthetic
        "dark-bg": "#000000",
        "dark-secondary": "#0d0d0d",
        "dark-tertiary": "#1a1a1a",
        "stroke-dark": "#262626",

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