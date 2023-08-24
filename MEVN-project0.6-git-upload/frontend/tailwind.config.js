/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#676EE0',
          200: '#4950DE',
          300: '#131991'
        },
        'secondary': {
          100: '#FFD633',
          200: '#FAC800',
          300: '#E0B816'
        },
        'grayBG': '#F0F0F0',
        'text': {
          100: '#707070',
          200: '#484848',
          300: '#333131'
        }
      },
      fontFamily: {
        Poppins: ['Poppins, sans-serif']
      }
    },
    container: {
      padding: '2rem',
      center: true
    }
  },
  plugins: [ require('@tailwindcss/forms') ],
}

