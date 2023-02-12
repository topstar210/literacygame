/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        custom: "rgb(22 78 99)"
      },
      backgroundImage: {
        gradient: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 49%, rgba(230,231,231,1) 100%)"
      }
    },
  },
  plugins: [],
}