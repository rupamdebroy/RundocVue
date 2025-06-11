<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Find Clinic Page: Show if 'location' query parameter is present and 'clinic' is not -->
        <div v-if="showFindClinicPage">
          <h1 class="text-2xl font-bold mb-4">Clinics in {{ location }}</h1>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading clinics...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="clinicsStore.error" class="text-center text-red-500">
            <p>{{ clinicsStore.error }}</p>
          </div>

          <!-- Clinics data -->
          <div v-else>
            <!-- Clinic list -->
            <div v-if="clinicsStore.clinics.length > 0" class="space-y-4">
              <div
                v-for="clinic in clinicsStore.clinics"
                :key="clinic.id"
                class="flex items-center p-4 border rounded-lg shadow-sm"
              >
                <!-- Clinic details -->
                <div class="flex-1">
                  <p class="text-lg font-semibold">{{ clinic.name }}</p>
                  <p class="text-sm text-gray-600">{{ clinic.address }}</p>
                </div>
                <!-- View Doctors button -->
                <NuxtLink
                  :to="`/find-clinic?location=${location}&clinic=${clinic.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`"
                  class="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  View Doctors
                </NuxtLink>
              </div>
            </div>

            <!-- No clinics found -->
            <div v-else class="text-center">
              <p>No clinics found in this location.</p>
            </div>

            <!-- Info message -->
            <p v-if="clinicsStore.info" class="text-gray-500 mt-4 text-center">
              {{ clinicsStore.info }}
            </p>
          </div>
        </div>

        <!-- Clinic Page: Show if 'clinic' query parameter is present -->
        <div v-else-if="showClinicPage">
          <!-- Debug Information -->
          <div v-if="debugMode" class="text-center text-gray-500 mb-4">
            <p>Debug: Location = {{ locationStore.currentLocation }}</p>
            <p>Debug: Clinics in Store = {{ clinicsStore.clinics.length }}</p>
            <p>
              Debug: Clinic Found = {{ clinic ? clinic.name : "Not Found" }}
            </p>
            <p>Debug: Error = {{ error || "None" }}</p>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading clinic details...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Clinic Details -->
          <div v-else-if="clinic" class="space-y-8">
            <!-- Breadcrumb Navigation -->
            <nav class="text-blue-700 text-sm">
              <NuxtLink to="/" class="">Home</NuxtLink>
              <span class="mx-2">></span>
              <NuxtLink
                :to="`/find-clinic?location=${locationStore.currentLocation}`"
                class=""
                >Find Clinics</NuxtLink
              >
              <span class="mx-2">></span>
              <span class="text-blue-700 font-medium">{{ clinic.name }}</span>
            </nav>

            <!-- Clinic Info -->
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h1 class="text-2xl font-bold mb-2">{{ clinic.name }}</h1>
              <p class="text-gray-600 mb-2">{{ clinic.address }}</p>
              <p class="text-gray-600">{{ clinic.city }}</p>
            </div>

            <!-- Doctors List -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Meet the Doctors</h2>
              <div v-if="doctors.length > 0" class="space-y-4">
                <div
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  class="flex items-center p-4 border rounded-lg shadow-sm"
                >
                  <!-- Doctor DP (Placeholder) -->
                  <div
                    class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold mr-4"
                  >
                    {{ doctor.name.charAt(0).toUpperCase() }}
                  </div>
                  <!-- Doctor Details -->
                  <div class="flex-1">
                    <p class="text-lg font-semibold">{{ doctor.fullName }}</p>
                    <p class="text-sm">Specialty: {{ doctor.specialty }}</p>
                    <p class="text-sm">
                      ID: {{ doctor.id }}
                    </p>
                  </div>
                  <!-- View Button -->
                  <NuxtLink
                    :to="`/doctor/${doctor.id}?clinic=${clinic.name
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`"
                    class="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="text-center">
                <p>No doctors available at this clinic.</p>
              </div>
            </div>
          </div>

          <!-- Fallback for when clinic is not found -->
          <div v-else class="text-center text-red-500">
            <p>Clinic not found or no data available.</p>
          </div>
        </div>

        <!-- Fallback: Invalid query parameters -->
        <div v-else class="text-center text-red-500">
          <p>Please provide a valid location or clinic parameter.</p>
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
import { useClinicsStore } from "@/stores/clinics";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const clinicsStore = useClinicsStore();
const locationStore = useLocationStore();

const location = ref("");
const clinic = ref(null);
const doctors = ref([]);
const loading = ref(false);
const error = ref("");
const debugMode = ref(true); // Enable debug mode to see logs and debug info

// Determine which page to show based on query parameters
const showFindClinicPage = computed(() => {
  return route.query.location && !route.query.clinic;
});

const showClinicPage = computed(() => {
  return route.query.clinic;
});

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  console.log("Fetching data for route:", route.query);

  // Restore location from store
  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  if (showFindClinicPage.value) {
    // Find Clinic Page Logic
    location.value = route.query.location || locationStore.currentLocation;
    console.log("Find Clinic Page - Location:", location.value);
    if (location.value && location.value !== "Select Location") {
      locationStore.setLocation(location.value);
      await clinicsStore.fetchClinics(location.value);
      console.log("Clinics fetched:", clinicsStore.clinics);
    } else {
      clinicsStore.error = "Please select a location.";
      console.log("Error: No location selected");
    }
  } else if (showClinicPage.value) {
    // Clinic Page Logic
    const clinicSlug = route.query.clinic;
    console.log("Clinic Page - Clinic Slug:", clinicSlug);
    if (!clinicSlug) {
      error.value = "Clinic parameter is required.";
      loading.value = false;
      console.log("Error: Clinic parameter missing");
      return;
    }

    // Ensure we have the location
    const location = locationStore.currentLocation;
    if (!location || location === "Select Location") {
      router.push(`/find-clinic`);
      error.value = "Please select a location first.";
      loading.value = false;
      console.log("Redirected: No location selected");
      return;
    }

    // Find the clinic by slug from store or fetch if needed
    clinic.value = clinicsStore.clinics.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, "-") === clinicSlug
    );

    if (!clinic.value) {
      // If clinic not in store, try to fetch it
      const clinicId = clinicSlug.split('-').pop(); // Assuming slug contains ID
      if (clinicId) {
        const clinicData = await clinicsStore.fetchClinicDetails(clinicId);
        if (clinicData) {
          clinic.value = clinicData.clinic;
          doctors.value = clinicData.doctors;
        } else {
          error.value = "Clinic not found.";
        }
      } else {
        error.value = "Invalid clinic identifier.";
      }
    } else {
      // If clinic is in store but we need doctors
      const clinicDetails = await clinicsStore.fetchClinicDetails(clinic.value.id);
      if (clinicDetails) {
        doctors.value = clinicDetails.doctors;
      }
    }
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
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>