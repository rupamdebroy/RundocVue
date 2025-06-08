<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Lab Centers in Store = {{ labStore.labCenters.length }}</p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Lab Test & Diagnostics Page -->
        <div>
          <h1 class="text-2xl font-bold mb-4 text-center">
            Book Lab Test & Diagnostics in {{ location }}
          </h1>
          <p class="text-center text-green-600 font-semibold mb-4">
            Enjoy Free Booking – No Extra Charges!
          </p>

          <!-- Disclaimer -->
          <p class="text-center text-gray-600 mb-6">
            RUNDOC ONLY FACILITATES BOOKINGS WITH REGISTERED PARTNER
            LABORATORIES. RUNDOC DOES NOT OPERATE ANY LAB OR DIAGNOSTIC CENTER
            OF ITS OWN.
          </p>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading lab centers...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Lab Centers data -->
          <div v-else>
            <!-- Lab Center list -->
            <div v-if="labStore.labCenters.length > 0" class="space-y-4">
              <div
                v-for="lab in labStore.labCenters"
                :key="lab.id"
                class="relative flex items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                <!-- Discount Badge -->
                <span
                  class="absolute top-0 right-0 mt-2 mr-2 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                >
                  Discount up to {{ lab.discount }}%
                </span>

                <!-- Lab Photo -->
                <img
                  :src="lab.dp"
                  alt="Lab DP"
                  class="w-16 h-16 rounded-full mr-4 object-cover"
                  @error="handleImageError"
                />

                <!-- Lab details -->
                <div class="flex-1">
                  <p class="text-lg font-semibold">{{ lab.name }}</p>
                  <p class="text-sm text-gray-600">{{ lab.address }}</p>
                </div>

                <!-- Order Lab Test button -->
                <NuxtLink
                  :to="`/order-labtest?labcenterId=${lab.id}`"
                  class="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
                >
                  Order Lab Test
                </NuxtLink>
              </div>
            </div>

            <!-- No lab centers found -->
            <div v-else class="text-center">
              <p>No lab centers found in this location.</p>
            </div>

            <!-- Info message -->
            <p v-if="labStore.info" class="text-gray-600 mt-4 text-center">
              {{ labStore.info }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLabStore } from "@/stores/lab";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const labStore = useLabStore();
const locationStore = useLocationStore();

const location = ref("");
const loading = ref(false);
const error = ref("");
const debugMode = ref(true); // Enable debug mode to see logs and debug info

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  console.log("Fetching data for route:", route.query);

  // Restore location from localStorage
  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  // Use location from query if available, otherwise fall back to store
  location.value = route.query.location || locationStore.currentLocation;
  console.log("Location for Lab Test Page:", location.value);

  if (location.value && location.value !== "Select Location") {
    locationStore.setLocation(location.value);
    console.log("Fetching lab centers for location:", location.value);
    await labStore.fetchLabCenters(location.value);
    console.log("Lab centers fetched:", labStore.labCenters.length);
  } else {
    error.value = "Please select a location.";
    console.log("Error: No location selected");
    router.push("/");
  }

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
});

// Watch for route changes
watch(
  () => route.query,
  async () => {
    console.log("Route query changed:", route.query);
    await fetchData();
  },
  { deep: true }
);

// Fallback image for lab DP if the URL fails
const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/64?text=Lab";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
