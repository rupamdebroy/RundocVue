<template>
  <header
    class="bg-white shadow-md py-4 px-6 flex justify-between items-center"
  >
    <div class="text-2xl font-bold lowercase text-gray-900">rundoc</div>
    <nav class="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
      <a href="/" class="hover:text-blue-600">home</a>
      <a href="/doctors" class="hover:text-blue-600">doctors</a>
      <a href="/clinics" class="hover:text-blue-600">clinics</a>
    </nav>
    <div class="flex items-center space-x-4">
      <button class="text-black hover:text-blue-600">
        <i class="fas fa-search"></i>
      </button>
      <button class="text-black hover:text-blue-600">
        <i class="fas fa-shopping-cart"></i>
      </button>
      <div v-if="authStore.isAuthenticated" class="relative">
        <button
          @click="toggleDropdown"
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
        >
          {{
            authStore.userInfo.fullName
              ? authStore.userInfo.fullName.charAt(0)
              : "U"
          }}
        </button>
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2"
        >
          <router-link
            :to="profileRoute"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="navigateToProfile"
          >
            View Profile Info
          </router-link>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
      <router-link
        v-else
        to="/auth"
        class="px-4 py-1 border border-black text-sm text-black rounded hover:bg-black hover:text-white transition"
      >
        Login/Register
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const showDropdown = ref(false);

const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const navigateToProfile = () => {
  console.log("Navigating to profile:", profileRoute.value);
  showDropdown.value = false;
  router.push(profileRoute.value);
};

const logout = () => {
  authStore.logout();
  showDropdown.value = false;
  router.push("/");
};
</script>

<style scoped>
header {
  position: relative;
}
</style>
