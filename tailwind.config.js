/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media", // or 'media' or 'class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "1/3": "33.333333%",
      },
      height: {
        full: "100%",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("@tailwindcss/typography")],
};
