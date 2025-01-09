import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        // Core colors
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
          foreground: 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--color-tertiary) / <alpha-value>)',
          foreground: 'hsl(var(--color-tertiary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
          foreground: 'hsl(var(--color-accent-foreground) / <alpha-value>)',
        },
        subtle: {
          DEFAULT: 'hsl(var(--border) / <alpha-value>)',
        },

        // Semantic colors
        success: {
          DEFAULT: 'hsl(var(--color-success) / <alpha-value>)',
          foreground: 'hsl(var(--color-success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning) / <alpha-value>)',
          foreground: 'hsl(var(--color-warning-foreground) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'hsl(var(--color-error) / <alpha-value>)',
          foreground: 'hsl(var(--color-error-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'hsl(var(--color-info) / <alpha-value>)',
          foreground: 'hsl(var(--color-info-foreground) / <alpha-value>)',
        },

        // UI colors
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        destructive: 'hsl(var(--color-destructive) / <alpha-value>)',
      },
      spacing: {
        sidebar: '16rem',
        header: '4rem',
      },
      fontSize: {
        'stats-value': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'stats-label': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        card: '0px 2px 8px 0px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          '--color-primary': '222 47% 11%',
          '--color-primary-foreground': '210 40% 98%',
          '--color-secondary': '210 40% 96.1%',
          '--color-secondary-foreground': '222.2 47.4% 11.2%',
          '--color-tertiary': '217 91% 60%',
          '--color-tertiary-foreground': '210 40% 98%',
          '--color-accent': '210 40% 96.1%',
          '--color-accent-foreground': '222.2 47.4% 11.2%',
          '--color-background': '0 0% 100%',
          '--color-foreground': '222.2 84% 4.9%',
          '--color-muted': '215.4 16.3% 46.9%',
          '--color-destructive': '0 84.2% 60.2%',
          '--color-success': '142.1 76.2% 36.3%',
          '--color-warning': '38 92% 50%',
          '--color-error': '0 84.2% 60.2%',
          '--color-info': '221.2 83.2% 53.3%',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          '--color-primary': '210 40% 98%',
          '--color-primary-foreground': '222.2 47.4% 11.2%',
          '--color-secondary': '217.2 32.6% 17.5%',
          '--color-secondary-foreground': '210 40% 98%',
          '--color-tertiary': '217 91% 60%',
          '--color-tertiary-foreground': '210 40% 98%',
          '--color-accent': '217.2 32.6% 17.5%',
          '--color-accent-foreground': '210 40% 98%',
          '--color-background': '222.2 84% 4.9%',
          '--color-foreground': '210 40% 98%',
          '--color-muted': '215 20.2% 65.1%',
          '--color-destructive': '0 62.8% 30.6%',
          '--color-success': '142.1 70.6% 45.3%',
          '--color-warning': '48 96.5% 58.8%',
          '--color-error': '0 62.8% 30.6%',
          '--color-info': '217.2 91.2% 59.8%',
        },
      },
    ],
  },
}

export default config
