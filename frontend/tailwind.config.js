/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e5ecff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af'
        },
        civic: {
          teal: '#0f766e',
          amber: '#d97706',
          rose: '#be123c'
        }
      }
    }
  },
  plugins: []
};
