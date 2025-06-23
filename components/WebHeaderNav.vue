<template>
  <nav
    v-if="!isMobileOrTablet"
    class="bg-white shadow-sm border-b border-gray-100 py-2 sticky top-[56px] z-40"
    aria-label="Main Services Navigation"
  >
    <div class="max-w-8xl mx-auto flex justify-center items-center space-x-8">
      <NuxtLink
        v-for="service in services"
        :key="service.name"
        :to="service.path"
        class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md hover:bg-gray-50 group"
      >
        <i
          :class="service.iconClass"
          class="text-base text-gray-500 group-hover:text-blue-600 transition-colors duration-200"
        ></i>
        <span class="font-medium text-xs">{{ service.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();

const isMobileOrTablet = ref(false); // Default for SSR or initial render

// Define the service links, pulling from your provided service cards
const services = computed(() => [
  // Added Home link at the beginning
  {
    name: "Home",
    path: "/",
    iconClass: "fas fa-home", // Font Awesome home icon
  },
  {
    name: "Doctor Appointment",
    path: `/find-doctor?location=${locationStore.currentLocation}`,
    iconClass: "fas fa-user-md",
  },
  {
    name: "Find Clinics",
    path: `/find-clinic?location=${locationStore.currentLocation}`,
    iconClass: "fas fa-clinic-medical",
  },
  {
    name: "Lab Tests",
    path: `/labtest?location=${locationStore.currentLocation}`,
    iconClass: "fas fa-vial",
  },
  {
    name: "Buy Medicines",
    path: `/pharmacy?location=${locationStore.currentLocation}`,
    iconClass: "fas fa-capsules",
  },
  {
    name: "Home Care",
    path: "/home-care",
    iconClass: "fas fa-house-medical", // Adjusted to a more fitting FA icon
  },
  {
    name: "Ambulance",
    path: `/find-ambulance?location=${locationStore.currentLocation}`,
    iconClass: "fas fa-ambulance",
  },
  {
    name: "Blood Donor",
    path: "/blood-doner",
    iconClass: "fas fa-tint",
  },
]);

// Function to update screen size status
const updateScreenSize = () => {
  // Matches the breakpoint used in your BottomNav and Footer for consistency
  isMobileOrTablet.value = window.innerWidth <= 1024;
};

// Lifecycle hooks for event listeners
onMounted(() => {
  updateScreenSize(); // Set initial value
  window.addEventListener("resize", updateScreenSize); // Listen for changes
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize); // Clean up
});
</script>

<style scoped>
/* No specific scoped styles needed, Tailwind handles layout and appearance */
/* The `sticky top-[64px]` positions it right below your main header. */
/* Adjust `top-[64px]` if your main header's height changes. */
</style>
