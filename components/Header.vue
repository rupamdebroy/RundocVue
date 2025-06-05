<template>
  <header
    class="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm"
  >
    <!-- Logo -->
    <div class="text-2xl font-bold lowercase text-gray-900">rundoc</div>

    <!-- Location Dropdown -->
    <div class="flex items-center space-x-2">
      <MapPinIcon class="w-5 h-5 text-gray-700" />
      <select
        v-model="selectedLocation"
        class="border px-2 py-1 rounded text-sm text-gray-700 focus:outline-none"
      >
        <option value="" disabled>Select Location</option>
        <option
          v-for="location in locationStore.availableLocations"
          :key="location.id"
          :value="location.name"
        >
          {{ location.name }}
        </option>
      </select>
    </div>

    <!-- Right Icons & Auth Section -->
    <div class="flex items-center space-x-4">
      <button class="text-black hover:text-blue-600 transition">
        <MagnifyingGlassIcon class="w-6 h-6" />
      </button>
      <button class="text-black hover:text-blue-600 transition">
        <ShoppingCartIcon class="w-6 h-6" />
      </button>

      <!-- User Dropdown -->
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
          class="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50"
        >
          <NuxtLink
            :to="profileRoute"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            @click="navigateToProfile"
          >
            View Profile Info
          </NuxtLink>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Login/Register -->
      <NuxtLink
        v-else
        to="/auth"
        class="px-4 py-1 border border-black text-sm text-black rounded hover:bg-black hover:text-white transition"
      >
        Login/Register
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  MapPinIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const showDropdown = ref(false);

// Bind selectedLocation to the store
const selectedLocation = computed({
  get: () => locationStore.selectedLocation,
  set: (value) => locationStore.setLocation(value),
});

const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

// Fetch locations on component mount
onMounted(() => {
  locationStore.fetchLocations();
  authStore.restoreSession();
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const navigateToProfile = () => {
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
body {
  scroll-padding-top: 80px;
}
</style>
