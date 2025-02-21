/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'system-ui',
          'sans-serif'
        ],
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        'gradient-slow': 'gradient 4s ease infinite',
        'grid-float': 'grid-float 25s linear infinite',
        'fade-in-out': 'fade-in-out 4s ease-in-out infinite',
        'fade-pulse': 'fade-pulse 6s ease-in-out infinite',
        'fade-wave': 'fade-wave 8s ease-in-out infinite',
        'chromatic-text': 'chromatic-text 8s ease-in-out infinite',
      },
      opacity: {
        '0.002': '0.002',
        '0.003': '0.003',
        '0.004': '0.004',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '200% 0',
            'opacity': '0.5',
          },
          '50%': {
            'background-position': '0 0',
            'opacity': '1',
          },
        },
        'chromatic-text': {
          '0%, 100%': {
            'opacity': '0',
            'transform': 'translate(0, 0)',
          },
          '25%': {
            'opacity': '0.3',
            'transform': 'translate(2px, -1px)',
          },
          '50%': {
            'opacity': '0.1',
            'transform': 'translate(-2px, 1px)',
          },
          '75%': {
            'opacity': '0.3',
            'transform': 'translate(-1px, -1px)',
          }
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
            'transform': 'scale(1)',
          },
          '50%': {
            'background-position': '100% 50%',
            'transform': 'scale(1.02)',
          },
        },
        'gradient-reverse': {
          '0%, 100%': {
            'background-position': '100% 50%',
            'transform': 'scale(1.02)',
          },
          '50%': {
            'background-position': '0% 50%',
            'transform': 'scale(1)',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-position': '50% 0%',
          },
          '50%': {
            'background-position': '50% 200%',
          },
        },
        'gradient-yx': {
          '0%, 100%': {
            'background-position': '200% 0%',
          },
          '25%': {
            'background-position': '200% 200%',
          },
          '50%': {
            'background-position': '0% 200%',
          },
          '75%': {
            'background-position': '0% 0%',
          }
        },
        'wave': {
          '0%, 100%': {
            transform: 'translateX(0%)',
          },
          '50%': {
            transform: 'translateX(-25%)',
          }
        },
        pulse: {
          '0%, 100%': {
            'opacity': '0.5',
          },
          '50%': {
            'opacity': '1',
          },
        },
        'grid-float': {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-2%) translateX(1%) rotate(0.5deg)' },
          '66%': { transform: 'translateY(2%) translateX(-1%) rotate(-0.5deg)' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0', transform: 'translateY(10px)' },
          '50%': { opacity: '0.75', transform: 'translateY(0)' },
        },
        'fade-pulse': {
          '0%, 100%': { opacity: '0.2' },
          '25%': { opacity: '0.5' },
          '75%': { opacity: '0.3' },
        },
        'fade-wave': {
          '0%, 100%': { opacity: '0.2', transform: 'translateY(0)' },
          '25%': { opacity: '0.6', transform: 'translateY(-5px)' },
          '50%': { opacity: '0.3', transform: 'translateY(0)' },
          '75%': { opacity: '0.5', transform: 'translateY(5px)' },
        },
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
      transitionDelay: {
        '1000': '1000ms',
      }
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#f97316",
          "primary-focus": "#ea580c",
          "primary-content": "#ffffff",
          secondary: "#22c55e",
          "secondary-focus": "#16a34a",
          "secondary-content": "#ffffff",
          accent: "#3b82f6",
          "accent-focus": "#2563eb",
          "accent-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#f97316",
          "primary-focus": "#ea580c",
          "primary-content": "#ffffff",
          secondary: "#22c55e",
          "secondary-focus": "#16a34a",
          "secondary-content": "#ffffff",
          accent: "#3b82f6",
          "accent-focus": "#2563eb",
          "accent-content": "#ffffff",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",
        },
      },
    ],
  },
}
