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
        parking: {
          free: '#10b981',      // Emerald green
          occupied: '#ef4444',  // Red
          reserved: '#3b82f6',  // Blue
          disabled: '#6b7280',  // Gray
          ev: '#06b6d4',        // Cyan
          ladies: '#ec4899',    // Pink
          vip: '#f59e0b',       // Amber
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
        '4k': '2560px',
      }
    },
  },
  plugins: [],
}
