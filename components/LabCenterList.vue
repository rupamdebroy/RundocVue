<template>
  <section class="py-8">
    <div class="container mx-auto px-4">
      <div
        class="bg-blue-50 text-blue-700 border border-blue-200 rounded-md py-2 px-4 mb-8 text-center text-sm"
      >
        <p class="font-medium">
          <i class="fas fa-info-circle mr-2"></i> Rundoc facilitates bookings
          with registered partner labs. We do not operate our own labs.
        </p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading lab centers...
        </p>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-4">
        <p><i class="fas fa-exclamation-triangle mr-2"></i> {{ error }}</p>
      </div>

      <div v-else>
        <div
          v-if="labStore.labCenters.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="lab in labStore.labCenters"
            :key="lab.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div class="relative px-4 py-8">
              <span
                v-if="lab.discount"
                class="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10"
              >
                Up to {{ lab.discount }}% OFF
              </span>
              <div class="flex items-center space-x-3 mb-3">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold bg-blue-100 shrink-0 overflow-hidden"
                >
                  <img
                    v-if="lab.dp"
                    :src="lab.dp"
                    alt="Lab DP"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <span v-else>{{ lab.name?.charAt(0) || "?" }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 truncate">
                    {{ lab.name }}
                  </h3>
                  <p class="text-sm text-gray-600 truncate">
                    {{ lab.address }}
                  </p>
                </div>
              </div>
              <div
                class="flex items-center text-xs text-green-600 mt-1"
                v-if="lab.homeCollection"
              >
                <i class="fas fa-house-user mr-1"></i> Home Sample Collection
                Available
              </div>
            </div>
            <div class="bg-gray-50 p-3 border-t">
              <NuxtLink
                :to="`/order-labtest?labcenterId=${lab.id}`"
                class="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors"
              >
                <i class="fas fa-vial mr-2"></i> Book Now
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10">
          <p class="text-gray-500">
            <i class="fas fa-flask mr-2"></i> No lab centers found in this
            location.
          </p>
        </div>

        <p v-if="labStore.info" class="text-center text-gray-600 mt-4 text-sm">
          {{ labStore.info }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLabStore } from "@/stores/lab";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const labStore = useLabStore();
const locationStore = useLocationStore();

const loading = ref(false);
const error = ref("");

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  // The `location` is now derived from locationStore, which should be updated globally
  await locationStore.restoreLocation(); // Ensure location is restored from local storage/etc.
  const currentLocation = locationStore.currentLocation;

  if (currentLocation && currentLocation !== "Select Location") {
    // No need to setLocation again if it's already current
    await labStore.fetchLabCenters(currentLocation);
  } else {
    error.value = "Please select a location to find lab centers.";
    // Optionally redirect, but it's better for a sub-component to just display an error
    // router.push("/");
  }

  loading.value = false;
};

// Initial fetch on component mount
onMounted(() => {
  fetchData();
});

// Watch for changes in the location store's currentLocation
watch(
  () => locationStore.currentLocation,
  (newLocation, oldLocation) => {
    if (newLocation && newLocation !== oldLocation) {
      fetchData(); // Re-fetch data if location changes
    }
  },
  { immediate: false } // Do not run on initial render if fetchData is already called by onMounted
);

// If the page is directly accessed with a query param, also watch that
watch(
  () => route.query.location,
  (newQueryLocation, oldQueryLocation) => {
    if (newQueryLocation && newQueryLocation !== oldQueryLocation) {
      // If query changes, update the global location store
      locationStore.setLocation(newQueryLocation);
      // fetchData will be triggered by the locationStore.currentLocation watch
    }
  }
);

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/64?text=Lab"; // Placeholder image
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Specific truncation for h3 within this component */
h3.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
