/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eef2fb',
          100: '#d9e2f6',
          200: '#b8c9ee',
          300: '#8baae2',
          400: '#5c87d4',
          500: '#2b4695',
          600: '#2b4695',
          700: '#243b7d',
          800: '#1e3066',
          900: '#192854',
          950: '#0f1833',
        },
        indigo: {
          50: '#eef2fb',
          100: '#d9e2f6',
          200: '#b8c9ee',
          300: '#8baae2',
          400: '#5c87d4',
          500: '#2b4695',
          600: '#2b4695',
          700: '#243b7d',
          800: '#1e3066',
          900: '#192854',
          950: '#0f1833',
        },
        parking: {
          free: '#10b981',      // Emerald green
          occupied: '#ef4444',  // Red
          reserved: '#2b4695',  // #2b4695 Blue
          disabled: '#6b7280',  // Gray
          ev: '#06b6d4',        // Cyan
          ladies: '#ec4899',    // Pink
          vip: '#f59e0b',       // Amber
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Product Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'google-sans': ['"Google Sans"', '"Product Sans"', 'sans-serif'],
        poppins: ['"Google Sans"', '"Product Sans"', 'sans-serif'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '500',
        bold: '500',
        extrabold: '500',
        black: '500',
      },
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.15rem' }], // 13px
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'sm': ['0.96875rem', { lineHeight: '1.4rem' }],  // 15.5px
        'base': ['1.0625rem', { lineHeight: '1.6rem' }], // 17px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        'xl': ['1.4375rem', { lineHeight: '1.9rem' }],   // 23px
        '2xl': ['1.75rem', { lineHeight: '2.2rem' }],   // 28px
        '3xl': ['2.125rem', { lineHeight: '2.5rem' }],   // 34px
      },
      screens: {
        '3xl': '1920px',
        '4k': '2560px',
      }
    },
  },
  plugins: [],
}
