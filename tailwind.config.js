/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue", // Include this line if you use an app.vue file
  ],
  theme: {
    extend: {}, // You can customize your theme here later
  },
  plugins: [], // You can add Tailwind plugins here later
};
