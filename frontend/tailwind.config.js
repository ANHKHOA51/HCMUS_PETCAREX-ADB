/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // <--- THIS IS CRITICAL
    "./pages/**/*.{js,ts,jsx,tsx}", // <--- Add this if pages are at root too
    "./*.{js,ts,jsx,tsx}",

    //
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
