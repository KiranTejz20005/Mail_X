/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        mail: {
          bg: '#07070f',
          surface: '#0f0f1a',
          card: '#141422',
          border: 'rgba(139, 92, 246, 0.15)',
          accent: '#8b5cf6',
        },
      },
      animation: {
        'pulse-slow': 'pulse-glow 4s ease-in-out infinite',
        'pulse-slower': 'pulse-glow 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.15', transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
