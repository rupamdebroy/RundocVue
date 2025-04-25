export default defineNuxtConfig({
  ssr: true, // Enable SSR (this is usually true by default)
 
  build: {
    transpile: ["@tailwindcss"],
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  css: [
    "@fortawesome/fontawesome-free/css/all.min.css",
    "~/assets/css/main.css",
  ],
  plugins: ["~/plugins/auth.js"],
  devtools: { enabled: true },
  compatibilityDate: "2025-04-20",
});
