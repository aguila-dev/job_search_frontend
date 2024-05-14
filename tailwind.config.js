/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '1/3': '33.333333%',
      },
      height: {
        full: '100%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}