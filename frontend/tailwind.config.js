/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e5ecff',
          200: '#cbdcfd',
          300: '#97bdfa',
          400: '#5e96f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        civic: {
          teal: '#0f766e',
          tealLight: '#0d9488',
          amber: '#d97706',
          rose: '#be123c'
        }
      }
    }
  },
  plugins: []
};
