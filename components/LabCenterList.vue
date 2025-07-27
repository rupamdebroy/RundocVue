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
          v-if="labs.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="lab in labs"
            :key="lab.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
          >
            <div class="relative px-4 py-8">
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLocationStore } from "@/stores/location";
import axios from "axios";

const route = useRoute();
const locationStore = useLocationStore();

const loading = ref(false);
const error = ref("");
const labs = ref([]);

const fetchLabs = async (city) => {
  if (!city || city === "Select Location" || city.trim() === "") {
    error.value = "Please select a valid location to find lab centers.";
    labs.value = [];
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await axios.post(
      "https://api.rundoc.in/api/app3/lab/labTest.php", // Changed to HTTPS
      { city },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Rupam@98639999",
        },
      }
    );

    if (response.data.success) {
      labs.value = response.data.data.map((item) => ({
        id: `${item.cid}-${item.tid}`,
        name: item.Cilinic_name,
        address: item.Cilinic_address,
        dp: null,
        homeCollection: item.description.toLowerCase().includes("home") || true,
        testId: item.tid,
        description: item.description,
        amount: parseFloat(item.amount),
        fee: parseFloat(item.fee),
      }));
    } else {
      error.value =
        response.data.message ||
        response.data.errors?.join(", ") ||
        "Failed to fetch lab centers.";
      labs.value = [];
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = "Unauthorized access. Please check your credentials.";
    } else if (err.response?.status >= 500) {
      error.value = "Server error. Please try again later.";
    } else {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "An error occurred while fetching labcenters.";
    }
    labs.value = [];
  } finally {
    loading.value = false;
  }
};

// Initial fetch on component mount
onMounted(async () => {
  await locationStore.restoreLocation();
  await fetchLabs(locationStore.currentLocation);
});

// Watch for changes in currentLocation
watch(
  () => locationStore.currentLocation,
  (newLocation) => {
    if (newLocation) {
      fetchLabs(newLocation);
    }
  },
  { immediate: false }
);

// Watch for query param changes
watch(
  () => route.query.location,
  (newQueryLocation) => {
    if (newQueryLocation && newQueryLocation !== locationStore.currentLocation) {
      locationStore.setLocation(newQueryLocation);
      // fetchLabs triggered by locationStore.currentLocation watch
    }
  }
);

const handleImageError = (event) => {
  event.target.src = "https://placehold.co/600x400/png";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

h3.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>