/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          surface: 'rgba(255, 255, 255, 0.08)',
          'surface-hover': 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.18)',
          'dark-surface': 'rgba(15, 23, 42, 0.45)',
          'dark-border': 'rgba(255, 255, 255, 0.08)',
        }
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-card-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.35), inset 0 1px 2px 0 rgba(255, 255, 255, 0.5)',
        'glass-glow': '0 0 20px 2px rgba(99, 102, 241, 0.4)',
        'glass-glow-cyan': '0 0 25px 3px rgba(6, 182, 212, 0.45)',
        'glass-input': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'liquid-blob': 'blob 10s infinite ease-in-out',
        'liquid-blob-delayed': 'blob 10s infinite ease-in-out 4s',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.15)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
};
