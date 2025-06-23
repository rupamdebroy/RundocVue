<template>
  <section class="py-6 sm:py-8 lg:py-10 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="bg-blue-700 text-white text-center py-2.5 px-3 sm:py-3 sm:px-4 mb-6 sm:mb-8 rounded-lg shadow-md"
      >
        <p class="text-xs sm:text-sm font-medium normal-case opacity-90">
          RUNDOC ONLY FACILITATES BOOKINGS WITH REGISTERED PARTNER PHARMACIES.
          RUNDOC DOES NOT OPERATE ANY PHARMACY OR MEDICAL STORE OF ITS OWN.
          RUNDOC DOES NOT HOLD ANY MEDICINE STOCK, WAREHOUSE, OR ISSUE INVOICES.
          ALL MEDICINES ARE SOLD AND INVOICED SOLELY BY REGISTERED CHEMISTS.
        </p>
      </div>

      <div v-if="loading" class="text-center py-8 sm:py-10">
        <p class="text-gray-500 text-lg">Loading pharmacies...</p>
        <div
          class="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"
        ></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-8 sm:py-10">
        <p class="text-lg font-medium">{{ error }}</p>
        <p class="text-sm mt-2 text-gray-600">
          Please try again or select a different location.
        </p>
      </div>

      <div v-else>
        <div
          v-if="pharmacyStore.pharmacies.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          <div
            v-for="pharmacy in pharmacyStore.pharmacies"
            :key="pharmacy.id"
            class="p-4 sm:p-5 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
          >
            <span
              class="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white text-xs sm:text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md z-10"
            >
              Up to {{ pharmacy.discount }}% OFF
            </span>

            <div class="flex items-start space-x-4 mb-4 mt-4">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold bg-blue-100 shrink-0 overflow-hidden shadow-inner border border-blue-200"
              >
                <img
                  v-if="pharmacy.dp"
                  :src="pharmacy.dp"
                  :alt="`${pharmacy.name} DP`"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <span v-else>{{ pharmacy.name?.charAt(0) || "?" }}</span>
              </div>

              <div class="flex-grow">
                <p
                  class="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-snug line-clamp-2"
                >
                  {{ pharmacy.name }}
                </p>
                <p class="text-sm text-gray-600 mb-1 leading-snug">
                  <i class="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                  {{ pharmacy.address }}
                </p>
                <p class="text-xs text-gray-500 leading-snug">
                  <i class="fas fa-city text-blue-500 mr-1"></i>
                  {{ pharmacy.city }}
                </p>
              </div>
            </div>

            <NuxtLink
              :to="`/order-medicine?pharmacyId=${pharmacy.id}`"
              class="mt-auto w-full bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              <span> Order Medicine</span>
              <i class="fas fa-arrow-right ml-2 text-white text-base"></i>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-10">
          <p class="text-gray-500 text-lg">
            No pharmacies found in this location.
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Try searching for another area or check back later.
          </p>
        </div>

        <p
          v-if="pharmacyStore.info"
          class="text-center text-gray-600 mt-6 text-sm italic"
        >
          {{ pharmacyStore.info }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { usePharmacyStore } from "@/stores/pharmacy";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const pharmacyStore = usePharmacyStore();
const locationStore = useLocationStore();

const loading = ref(false);
const error = ref("");

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  await locationStore.restoreLocation();
  const currentLocation = locationStore.currentLocation;

  if (currentLocation && currentLocation !== "Select Location") {
    await pharmacyStore.fetchPharmacies(currentLocation);
  } else {
    error.value = "Please select a location to find pharmacies.";
  }

  loading.value = false;
};

onMounted(() => {
  fetchData();
});

watch(
  () => locationStore.currentLocation,
  (newLocation, oldLocation) => {
    if (newLocation && newLocation !== oldLocation) {
      fetchData();
    }
  },
  { immediate: false }
);

watch(
  () => route.query.location,
  (newQueryLocation, oldQueryLocation) => {
    if (newQueryLocation && newQueryLocation !== oldQueryLocation) {
      locationStore.setLocation(newQueryLocation);
    }
  }
);

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/80?text=Pharmacy";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Line clamp for pharmacy name */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Ensures dots for truncation */
}
</style>
