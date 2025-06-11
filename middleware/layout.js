export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  nuxtApp._layout = "default"; // Force default layout
  console.log("Middleware forcing layout to:", nuxtApp._layout);
});
