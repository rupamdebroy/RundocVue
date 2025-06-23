<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen py-6 sm:py-8 lg:py-10 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="showFindClinicPage">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-2 leading-tight"
          >
            Find Clinics in
            <span class="text-blue-600 block sm:inline-block mt-1 sm:mt-0">{{
              location
            }}</span>
          </h1>
          <p
            class="text-center text-green-600 font-medium mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Discover Top Clinics and Book Appointments with Ease! Your health,
            our priority.
          </p>

          <div
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12"
          >
            <div
              v-for="(info, index) in infoboxes"
              :key="index"
              class="relative w-full h-48 sm:h-52 group perspective cursor-pointer"
            >
              <div
                class="relative w-full h-full transition-transform duration-500 transform-style rounded-2xl shadow-lg"
                :class="{
                  'sm:group-hover:rotate-y-180': true,
                  'no-flip': !isDesktop,
                }"
              >
                <!-- Front Side (Icon and Title) -->
                <div
                  class="absolute w-full h-full rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center backface-hidden border-2"
                  :class="[
                    index % 3 === 0
                      ? 'bg-blue-50 border-blue-200'
                      : index % 3 === 1
                      ? 'bg-green-50 border-green-200'
                      : 'bg-yellow-50 border-yellow-200',
                  ]"
                >
                  <div class="text-blue-600 text-3xl sm:text-4xl mb-2">
                    <i :class="info.icon"></i>
                  </div>
                  <h3 class="text-base sm:text-lg font-semibold text-gray-800">
                    {{ info.title }}
                  </h3>
                  <p
                    v-if="isDesktop"
                    class="text-xs sm:text-sm text-gray-600 mt-2 hidden sm:block"
                  >
                    {{ info.description.split("\n")[0] }}...
                  </p>
                </div>

                <!-- Back Side (Description) - Hidden on mobile -->
                <div
                  v-if="isDesktop"
                  class="absolute w-full h-full rounded-2xl p-4 sm:p-6 bg-white border-2 border-gray-200 shadow-md text-sm text-gray-700 backface-hidden rotate-y-180 flex items-center justify-center"
                >
                  <p
                    class="whitespace-pre-line leading-relaxed text-sm sm:text-base"
                  >
                    {{ info.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-blue-700 text-white text-center py-2.5 px-3 sm:py-3 sm:px-4 mb-6 sm:mb-8 rounded-lg shadow-md"
          >
            <p class="text-xs sm:text-sm font-medium normal-case opacity-90">
              Rundoc only facilitates bookings with registered partner Clinics.
              Rundoc does not operate any clinic or diagnostic center of its
              own.
            </p>
          </div>

          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Clinic Type:
            </h2>
            <div class="flex flex-wrap gap-3 sm:gap-4">
              <label class="inline-flex items-center group">
                <input
                  type="radio"
                  class="form-radio text-blue-600 h-4 w-4 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  name="clinicType"
                  value="All"
                  v-model="selectedClinicType"
                  checked
                />
                <span
                  class="ml-2 text-gray-700 text-sm sm:text-base group-hover:text-blue-700 transition-colors"
                  >All</span
                >
              </label>
              <label
                class="inline-flex items-center cursor-not-allowed group opacity-70"
              >
                <input
                  type="radio"
                  class="form-radio text-blue-600 h-4 w-4"
                  name="clinicType"
                  value="Polyclinic"
                  v-model="selectedClinicType"
                  disabled
                />
                <span class="ml-2 text-gray-600 text-sm sm:text-base"
                  >Polyclinic</span
                >
              </label>
              <label
                class="inline-flex items-center cursor-not-allowed group opacity-70"
              >
                <input
                  type="radio"
                  class="form-radio text-blue-600 h-4 w-4"
                  name="clinicType"
                  value="Hospital"
                  v-model="selectedClinicType"
                  disabled
                />
                <span class="ml-2 text-gray-600 text-sm sm:text-base"
                  >Hospital</span
                >
              </label>
            </div>
          </div>

          <div v-if="loading" class="text-center py-8 sm:py-10">
            <p class="text-gray-500 text-lg">Loading clinics...</p>
            <div
              class="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"
            ></div>
          </div>

          <div
            v-else-if="clinicsStore.error"
            class="text-center text-red-500 py-8 sm:py-10"
          >
            <p class="text-lg font-medium">{{ clinicsStore.error }}</p>
            <p class="text-sm mt-2 text-gray-600">
              Please try again or select a different location.
            </p>
          </div>

          <div v-else>
            <div
              v-if="clinicsStore.clinics.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              <div
                v-for="clinic in clinicsStore.clinics"
                :key="clinic.id"
                class="p-4 sm:p-5 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div class="flex items-start space-x-4 mb-4 mt-2">
                  <div
                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold bg-blue-100 shrink-0 overflow-hidden shadow-inner border border-blue-200"
                  >
                    <img
                      v-if="clinic.dp"
                      :src="clinic.dp"
                      :alt="`${clinic.name} DP`"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <span v-else>{{ clinic.name?.charAt(0) || "?" }}</span>
                  </div>

                  <div class="flex-grow">
                    <p
                      class="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-snug"
                    >
                      {{ clinic.name }}
                    </p>
                    <p class="text-sm text-gray-600 mb-1 leading-snug">
                      <i class="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                      {{ clinic.address }}
                    </p>
                    <p class="text-xs text-gray-500 leading-snug">
                      <i class="fas fa-city text-blue-500 mr-1"></i>
                      {{ clinic.city }}
                    </p>
                  </div>
                </div>

                <NuxtLink
                  :to="`/find-clinic?location=${location}&clinic=${clinic.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`"
                  class="mt-auto w-full bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                  <span> View Doctors</span>
                  <i class="fas fa-arrow-right ml-2 text-white text-base"></i>
                </NuxtLink>
              </div>
            </div>

            <div v-else class="text-center py-10">
              <p class="text-gray-500 text-lg">
                No clinics found in this location.
              </p>
              <p class="text-sm text-gray-500 mt-2">
                Try searching for another area or check back later.
              </p>
            </div>

            <p
              v-if="clinicsStore.info"
              class="text-center text-gray-600 mt-6 text-sm italic"
            >
              {{ clinicsStore.info }}
            </p>
          </div>
        </div>

        <div v-else-if="showClinicPage">
          <!-- Existing clinic page content remains unchanged -->
        </div>

        <div v-else class="text-center text-red-500 py-10 sm:py-12">
          <p class="text-xl font-bold">Invalid Request</p>
          <p class="text-base mt-2 text-gray-600">
            Please ensure you provide a valid location or clinic parameter in
            the URL.
          </p>
          <NuxtLink
            to="/"
            class="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-600 transition-all duration-300 shadow-md"
          >
            Go to Homepage
          </NuxtLink>
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
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const clinicsStore = useClinicsStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const location = ref("");
const clinic = ref(null);
const doctors = ref([]);
const loading = ref(false);
const error = ref("");
const selectedClinicType = ref("All");

// Detect if it's desktop view
const isDesktop = computed(() => window.innerWidth >= 640);

// Infoboxes: Reactive descriptions
const infoboxes = computed(() => [
  {
    title: "How This Works",
    description: `Easily Book a Doctor in ${
      location.value || "Baidyabati"
    }\n\nBrowse clinics in your area, view available doctors, and book appointments directly from the clinic profile — no phone calls needed. Simple, fast, and secure.`,
    icon: "fas fa-clipboard-list",
  },
  {
    title: "Verified Clinics Only",
    description: `Trusted Local Clinics\n\nAll clinics listed here are verified and updated regularly to ensure accurate details. Only doctors associated with certified clinics in ${
      location.value || "Baidyabati"
    } are shown.`,
    icon: "fas fa-check-circle",
  },
  {
    title: "Book Appointments Online",
    description:
      "No Contact Needed — Book Online\n\nEach clinic page lets you check available doctors, services, and timings. Book appointments directly with a few clicks — no need to call or visit physically.",
    icon: "fas fa-calendar-check",
  },
  {
    title: "Why Choose Us?",
    description: `Your Local Health Booking Partner\n\nWe focus only on ${
      location.value || "Baidyabati"
    } clinics to provide faster, location-specific doctor discovery. No confusion. No clutter. Just what you need — right here.`,
    icon: "fas fa-handshake",
  },
]);

// Determine which page to show
const showFindClinicPage = computed(() => {
  return route.query.location && !route.query.clinic;
});

const showClinicPage = computed(() => {
  return route.query.clinic;
});

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  await locationStore.restoreLocation();

  if (showFindClinicPage.value) {
    location.value = route.query.location || locationStore.currentLocation;
    if (location.value && location.value !== "Select Location") {
      locationStore.setLocation(location.value);
      await clinicsStore.fetchClinics(location.value);
    } else {
      clinicsStore.error = "Please select a location.";
    }
  } else if (showClinicPage.value) {
    const clinicNameFromQuery = route.query.clinic;
    if (!clinicNameFromQuery) {
      error.value = "Clinic parameter is required.";
      loading.value = false;
      return;
    }

    const currentLoc = locationStore.currentLocation;
    if (!currentLoc || currentLoc === "Select Location") {
      router.push(`/find-clinic`);
      error.value = "Please select a location first.";
      loading.value = false;
      return;
    }

    clinic.value = clinicsStore.clinics.find(
      (c) => c.name.toLowerCase().replace(/\s+/g, "-") === clinicNameFromQuery
    );

    if (!clinic.value) {
      await clinicsStore.fetchClinics(currentLoc);
      clinic.value = clinicsStore.clinics.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === clinicNameFromQuery
      );
    }

    if (clinic.value) {
      const clinicDetails = await clinicsStore.fetchClinicDetails(
        clinic.value.id
      );
      if (clinicDetails) {
        doctors.value = clinicDetails.doctors;
      } else {
        error.value = "Failed to fetch doctors for this clinic.";
      }
    } else {
      error.value = "Clinic not found or no data available.";
    }
  }

  loading.value = false;
};

const viewDoctor = (doctorId) => {
  if (!authStore.isAuthenticated) {
    // Store the intended URL in sessionStorage
    const redirectUrl = `/doctor/${doctorId}${
      clinic.value ? `?clinic=${clinic.value.id}` : ""
    }`;
    sessionStorage.setItem("redirectAfterLogin", redirectUrl);
    // Trigger the login popup
    authStore.showLoginPopup = true;
    return;
  }

  // If authenticated, navigate to doctor profile
  if (clinic.value) {
    router.push({
      path: `/doctor/${doctorId}`,
      query: { clinic: clinic.value.id },
    });
  }
};

onMounted(async () => {
  authStore.restoreSession();
  await fetchData();
});

watch(
  () => route.query,
  async () => {
    await fetchData();
  },
  { deep: true }
);

watch(
  () => locationStore.currentLocation,
  (newLocation) => {
    location.value = newLocation;
  }
);

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/80?text=Clinic";
};

const handleDoctorImageError = (event) => {
  event.target.src = "https://via.placeholder.com/80?text=Doctor";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.perspective {
  perspective: 1000px;
}

.transform-style {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.group:hover .group-hover\:rotate-y-180 {
  transform: rotateY(180deg);
}

/* Disable flip on mobile */
.no-flip {
  transform: none !important;
  transition: none !important;
}

/* Responsive card adjustments */
@media (max-width: 639px) {
  .backface-hidden:nth-child(2) {
    display: none; /* Hide the back side on mobile */
  }
}
</style>
