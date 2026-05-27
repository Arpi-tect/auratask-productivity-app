/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support toggling if required, defaults to dark
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#030712', // deep background
          800: '#1f2937', // dark cards
          700: '#374151', // borders/borders
        },
        brand: {
          primary: '#6366f1', // Indigo
          secondary: '#a855f7', // Purple
          accent: '#ec4899', // Pink glow
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
        'pulse-slow': "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
