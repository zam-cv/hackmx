/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sulphur': ['"Sulphur Point"', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'hack-blue': '#1E2772',
        'hack-grey': '#555555' // Añade un azul personalizado
      }
    }
  },
  
  plugins: [],
}

