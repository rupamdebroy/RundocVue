export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.path.startsWith("/profile")) {
    return navigateTo("/auth");
  }
});
