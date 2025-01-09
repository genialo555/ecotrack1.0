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
    },
    extend: {
      fontFamily: {
        'clash-display': ['Clash Display', 'sans-serif'],
      },
      colors: {
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
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'reveal-text': 'reveal-text 1s ease-out forwards',
        'cursor-blink': 'cursor-blink 0.7s ease-in-out infinite'
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
          "neutral": "#1f2937",          // Dark Gray
          "base-100": "#ffffff",         // White
          "base-200": "#f3f4f6",         // Light Gray
          "base-300": "#e5e7eb",         // Lighter Gray
          "base-content": "#1f2937",     // Text Color
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
          "base-content": "#f8fafc",     // Text Color
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
