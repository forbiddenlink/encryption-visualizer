/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: 'var(--accent)',
          blue: 'var(--action)',
          purple: '#8b5cf6',
          dark: 'var(--canvas)',
          surface: 'var(--surface)',
          border: 'var(--line)',
        }
      },
      borderRadius: {
        'card': '12px',
      },
      spacing: {
        '18': '4.5rem',
      },
      boxShadow: {
        'surface': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'surface-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
