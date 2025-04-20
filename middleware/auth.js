// export default function ({ store, redirect, route }) {
//   const authStore = useAuthStore();
//   if (!authStore.isAuthenticated && route.path.startsWith("/profile")) {
//     return redirect("/auth");
//   }
// }

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated && to.path.startsWith("/profile")) {
    return navigateTo("/auth");
  }
});
