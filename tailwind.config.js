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
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          neon: '#00E676',       // Gen Z Electric Neon Green
          electric: '#05F292',   // Cyber Mint Accent
          forest: '#0A2914',     // Deep Forest Green
          dark: '#08170D',       // Dark Mesh Base
          brand: '#16A34A',
          mint: '#10B981',
        },
        cyber: {
          purple: '#8B5CF6',
          violet: '#6366F1',
          cyan: '#06B6D4',
          pink: '#EC4899',
        },
        gold: {
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          neon: '#FFD700',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F8FAF9',
          card: '#FFFFFF',
          subtle: '#F1F5F3',
          border: '#E2E8F0',
          hover: '#E8F5EE',
          dark: '#0B130E',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        status: {
          success: '#16A34A',
          warning: '#EA580C',
          pending: '#0284C7',
          error: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 2px 8px rgba(22, 163, 74, 0.06)',
        'eco-soft': '0 4px 16px rgba(22, 163, 74, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'eco-card': '0 8px 24px rgba(22, 163, 74, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'eco-float': '0 12px 32px -4px rgba(22, 163, 74, 0.18), 0 6px 12px -4px rgba(0, 0, 0, 0.08)',
        'neon-glow': '0 0 24px rgba(0, 230, 118, 0.35)',
        'gold-glow': '0 0 24px rgba(255, 215, 0, 0.35)',
        'cyber-glow': '0 0 24px rgba(139, 92, 246, 0.3)',
      },
      borderRadius: {
        'card': '22px',
        'card-lg': '26px',
        'card-xl': '32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'radar': 'radar 2s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        radar: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        }
      }
    },
  },
  plugins: [],
};
