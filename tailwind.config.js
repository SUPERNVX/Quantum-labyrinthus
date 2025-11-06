/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          primary: '#4F46E5',
          secondary: '#818CF8',
          accent: '#06B6D4',
          dark: '#1E293B',
          light: '#F1F5F9'
        }
      }
    },
  },
  plugins: [],
}