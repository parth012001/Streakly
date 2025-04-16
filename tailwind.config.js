/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        celebration: {
          '0%': { 
            transform: 'scale(0) rotate(0deg)',
            opacity: 0 
          },
          '50%': { 
            transform: 'scale(1.5) rotate(180deg)',
            opacity: 1 
          },
          '100%': { 
            transform: 'scale(1) rotate(360deg) translate(100px, -100px)',
            opacity: 0 
          }
        }
      },
      animation: {
        'celebration': 'celebration 1s ease-out forwards',
      }
    },
  },
  plugins: [],
} 