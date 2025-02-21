import type { Config } from "tailwindcss";
import daisyui from 'daisyui';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Clash Display', 'sans-serif'],
      'sf-pro': ['SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      fontFamily: {
        'clash-display': ['Clash Display', 'sans-serif'],
      },
      colors: {
        'rich-brown': {
          DEFAULT: '#2C1810', // Marron très foncé pour remplacer le noir
          50: '#F9F6F5',
          100: '#EBE5E3',
          200: '#D5C8C4',
          300: '#B8A199',
          400: '#8C6B60',
          500: '#5D463E',
          600: '#4A372F',
          700: '#382A24',
          800: '#2C1810', // Notre couleur principale
          900: '#1A0E09',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'nav-gradient-light': 'linear-gradient(135deg, rgb(37 99 235 / 0.4), transparent, rgb(22 163 74 / 0.4))',
        'nav-gradient-dark': 'linear-gradient(135deg, rgb(249 115 22 / 0.4), transparent, rgb(251 146 60 / 0.4))',
        'button-gradient': 'linear-gradient(90deg, #f97316, #22c55e, #3b82f6)',
      },
      boxShadow: {
        'neon-light': '0 4px 16px -1px rgb(37 99 235 / 0.3)',
        'neon-dark': '0 4px 16px -1px rgb(249 115 22 / 0.3)',
      },
      keyframes: {
        'appear': {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        'gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'opacity-in': {
          'from': {
            opacity: '0',
            visibility: 'hidden'
          },
          'to': {
            opacity: '1',
            visibility: 'visible'
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'reveal-text': {
          '0%': {
            width: '0%'
          },
          '100%': {
            width: '100%'
          }
        },
        'cursor-blink': {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0'
          }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        blob: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -30px) scale(1.1)',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '75%': {
            transform: 'translate(-30px, -20px) scale(1.05)',
          },
        },
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'appear': 'appear 4.23s ease-out forwards',
        'gradient': 'gradient 3s linear infinite',
        'opacity-in': 'opacity-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'reveal-text': 'reveal-text 1s ease-out forwards',
        'cursor-blink': 'cursor-blink 0.7s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'blob': 'blob 10s infinite',
        'scroll-bounce': 'scroll-bounce 1.5s ease-in-out infinite',
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#16a34a",          // Green
          "primary-focus": "#f97316",    // Orange overlay
          "secondary": "#2563eb",        // Blue
          "accent": "#f97316",           // Orange
          "neutral": "#2C1810",          // Marron très foncé
          "base-100": "#ffffff",         // White
          "base-200": "#f3f4f6",         // Light Gray
          "base-300": "#e5e7eb",         // Lighter Gray
          "base-content": "#2C1810",     // Text Color
          "info": "#3abff8",             // Info Blue
          "success": "#36d399",          // Success Green
          "warning": "#fbbd23",          // Warning Yellow
          "error": "#f87272",            // Error Red
        },
        dark: {
          "primary": "#22c55e",          // Green
          "primary-focus": "#fb923c",    // Orange overlay
          "secondary": "#3b82f6",        // Blue
          "accent": "#fb923c",           // Orange
          "neutral": "#1e293b",          // Navy
          "base-100": "#0f172a",         // Dark Blue
          "base-200": "#1e293b",         // Darker Blue
          "base-300": "#334155",         // Darkest Blue
          "base-content": "#F9F6F5",     // Text Color
          "info": "#38bdf8",             // Info Blue
          "success": "#4ade80",          // Success Green
          "warning": "#fbbf24",          // Warning Yellow
          "error": "#f87171",            // Error Red
        }
      }
    ],
  }
};

export default config;
