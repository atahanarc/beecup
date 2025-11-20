/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fridge-green': '#183028', // O meşhur koyu yeşil
        'fridge-accent': '#6cc24a', // Canlı yeşil butonlar
        'fridge-cream': '#F9F8F4', // Krem zemin
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}