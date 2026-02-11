/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Orange - Brand Accent, Buttons, CTAs
        primary: {
          50: '#fef7ed',
          100: '#fdecd6',
          200: '#fbd5ac',
          300: '#F5B041', // Light Orange / Golden
          400: '#f4a32a',
          500: '#F39C12', // Primary Orange
          600: '#E67E22', // Dark Orange
          700: '#c45d0a',
          800: '#9c4a10',
          900: '#7d3e11',
        },
        // Secondary Blue - Headings, Links, Brand Text
        secondary: {
          50: '#eef1f8',
          100: '#d9e0f0',
          200: '#b8c5e3',
          300: '#8da3d1',
          400: '#5f7dba',
          500: '#2E4DA7', // Secondary Blue (lighter)
          600: '#1F3C88', // Primary Blue
          700: '#1a3270',
          800: '#172a5c',
          900: '#14234d',
        },
        // Neutral Colors
        neutral: {
          50: '#F4F6F7', // Light Gray (background)
          100: '#e8ebec',
          200: '#d4d9db',
          300: '#b5bdc0',
          400: '#8f9a9e',
          500: '#6b7880',
          600: '#576269',
          700: '#495158',
          800: '#2C2C2C', // Dark Gray (text)
          900: '#1a1a1a',
        },
        // Royal Blue - Logo-matching (header, strong sections)
        royal: {
          50: '#F4F7FB',
          600: '#1E2A78',
          700: '#182366',
          800: '#141B52',
        },
        // Accent colors for status/alerts
        accent: {
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2C2C2C',
            a: {
              color: '#1F3C88',
              '&:hover': {
                color: '#2E4DA7',
              },
            },
            h1: { color: '#1F3C88' },
            h2: { color: '#1F3C88' },
            h3: { color: '#2C2C2C' },
            h4: { color: '#2C2C2C' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
