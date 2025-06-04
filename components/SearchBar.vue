<template>
  <div class="relative mt-6 mx-auto max-w-2xl">
    <input
      type="text"
      :placeholder="currentPlaceholder"
      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
      @input="handleSearch"
    />
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
      <MagnifyingGlassIcon class="w-5 h-5 text-gray-500" />
    </div>

    <!-- Dropdown for search results -->
    <div
      v-if="searchResults.length > 0"
      class="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10"
    >
      <NuxtLink
        v-for="result in searchResults"
        :key="result.id"
        :to="
          result.type === 'doctor'
            ? `/find-doctor?location=${locationStore.currentLocation}`
            : `/clinics`
        "
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        {{ result.name }} ({{ result.type === "doctor" ? "Doctor" : "Clinic" }})
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
const currentPlaceholder = ref("Search Doctor");
const searchResults = ref([]);

// Animated placeholder text
const placeholders = [
  "Search Doctor",
  "Search Clinic",
  "Search Hospital",
  "Lab Tests & Diagnostics",
  "Medicines",
  "Ambulance",
  "Home Care Service",
  "Blood Donor",
];
let currentIndex = 0;

const animatePlaceholder = () => {
  currentIndex = (currentIndex + 1) % placeholders.length;
  currentPlaceholder.value = placeholders[currentIndex];
};

let animationInterval = null;

onMounted(() => {
  animationInterval = setInterval(animatePlaceholder, 2000); // Change every 2 seconds
});

onUnmounted(() => {
  clearInterval(animationInterval);
});

// Mock search data (since no API is available)
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
