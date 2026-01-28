/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00f0ff',
        'cyber-light': '#a5f3fc',
        'cyber-pale': '#e0f2fe',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', filter: 'blur(2px)' },
          '50%': { opacity: '1', filter: 'blur(4px)' },
        }
      }
    },
  },
  plugins: [],
}
