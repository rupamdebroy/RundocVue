<template>
  <section class="relative bg-white text-gray-900 overflow-hidden">
    <div class="max-w-4xl mx-auto px-4 py-12 text-center relative z-20">
      <!-- Search Input (Now on Top) -->
      <div class="relative mx-auto max-w-2xl w-full mb-12">
        <input
          type="text"
          :placeholder="currentPlaceholder"
          @input="handleSearch"
          class="w-full py-3 px-6 text-md rounded-full border border-gray-300 bg-gray-100 poppins-regular focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-gray-900 placeholder-gray-500"
        />
        <div
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          <MagnifyingGlassIcon class="w-6 h-6" />
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

      <!-- Horizontal Banner (Now Below Search) -->
      <div
        class="w-full bg-gray-200 rounded-xl shadow-md h-36 flex items-center justify-center"
      >
        <span class="text-base text-gray-700 font-medium"
          >Horizontal Ad Banner</span
        >
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

onMounted(() => {
  placeholderInterval = setInterval(animatePlaceholder, 2000);
});

onUnmounted(() => {
  clearInterval(placeholderInterval);
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
