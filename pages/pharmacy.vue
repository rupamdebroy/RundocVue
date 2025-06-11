<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>
            Debug: Pharmacies in Store = {{ pharmacyStore.pharmacies.length }}
          </p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Pharmacy Page: Show pharmacies for the selected location -->
        <div>
          <h1 class="text-2xl font-bold mb-4 text-center">
            Order Medicines from {{ location }}
          </h1>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading pharmacies...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Pharmacies data -->
          <div v-else>
            <!-- Pharmacy list -->
            <div v-if="pharmacyStore.pharmacies.length > 0" class="space-y-4">
              <div
                v-for="pharmacy in pharmacyStore.pharmacies"
                :key="pharmacy.id"
                class="relative flex items-center p-4 border rounded-lg shadow-sm bg-white"
              >
                <!-- Discount Badge -->
                <span
                  class="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {{ pharmacy.discount }}% Off
                </span>

                <!-- Pharmacy Photo -->
                <img
                  :src="pharmacy.dp"
                  alt="Pharmacy DP"
                  class="w-16 h-16 rounded-full mr-4 object-cover"
                  @error="handleImageError"
                />

                <!-- Pharmacy details -->
                <div class="flex-1">
                  <p class="text-lg font-semibold">{{ pharmacy.name }}</p>
                  <p class="text-sm text-gray-600">{{ pharmacy.address }}</p>
                </div>

                <!-- Order Medicine button -->
                <NuxtLink
                  :to="`/order-medicine?pharmacyId=${pharmacy.id}`"
                  class="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Order Medicine
                </NuxtLink>
              </div>
            </div>

            <!-- No pharmacies found -->
            <div v-else class="text-center">
              <p>No pharmacies found in this location.</p>
            </div>

            <!-- Info message -->
            <p v-if="pharmacyStore.info" class="text-gray-600 mt-4 text-center">
              {{ pharmacyStore.info }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePharmacyStore } from "@/stores/pharmacy";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const pharmacyStore = usePharmacyStore();
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
  console.log("Location for Pharmacy Page:", location.value);

  if (location.value && location.value !== "Select Location") {
    locationStore.setLocation(location.value);
    console.log("Fetching pharmacies for location:", location.value);
    await pharmacyStore.fetchPharmacies(location.value);
    console.log("Pharmacies fetched:", pharmacyStore.pharmacies.length);
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

// Fallback image for pharmacy DP if the URL fails
const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/64?text=Pharmacy";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
