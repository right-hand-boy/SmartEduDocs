/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkGreen: "#59A52C",
        deepGreen: "#04A118",
        brightGreen: "#05D31F",
        lightGreen: "#6FCA3A",
        oliveGreen: "#437D21",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
