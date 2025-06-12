<template>
  <section class="relative bg-white text-gray-900 overflow-hidden">
    <!-- Left Banner (Absolute but visually sticky within hero) -->
    <div
      class="hidden lg:block absolute top-32 left-0 z-10"
      style="position: absolute"
    >
      <div
        class="h-[500px] w-44 bg-gray-200 rounded-xl mx-4 shadow-md flex items-center justify-center"
      >
        <span class="text-xs text-center">Ad Banner Left</span>
      </div>
    </div>

    <!-- Right Banner -->
    <div
      class="hidden lg:block absolute top-32 right-0 z-10"
      style="position: absolute"
    >
      <div
        class="h-[500px] w-44 bg-gray-200 rounded-xl mx-4 shadow-md flex items-center justify-center"
      >
        <span class="text-xs text-center">Ad Banner Right</span>
      </div>
    </div>

    <!-- Main Centered Content -->
    <div class="max-w-4xl mx-auto px-4 py-20 text-center relative z-20">
      <h2 class="text-sm uppercase tracking-wider outfit-medium text-gray-600">
        India’s <span class="font-bold text-black">Largest</span> Doctor
        Appointment Booking Platform
      </h2>

      <h1
        class="text-4xl md:text-7xl outfit-bold mt-4 leading-tight py-4 text-hero"
      >
        <transition name="fade" mode="out-in">
          <span :key="currentAnimatedText" class="inline-block">
            {{ currentAnimatedText }}
          </span>
        </transition>
        ,<br class="hidden md:block" />
        Make an Appointment
      </h1>

      <p class="mt-4 poppins-regular text-base md:text-lg text-gray-600">
        Discover the best doctors & clinics in the city nearest you
      </p>

      <div class="relative mt-10 mx-auto max-w-2xl w-full">
        <input
          type="text"
          :placeholder="currentPlaceholder"
          @input="handleSearch"
          class="w-full py-3 px-5 rounded-full border border-gray-300 bg-gray-100 poppins-regular text-base focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-gray-900 placeholder-gray-500"
        />
        <div
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
        </div>

        <div
          v-if="searchResults.length > 0"
          class="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto text-left"
        >
          <NuxtLink
            v-for="result in searchResults"
            :key="result.id"
            :to="
              result.type === 'doctor'
                ? `/find-doctor?location=${locationStore.currentLocation}`
                : `/clinics`
            "
            class="block px-4 py-3 text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-200 outfit-regular"
          >
            {{ result.name }} ({{
              result.type === "doctor" ? "Doctor" : "Clinic"
            }})
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useLocationStore } from "@/stores/location";

// Location Store
const locationStore = useLocationStore();

// Animated Placeholder in Search Input
const currentPlaceholder = ref("Search Doctor");
const placeholderOptions = [
  "Search Doctor",
  "Search Clinic",
  "Search Hospital",
  "Lab Tests & Diagnostics",
  "Medicines",
  "Ambulance",
  "Home Care Service",
  "Blood Donor",
];

let placeholderIndex = 0;
let placeholderInterval = null;
const animatePlaceholder = () => {
  placeholderIndex = (placeholderIndex + 1) % placeholderOptions.length;
  currentPlaceholder.value = placeholderOptions[placeholderIndex];
};

// Animated Main Heading Text
const animatedTexts = [
  "Search Doctor",
  "Search Clinic",
  "Search Hospital",
  "Search Lab Tests",
  "Search Medicines",
  "Search Ambulance",
  "Search Blood Donor",
  "Search Home Care",
];
const currentAnimatedText = ref(animatedTexts[0]);
let animatedIndex = 0;
let textAnimationInterval = null;
const animateMainText = () => {
  animatedIndex = (animatedIndex + 1) % animatedTexts.length;
  currentAnimatedText.value = animatedTexts[animatedIndex];
};

onMounted(() => {
  placeholderInterval = setInterval(animatePlaceholder, 2000);
  textAnimationInterval = setInterval(animateMainText, 3200);
});

onUnmounted(() => {
  clearInterval(placeholderInterval);
  clearInterval(textAnimationInterval);
});

// Search Logic (Mock)
const searchResults = ref([]);
const mockData = [
  { id: 1, name: "Dr. John Doe", type: "doctor" },
  { id: 2, name: "Dr. Jane Smith", type: "doctor" },
  { id: 3, name: "City Clinic", type: "clinic" },
  { id: 4, name: "HealthFirst Clinic", type: "clinic" },
];

const handleSearch = (event) => {
  const query = event.target.value.toLowerCase();
  if (query.length < 2) {
    searchResults.value = [];
    return;
  }
  searchResults.value = mockData.filter((item) =>
    item.name.toLowerCase().includes(query)
  );
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
