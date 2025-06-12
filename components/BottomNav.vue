<template>
  <nav
    v-if="isMobileOrTablet"
    class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md py-3 px-4 z-50"
  >
    <div class="flex justify-between items-center text-black text-sm">
      <!-- Home -->
      <NuxtLink
        to="/"
        class="flex flex-col items-center gap-1 hover:text-black/80"
      >
        <i class="fas fa-home text-lg"></i>
        <span>home</span>
      </NuxtLink>

      <!-- Doctor -->
      <NuxtLink
        :to="`/find-doctor?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center gap-1 hover:text-black/80"
      >
        <i class="fas fa-user-md text-lg"></i>
        <span>doctor</span>
      </NuxtLink>

      <!-- Clinic -->
      <NuxtLink
        :to="`/find-clinic?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center gap-1 hover:text-black/80"
      >
        <i class="fas fa-clinic-medical text-lg"></i>
        <span>clinic</span>
      </NuxtLink>

      <!-- Test -->
      <NuxtLink
        :to="`/labtest?location=${locationStore.currentLocation}`"
        class="flex flex-col items-center gap-1 hover:text-black/80"
      >
        <i class="fas fa-vial text-lg"></i>
        <span>test</span>
      </NuxtLink>

      <!-- More dropdown -->
      <div class="relative">
        <button
          @click="toggleMoreDropdown"
          class="flex flex-col items-center gap-1 hover:text-black/80 focus:outline-none"
        >
          <i class="fas fa-ellipsis-h text-lg"></i>
          <span>more</span>
        </button>

        <!-- Dropdown -->
        <transition name="fade">
          <div
            v-if="showMoreDropdown"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-white border shadow-lg rounded-lg py-2"
          >
            <NuxtLink
              :to="`/pharmacy?location=${locationStore.currentLocation}`"
              class="block px-4 py-2 hover:bg-gray-100 text-sm"
              >medicine</NuxtLink
            >
            <NuxtLink
              :to="`/find-ambulance?location=${locationStore.currentLocation}`"
              class="block px-4 py-2 hover:bg-gray-100 text-sm"
              >ambulance</NuxtLink
            >
            <NuxtLink
              :to="`/home-care?location=${locationStore.currentLocation}`"
              class="block px-4 py-2 hover:bg-gray-100 text-sm"
              >home care</NuxtLink
            >
            <NuxtLink
              to="/blood-doner"
              class="block px-4 py-2 hover:bg-gray-100 text-sm"
              >blood donor</NuxtLink
            >
          </div>
        </transition>
      </div>

      <!-- Help -->
      <NuxtLink
        to="/help"
        class="flex flex-col items-center gap-1 hover:text-black/80"
      >
        <i class="fas fa-question-circle text-lg"></i>
        <span>help</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
const showMoreDropdown = ref(false);
const isMobileOrTablet = ref(false);

const updateScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1024;
};

const toggleMoreDropdown = () => {
  showMoreDropdown.value = !showMoreDropdown.value;
};

const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showMoreDropdown.value = false;
  }
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Make space for bottom nav */
@media (max-width: 1024px) {
  body {
    padding-bottom: 72px;
  }
}

/* Simple fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
