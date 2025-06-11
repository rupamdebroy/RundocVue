<template>
  <nav
    v-if="isMobileOrTablet"
    class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 px-6 z-50"
  >
    <div class="flex justify-around">
      <NuxtLink
        to="/"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-home text-xl"></i>
        <span class="text-xs mt-1">Home</span>
      </NuxtLink>
      <NuxtLink
        :to="`/find-doctor?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-user-md text-xl"></i>
        <span class="text-xs mt-1">Doctor</span>
      </NuxtLink>
      <NuxtLink
        :to="`/find-clinic?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-clinic-medical text-xl"></i>
        <span class="text-xs mt-1">Clinic</span>
      </NuxtLink>
      <NuxtLink
        :to="`/labtest?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-vial text-xl"></i>
        <span class="text-xs mt-1">Test</span>
      </NuxtLink>
      <div class="relative">
        <button
          @click="toggleMoreDropdown"
          class="flex flex-col items-center text-gray-700 hover:text-green-600 focus:outline-none"
        >
          <i class="fas fa-ellipsis-h text-xl"></i>
          <span class="text-xs mt-1">More</span>
        </button>
        <div
          v-if="showMoreDropdown"
          class="absolute bottom-full mb-2 w-32 bg-white border rounded-md shadow-lg"
        >
          <NuxtLink
            :to="`/pharmacy?location=${locationStore.currentLocation}`"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Medicine
          </NuxtLink>
          <NuxtLink
            :to="`/find-ambulance?location=${locationStore.currentLocation}`"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Ambulance
          </NuxtLink>
          <NuxtLink
            :to="`/home-care?location=${locationStore.currentLocation}`"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home Care
          </NuxtLink>
          <NuxtLink
            to="/blood-doner"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Blood Donor
          </NuxtLink>
        </div>
      </div>
      <NuxtLink
        to="/help"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-question-circle text-xl"></i>
        <span class="text-xs mt-1">Help</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
const showMoreDropdown = ref(false);
const isMobileOrTablet = ref(false);

const updateScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1024; // Tablet and mobile breakpoint
};

onMounted(() => {
  updateScreenSize(); // Initial check
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

const toggleMoreDropdown = () => {
  showMoreDropdown.value = !showMoreDropdown.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showMoreDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Ensure content isn't hidden behind fixed nav on mobile */
@media (max-width: 1024px) {
  body {
    padding-bottom: 80px; /* Height of bottom nav */
  }
}

/* Style the dropdown */
.absolute {
  left: 50%;
  transform: translateX(-50%);
}
</style>
