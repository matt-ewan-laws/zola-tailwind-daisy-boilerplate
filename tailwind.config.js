/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{css|js}', './templates/**/*.html', './src/main.css'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ["retro", "cupcake", "dark"]
  }
}

