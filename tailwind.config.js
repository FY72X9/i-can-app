/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#F0F9F3',
          100: '#DDF0E3',
          200: '#BCE2C9',
          300: '#8ECDAB',
          400: '#4CAF50',
          500: '#2E8B57', // Accent Mint
          600: '#1E5631', // Primary Deep Eco Green
          700: '#164326',
          800: '#11351E',
          900: '#0C2716',
          brand: '#1E5631',
          mint: '#2E8B57',
          forest: '#143D23',
          emerald: '#10B981',
        },
        gold: {
          300: '#FFE082',
          400: '#FFCA28',
          500: '#FFB800',
          600: '#E5A93C', // Gamification Coin Gold
          700: '#C78E29',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8FAF8',
          card: '#FFFFFF',
          subtle: '#F1F5F2',
          border: '#E2E8F0',
          hover: '#EBF3ED',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#9CA3AF',
        },
        status: {
          success: '#15803D',
          warning: '#D97706',
          pending: '#0284C7',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 2px 8px rgba(30, 86, 49, 0.05)',
        'eco-soft': '0 4px 16px rgba(30, 86, 49, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'eco-card': '0 8px 24px rgba(30, 86, 49, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'eco-float': '0 12px 32px -4px rgba(30, 86, 49, 0.16), 0 6px 12px -4px rgba(30, 86, 49, 0.08)',
        'eco-glow': '0 0 24px rgba(46, 139, 87, 0.25)',
        'gold-glow': '0 0 20px rgba(255, 184, 0, 0.28)',
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
        'card-xl': '28px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
