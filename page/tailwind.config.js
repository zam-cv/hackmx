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
        'hack-grey': '#555555',
        'hack-color-input': '#F1F3F6'
      },
      boxShadow: {
        'blue-xl': '0 20px 25px -5px #1E2772, 0 2px 2px -10px #1E2772',
      },
    }
  },
  
  plugins: [],
}

