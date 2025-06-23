<template>
  <div>
    <Header />
    <WebHeaderNav />
    <div
      class="container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen flex flex-col"
    >
      <h2
        class="text-center text-2xl sm:text-4xl font-extrabold text-blue-600 mb-6 animate-fade-in-down"
      >
        {{
          selectedSpecialty
            ? `${selectedSpecialty} in ${location || "Your Area"}`
            : `Doctors in ${location || "Your Area"}`
        }}
      </h2>

      <div
        class="w-full max-w-5xl mx-auto rounded-xl shadow-lg h-36 flex items-center justify-between mb-12 border border-purple-200 animate-fade-in-up delay-200 relative overflow-hidden bg-cover bg-center"
        :style="{
          backgroundImage:
            'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9ePW5NW4iX8sSYTn7zCsB4KCBX_ljfOcYPg&s)',
        }"
      >
        <div class="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
        <div class="p-4 text-left w-2/3 sm:w-2/3 z-10">
          <h3
            class="text-lg sm:text-xl font-bold text-white mb-2 leading-tight"
          >
            {{
              selectedSpecialty
                ? `Find and consult the best ${selectedSpecialty} in ${
                    location || "Your Area"
                  }`
                : `Find and consult the best doctors in ${
                    location || "Your Area"
                  } for your health needs.`
            }}
          </h3>
        </div>
        <div
          class="w-16 h-16 rounded-full bg-gray-200 mr-4 sm:mr-6 flex-shrink-0 z-10"
        >
          <img
            src="https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?semt=ais_hybrid&w=740"
            alt="Doctor avatar"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <div
        v-if="loading"
        class="flex justify-center items-center py-16 flex-col"
      >
        <i class="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
        <p class="text-lg text-gray-600 font-medium animate-pulse">
          Loading expert doctors for you...
        </p>
      </div>

      <div
        v-else-if="doctorsStore.error"
        class="text-center text-red-600 py-16 px-4"
      >
        <p class="text-xl font-semibold mb-4">
          <i class="fas fa-exclamation-triangle mr-3 text-2xl"></i
          >{{ doctorsStore.error }}
        </p>
        <p class="text-gray-600">
          Please try again later or adjust your search criteria.
        </p>
      </div>

      <div v-else>
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-100 animate-fade-in-up delay-300 max-w-5xl mx-auto"
        >
          <div class="w-full sm:w-auto relative">
            <label
              for="specialty-trigger"
              class="block text-base font-medium text-gray-700 mb-2 flex items-center"
            >
              <i class="fas fa-tag mr-2 text-blue-500"></i> Select Specialty:
            </label>
            <button
              id="specialty-trigger"
              @click="showSpecialtyModal = true"
              class="w-full sm:w-52 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 flex items-center justify-between text-left"
            >
              <span>{{ selectedSpecialty || "All Specialties" }}</span>
              <i class="fas fa-chevron-down text-sm ml-2"></i>
            </button>
          </div>

          <div
            class="flex flex-col sm:flex-row sm:justify-end sm:items-end gap-4 w-full sm:w-auto"
          >
            <label
              class="text-base font-medium text-gray-700 mb-2 sm:mb-0 sm:self-center"
            >
              <i class="fas fa-filter mr-2 text-blue-500"></i> Filter by:
            </label>
            <div class="flex space-x-3 items-center">
              <button
                class="w-24 h-11 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-105"
                :class="
                  isAllSelected
                    ? 'border-blue-600 text-white bg-blue-600 shadow-md'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50'
                "
                @click="toggleAllFilter"
              >
                All
              </button>
              <button
                class="w-24 h-11 rounded-full border-2 flex items-center justify-center text-sm font-semibold cursor-not-allowed opacity-60 tooltip-container"
                :class="{
                  'border-blue-600 text-white bg-blue-600':
                    selectedAvailability === 'Today',
                  'border-gray-300 text-gray-700 bg-white':
                    selectedAvailability !== 'Today',
                }"
                disabled
              >
                <i class="fas fa-calendar-alt mr-2"></i> Today
                <span class="tooltip-text">Coming Soon!</span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="filteredDoctors.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 animate-fade-in-up delay-400"
        >
          <!-- Inside the v-if="filteredDoctors.length > 0" grid -->
          <div
            v-for="doctor in filteredDoctors"
            :key="doctor.id"
            class="flex flex-col justify-between p-6 border border-gray-200 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-300"
          >
            <div class="flex items-start space-x-6 mb-4">
              <div
                class="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-md"
              >
                {{ doctor.name.charAt(0).toUpperCase() }}
              </div>

              <div class="flex-1 space-y-1">
                <h3 class="text-xl font-bold text-gray-900 mb-1">
                  Dr. {{ doctor.name }}
                </h3>
                <p class="text-sm text-gray-700 flex items-center">
                  <i class="fas fa-tag mr-2 text-blue-500"></i>
                  <span class="truncate sm:truncate-none"
                    >Specialty: {{ doctor.specilities }}</span
                  >
                </p>
                <p class="text-sm text-gray-700 flex items-center">
                  <i class="fas fa-graduation-cap mr-2 text-green-500"></i>
                  <span class="truncate sm:truncate-none"
                    >Degree: {{ doctor.degree }}</span
                  >
                </p>
                <p class="text-sm text-gray-700 flex items-center">
                  <i class="fas fa-briefcase-medical mr-2 text-orange-500"></i>
                  Experience:
                  <span class="ml-1">{{ doctor.experience }} years</span>
                </p>
              </div>
            </div>

            <button
              class="mt-6 w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              @click="viewDoctor(doctor.doc)"
            >
              <span>View Doctor Profile</span>
              <i class="fas fa-arrow-right ml-3 text-sm"></i>
            </button>
          </div>
        </div>

        <div
          v-else
          class="text-center py-16 px-4 bg-gray-50 rounded-xl shadow-inner mt-10"
        >
          <p class="text-xl text-gray-600 font-medium mb-4">
            <i class="fas fa-sad-tear text-blue-500 mr-2 text-3xl"></i> No
            doctors found for your selected criteria.
          </p>
          <p class="text-gray-500">
            Try adjusting your specialty filter or location.
          </p>
          <button
            @click="resetFilters"
            class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
          >
            <i class="fas fa-redo mr-2"></i> Reset Filters
          </button>
        </div>
      </div>
    </div>

    <Footer />
    <BottomNav />

    <SpecialtySelectModal
      :show="showSpecialtyModal"
      :specialties="uniqueSpecialties"
      :currentSelection="selectedSpecialty"
      @update:show="showSpecialtyModal = $event"
      @selectSpecialty="handleSelectSpecialty"
    />
  </div>
</template>

<script setup>
// Script remains unchanged as no logic changes are required
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDoctorsStore } from "~/stores/doctors";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";

import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import SpecialtySelectModal from "~/components/SpecialtySelectModal.vue";

const route = useRoute();
const router = useRouter();
const doctorsStore = useDoctorsStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const location = ref("");
const selectedSpecialty = ref("");
const uniqueSpecialties = ref([]);
const isAllSelected = ref(true);
const loading = ref(false);
const selectedAvailability = ref("All");
const showSpecialtyModal = ref(false);

const filteredDoctors = computed(() => {
  let doctorsToFilter = doctorsStore.doctors;

  if (isAllSelected.value) {
    return doctorsToFilter;
  }

  if (selectedSpecialty.value) {
    doctorsToFilter = doctorsToFilter.filter(
      (doctor) => doctor.specilities === selectedSpecialty.value
    );
  }
  return doctorsToFilter;
});

const fetchDoctors = async () => {
  loading.value = true;
  doctorsStore.error = null;
  uniqueSpecialties.value = [];

  try {
    await doctorsStore.fetchDoctors(location.value);

    if (doctorsStore.doctors.length > 0) {
      const specialties = doctorsStore.doctors.map((d) => d.specilities);
      const normalized = specialties.map((s) => {
        const lowerS = s.toLowerCase();
        if (lowerS === "orthapadic") return "Orthopedic";
        if (lowerS.includes("cardio")) return "Cardiology";
        if (lowerS.includes("pediat")) return "Pediatrics";
        if (lowerS.includes("derma")) return "Dermatology";
        if (lowerS.includes("neuro")) return "Neurology";
        if (lowerS.includes("gastro")) return "Gastroenterology";
        if (lowerS.includes("urol")) return "Urology";
        if (lowerS.includes("ent")) return "ENT";
        if (lowerS.includes("gyne")) return "Gynecology";
        if (lowerS.includes("ortho")) return "Orthopedics";
        if (lowerS.includes("psy")) return "Psychiatry";
        if (lowerS.includes("onco")) return "Oncology";
        if (lowerS.includes("diabet")) return "Diabetology";
        if (lowerS.includes("pulmo")) return "Pulmonology";
        if (lowerS.includes("radio")) return "Radiology";
        if (lowerS.includes("opthal")) return "Ophthalmology";
        if (lowerS.includes("general physician") || lowerS.includes("gp"))
          return "General Physician";
        return s;
      });
      uniqueSpecialties.value = [...new Set(normalized)].sort();

      if (
        selectedSpecialty.value &&
        !uniqueSpecialties.value.includes(selectedSpecialty.value) &&
        selectedSpecialty.value !== "all"
      ) {
        selectedSpecialty.value = "";
        isAllSelected.value = true;
        router.replace({
          query: { ...route.query, specialities: undefined },
        });
      }
    } else {
      uniqueSpecialties.value = [];
    }
  } catch (err) {
    console.error("Error in fetchDoctors:", err);
    doctorsStore.error = "Failed to fetch doctors. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const handleSelectSpecialty = (specialty) => {
  selectedSpecialty.value = specialty;
  isAllSelected.value = !specialty;
  router.push({
    path: "/doctor-list",
    query: {
      location: location.value,
      specialities: specialty || "all",
    },
  });
};

const toggleAllFilter = () => {
  isAllSelected.value = true;
  selectedSpecialty.value = "";
  router.push({
    path: "/doctor-list",
    query: {
      location: location.value,
      specialities: "all",
    },
  });
};

const resetFilters = () => {
  selectedSpecialty.value = "";
  isAllSelected.value = true;
  router.push({
    path: "/doctor-list",
    query: {
      location: location.value,
      specialities: "all",
    },
  });
};

const viewDoctor = (docSlug) => {
  if (!authStore.checkAuthAndBlock()) {
    sessionStorage.setItem("redirectAfterLogin", `/doctor/${docSlug}`);
    return;
  }
  router.push(`/doctor/${docSlug}`);
};

onMounted(async () => {
  location.value =
    route.query.location || locationStore.currentLocation || "Your Area";

  const routeSpecialty = route.query.specialities;
  if (routeSpecialty && routeSpecialty !== "all") {
    selectedSpecialty.value = routeSpecialty;
    isAllSelected.value = false;
  } else {
    isAllSelected.value = true;
    selectedSpecialty.value = "";
  }

  if (location.value) {
    await fetchDoctors();
  } else {
    doctorsStore.error = "Location parameter is required to find doctors.";
  }
});

watch(
  () => route.query,
  async (newQuery) => {
    const newLocation =
      newQuery.location || locationStore.currentLocation || "Your Area";
    const newSpecialty = newQuery.specialities;
    let shouldFetchDoctors = false;
    let shouldUpdateFilters = false;

    if (newLocation !== location.value) {
      location.value = newLocation;
      shouldFetchDoctors = true;
    }

    if (newSpecialty !== selectedSpecialty.value) {
      if (newSpecialty && newSpecialty !== "all") {
        selectedSpecialty.value = newSpecialty;
        isAllSelected.value = false;
      } else {
        selectedSpecialty.value = "";
        isAllSelected.value = true;
      }
      shouldUpdateFilters = true;
    }

    if (shouldFetchDoctors) {
      await fetchDoctors();
    } else if (shouldUpdateFilters) {
      // Filters are already handled by computed property
    }
  },
  { deep: true }
);
</script>

<style scoped>
/* Tooltip styles for the disabled "Today" button */

/* Truncation for mobile view */
.truncate {
  max-width: 150px; /* Adjust this value based on your design */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncate-none {
  max-width: none;
  overflow: visible;
  text-overflow: initial;
  white-space: normal;
}

.tooltip-container {
  position: relative;
}

.tooltip-text {
  visibility: hidden;
  width: 100px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  margin-left: -50px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.75rem;
  white-space: nowrap;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Truncation for specialty and degree on mobile */
.truncate-none {
  text-overflow: initial;
  white-space: normal;
}

/* Base animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}

.animate-fade-in-up.delay-300 {
  animation-delay: 0.3s;
}

.animate-fade-in-up.delay-400 {
  animation-delay: 0.4s;
}

/* Responsive banner text */
@media (max-width: 640px) {
  .banner-text {
    max-width: 80%;
    white-space: normal;
  }
}

@media (min-width: 640px) {
  .truncate {
    max-width: none; /* Remove truncation on web */
    white-space: normal;
  }
}

/* Adjust icon colors to match the image */
.fas.fa-tag {
  color: #3b82f6;
}
.fas.fa-graduation-cap {
  color: #10b981;
}
.fas.fa-briefcase-medical {
  color: #f97316;
}
</style>
