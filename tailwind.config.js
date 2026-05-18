/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#005f99",
        primary: "#006941",
        "primary-container": "#7bfeb8",
        "on-primary": "#caffdc",
        background: "#ddffe2",
        "on-surface": "#0b361d",
        "on-surface-variant": "#3b6447",
        surface: "#ddffe2",
        "surface-container": "#bef5c9",
        "surface-container-low": "#cafdd4",
        "surface-container-lowest": "#ffffff",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans"],
        body: ["Manrope"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "2rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
