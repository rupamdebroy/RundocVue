<template>
  <nav
    v-if="isMobileOrTablet"
    class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-md py-1.5 px-0 z-50 rounded-t-lg"
  >
    <div class="flex justify-around items-center text-gray-600 text-[10px]">
      <NuxtLink
        to="/"
        :class="getNavLinkClasses('/')"
        class="flex flex-col items-center gap-1 transition-all duration-150"
      >
        <i class="fas fa-home text-lg"></i>
        <span class="uppercase font-medium">home</span>
      </NuxtLink>

      <NuxtLink
        :to="`/find-doctor?location=${locationStore.currentLocation}`"
        :class="getNavLinkClasses('/find-doctor')"
        class="flex flex-col items-center gap-1 transition-all duration-150"
      >
        <i class="fas fa-user-md text-lg"></i>
        <span class="uppercase font-medium">doctor</span>
      </NuxtLink>

      <NuxtLink
        :to="`/find-clinic?location=${locationStore.currentLocation}`"
        :class="getNavLinkClasses('/find-clinic')"
        class="flex flex-col items-center gap-1 transition-all duration-150"
      >
        <i class="fas fa-clinic-medical text-lg"></i>
        <span class="uppercase font-medium">clinic</span>
      </NuxtLink>

      <NuxtLink
        :to="`/LabTests/${locationStore.currentLocation}`"
        :class="getNavLinkClasses('/labtest')"
        class="flex flex-col items-center gap-1 transition-all duration-150"
      >
        <i class="fas fa-vial text-lg"></i>
        <span class="uppercase font-medium">test</span>
      </NuxtLink>

      <div class="relative">
        <button
          @click="toggleMoreDropdown"
          :class="getNavLinkClasses('more-dropdown')"
          class="flex flex-col items-center gap-1 focus:outline-none transition-all duration-150"
        >
          <i class="fas fa-ellipsis-h text-lg"></i>
          <span class="uppercase font-medium">more</span>
        </button>

        <transition name="fade-slide">
          <div
            v-if="showMoreDropdown"
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-white rounded-lg shadow-md border border-gray-200 py-2 origin-bottom transform-gpu"
          >
            <NuxtLink
              :to="`/pharmacy?location=${locationStore.currentLocation}`"
              class="block px-4 py-2 hover:bg-blue-50 text-gray-800 text-xs font-medium transition-colors duration-150 capitalize flex items-center rounded-md mx-1"
              @click="showMoreDropdown = false"
              ><i class="fas fa-capsules mr-2 text-blue-500"></i
              >medicine</NuxtLink
            >
            <NuxtLink
              :to="`/find-ambulance?location=${locationStore.currentLocation}`"
              class="block px-4 py-2 hover:bg-blue-50 text-gray-800 text-xs font-medium transition-colors duration-150 capitalize flex items-center rounded-md mx-1"
              @click="showMoreDropdown = false"
              ><i class="fas fa-ambulance mr-2 text-blue-500"></i
              >ambulance</NuxtLink
            >
            <NuxtLink
              to="/home-care"
              class="block px-4 py-2 hover:bg-blue-50 text-gray-800 text-xs font-medium transition-colors duration-150 capitalize flex items-center rounded-md mx-1"
              @click="showMoreDropdown = false"
              ><i class="fas fa-hands-holding mr-2 text-blue-500"></i>home
              care</NuxtLink
            >
            <NuxtLink
              to="/blood-doner"
              class="block px-4 py-2 hover:bg-blue-50 text-gray-800 text-xs font-medium transition-colors duration-150 capitalize flex items-center rounded-md mx-1"
              @click="showMoreDropdown = false"
              ><i class="fas fa-tint mr-2 text-blue-500"></i>blood
              donor</NuxtLink
            >
          </div>
        </transition>
      </div>

      <NuxtLink
        :to="profileRoute"
        :class="getNavLinkClasses('/profile')"
        class="flex flex-col items-center gap-1 transition-all duration-150"
      >
        <i class="fas fa-user-circle text-lg"></i>
        <span class="uppercase font-medium">profile</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";

const locationStore = useLocationStore();
const authStore = useAuthStore();
const route = useRoute();

const showMoreDropdown = ref(false);
const isMobileOrTablet = ref(false);

const updateScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1024;
};

const toggleMoreDropdown = () => {
  showMoreDropdown.value = !showMoreDropdown.value;
};

const handleClickOutside = (event) => {
  const dropdownButton = event.target.closest(".relative > button");
  const dropdownPanel = event.target.closest(".relative > div.absolute");

  if (!dropdownButton && !dropdownPanel) {
    showMoreDropdown.value = false;
  }
};

const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

const getNavLinkClasses = (linkPath) => {
  let isActive = false;

  if (linkPath === "more-dropdown") {
    const dropdownPaths = [
      `/pharmacy`,
      `/find-ambulance`,
      `/home-care`,
      `/blood-doner`,
    ];
    isActive = dropdownPaths.some((path) => route.path.startsWith(path));
    if (showMoreDropdown.value) isActive = true;
  } else if (linkPath === "/") {
    isActive = route.path === "/";
  } else if (linkPath === "/profile") {
    isActive = route.path.startsWith("/profile");
  } else {
    isActive = route.path.startsWith(linkPath);
  }

  return {
    "text-blue-700 bg-blue-100 font-bold rounded-lg": isActive,
    "hover:bg-blue-50 hover:text-blue-700": !isActive,
    "py-1.5 px-2": true,
  };
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
@media (max-width: 1024px) {
  body {
    padding-bottom: 60px;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
