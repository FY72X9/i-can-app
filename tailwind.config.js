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
        },
        gold: {
          400: '#FFCA28',
          500: '#FFB800',
          600: '#E5A93C', // Gamification Coin Gold
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8F9FA',
          subtle: '#F0F4F1',
          border: '#E2E8F0',
        },
        text: {
          primary: '#1A1C1E',
          secondary: '#5A6065',
          muted: '#8A929A',
        },
        status: {
          success: '#2E7D32',
          warning: '#ED6C02',
          pending: '#0288D1',
          error: '#D32F2F',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'eco-soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'eco-card': '0 6px 16px rgba(30, 86, 49, 0.06)',
        'eco-float': '0 10px 25px -5px rgba(30, 86, 49, 0.12), 0 8px 10px -6px rgba(30, 86, 49, 0.08)',
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '24px',
      }
    },
  },
  plugins: [],
};
