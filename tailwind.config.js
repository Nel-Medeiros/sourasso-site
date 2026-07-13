/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EDE3',
        'rose-gold': '#C17B5A',
        terracotta: '#9B5E42',
        'dark-brown': '#3D1F0F',
      },
      fontFamily: {
        brand: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
