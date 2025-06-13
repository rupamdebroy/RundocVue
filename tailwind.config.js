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
    extend: {
      rotate: {
        "y-180": "rotateY(180deg)",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
    },
  },
  plugins: [], // You can add Tailwind plugins here later
};
