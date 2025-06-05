<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <!-- Debug Information -->
      <div v-if="debugMode" class="text-center text-gray-500 mb-4">
        <p>Debug: Location = {{ locationStore.currentLocation }}</p>
        <p>Debug: Doctors in Store = {{ doctorsStore.doctors.length }}</p>
        <p>Debug: Doctor Found = {{ doctor ? doctor.name : "Not Found" }}</p>
        <p>Debug: Error = {{ error || "None" }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-600">
        Loading doctor details...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

      <!-- Doctor Details -->
      <div v-else-if="doctor" class="space-y-10">
        <!-- Breadcrumb Navigation -->
        <div class="max-w-7xl mx-auto">
          <nav class="text-blue-700 text-sm">
            <NuxtLink to="/" class="">Home</NuxtLink>
            <span class="mx-2">></span>
            <NuxtLink
              :to="`/find-doctor?location=${doctorsStore.selectedLocation}`"
              class=""
              >Find Doctors</NuxtLink
            >
            <span class="mx-2">></span>
            <span v-if="clinicSlug">
              <NuxtLink
                :to="`/find-clinic?clinic=${clinicSlug}`"
                class="text-blue-700 font-medium"
              >
                {{ clinic ? clinic.name : "Clinic" }}
              </NuxtLink>
              <span class="mx-2">></span>
            </span>
            <span class="text-blue-700 font-medium">Dr. {{ doctor.name }}</span>
          </nav>
        </div>

        <!-- Banner Ad -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-400 py-20 rounded-xl text-center text-white">
            BANNER AD
          </div>
        </div>

        <!-- 👨‍⚕️ Doctor Info Card -->
        <div
          class="relative bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-7xl mx-auto mt-10 border border-gray-200"
        >
          <!-- Top Section: Avatar + Info -->
          <div class="flex flex-col gap-6 md:gap-6">
            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <img
                src="https://static.vecteezy.com/system/resources/previews/041/408/858/non_2x/ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab-coat-isolated-on-transparent-background-free-png.png"
                class="top-0 left-0 size-64 object-cover opacity-100 pointer-events-none"
                alt="Doctor Illustration"
              />
              <!-- Doctor Info -->
              <div
                class="items-center justify-center text-center md:text-left space-y-2"
              >
                <h1
                  class="text-2xl md:text-4xl font-bold text-gray-900 leading-snug"
                >
                  Dr. {{ doctor.name }}
                </h1>
                <p class="text-gray-600 text-base md:text-lg">
                  {{ doctor.degree }}
                </p>
                <p
                  class="text-blue-700 font-medium text-base md:text-lg tracking-wide"
                >
                  {{ doctor.specilities }}
                </p>
              </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-gray-400"></div>

            <!-- 👍👎 Recommend Doctor -->
            <div
              v-if="!loading && !error && doctor"
              class="flex flex-row justify-center items-center gap-4"
            >
              <p class="text-sm font-medium text-gray-600">
                Recommend this Doctor:
              </p>
              <div class="flex items-center justify-center gap-6">
                <button
                  v-if="authStore.isAuthenticated"
                  @click="recommendDoctor(true)"
                  :class="[
                    'text-3xl transition-transform duration-200',
                    userRecommendation && userRecommendation.value === true
                      ? 'text-green-500 scale-125 animate-bounce'
                      : 'text-gray-400 hover:text-green-400 hover:scale-110',
                  ]"
                  aria-label="Recommend doctor with thumbs up"
                >
                  👍
                </button>
                <button
                  v-if="authStore.isAuthenticated"
                  @click="recommendDoctor(false)"
                  :class="[
                    'text-3xl transition-transform duration-200',
                    userRecommendation && userRecommendation.value === false
                      ? 'text-red-500 scale-125 animate-bounce'
                      : 'text-gray-400 hover:text-red-400 hover:scale-110',
                  ]"
                  aria-label="Do not recommend doctor with thumbs down"
                >
                  👎
                </button>
                <p
                  v-if="!authStore.isAuthenticated"
                  class="text-sm text-gray-600"
                >
                  Please
                  <NuxtLink to="/auth" class="text-blue-700 underline"
                    >log in</NuxtLink
                  >
                  to recommend.
                </p>
              </div>

              <!-- VERTICAL DIVIDER -->
              <div class="border-r border-gray-400 text-gray-50">|</div>
              <p
                v-if="recommendationPercentage > 0"
                class="text-sm text-gray-600"
              >
                {{ recommendationPercentage }}% of users recommend Dr.
                {{ doctor.name }}
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t mt-4 pt-6 border-gray-400"></div>

          <!-- Stats Section -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="space-y-1 border-r border-gray-400 text-gray-50">
              <p class="text-2xl md:text-3xl font-semibold text-gray-900">
                {{ formatNumber(2050) }}
              </p>
              <p class="text-sm text-gray-500">Patients</p>
            </div>

            <div
              v-if="doctor.experience !== ''"
              class="space-y-1 border-r border-gray-400 text-gray-50"
            >
              <p class="text-2xl md:text-3xl font-semibold text-gray-900">
                {{ doctor.experience }} Years
              </p>
              <p class="text-sm text-gray-500">Experience</p>
            </div>
            <div class="space-y-1">
              <p class="text-2xl md:text-3xl font-semibold text-gray-900">
                {{ formatNumber(5300) }}
              </p>
              <p class="text-sm text-gray-500">Reviews</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t mt-4 pt-6 border-gray-400"></div>

          <!-- 📖 About Doctor -->
          <div class="py-0 rounded-2xl">
            <p class="text-gray-600 leading-relaxed">
              Dr. {{ doctor.name }} is an experienced
              {{ doctor.specilities.toLowerCase() }} specialist with over
              {{ doctor.experience || "several" }} years of practice. Committed
              to providing top-notch care, Dr. {{ doctor.name }} focuses on
              accurate diagnosis and effective treatment plans tailored to each
              patient's needs.
            </p>
          </div>
        </div>

        <!-- 👨‍⚕️ Related Doctors -->
        <div class="max-w-7xl mx-auto py-4">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Other {{ doctor.specilities }} Doctors from
            {{ doctorsStore.selectedLocation }}
          </h2>
          <div class="relative px-8">
            <!-- Left Arrow -->
            <button
              @click="scrollLeft"
              class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>

            <!-- Doctor Carousel -->
            <div
              ref="doctorsList"
              class="flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 px-2"
            >
              <div
                v-for="relatedDoctor in relatedDoctors"
                :key="relatedDoctor.id"
                @click="navigateToDoctor(relatedDoctor.doc)"
                class="flex-shrink-0 text-center w-32 snap-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <div
                  class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 shadow"
                >
                  {{ relatedDoctor.name.charAt(0) }}
                </div>
                <p class="mt-2 text-sm font-medium text-gray-800 truncate">
                  {{ relatedDoctor.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ relatedDoctor.specilities }}
                </p>
              </div>
            </div>

            <!-- Right Arrow -->
            <button
              @click="scrollRight"
              class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- 📅 Available Dates -->
        <div class="bg-gray-100 py-8">
          <div class="max-w-7xl mx-auto px-4">
            <h2 class="text-2xl font-semibold text-gray-800 py-4">
              Available Dates
              <span v-if="clinic">at {{ clinic.name }}</span>
            </h2>

            <div v-if="scheduleLoading" class="text-start text-gray-500">
              Loading schedule...
            </div>
            <div v-else-if="scheduleError" class="text-start text-red-500">
              {{ scheduleError }}
            </div>
            <div
              v-else-if="availableDates.length === 0"
              class="text-center bg-yellow-100 text-yellow-800 px-4 py-3 rounded-xl font-medium shadow"
            >
              Sorry, there are currently no available appointment slots for Dr.
              {{ doctor.name }}
              <span v-if="clinic">at {{ clinic.name }}</span
              >. Please check back later or choose another doctor.
            </div>

            <div v-else class="flex flex-wrap gap-4 justify-start mt-4">
              <div
                v-for="date in availableDates"
                :key="date"
                @click="selectDate(date)"
                :class="[
                  'w-24 p-4 rounded-lg border text-center cursor-pointer transition-all duration-200',
                  selectedDate === date
                    ? 'bg-blue-700 text-white border-blue-700 shadow-lg'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100',
                ]"
              >
                <p class="text-sm font-medium">{{ formatMonthYear(date) }}</p>
                <p class="text-2xl font-bold">{{ formatDay(date) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 📋 Appointment Summary -->
        <div v-if="selectedSlot" class="py-0">
          <div
            class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div class="space-y-2">
              <h3 class="text-xl py-4 font-semibold text-gray-800">
                Appointment Details
              </h3>

              <div
                class="flex items-center gap-6 border rounded-2xl p-4 bg-white shadow-xl shadow-gray-200"
              >
                <div>
                  <p class="text-gray-600">
                    <span class="font-medium">Date:</span>
                    {{ selectedSlot.date || selectedSlot.scheduledate }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Time:</span>
                    {{ selectedSlot.time || selectedSlot.scheduletime }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Clinic:</span>
                    <NuxtLink
                      v-if="clinic"
                      :to="`/find-clinic?clinic=${clinicSlug}`"
                      class="text-blue-700 underline"
                    >
                      {{ clinic.name }}
                    </NuxtLink>
                    <span v-else>{{ selectedSlot.clinicname }}</span>
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Address:</span>
                    {{ clinic ? clinic.address : selectedSlot.ClinicA }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Doctor Fee:</span> ₹{{
                      selectedSlot.docfee || "500"
                    }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Platform Fee:</span> ₹{{
                      selectedSlot.pfee || "50"
                    }}
                  </p>
                </div>

                <button
                  @click="submitBooking"
                  class="md:ml-4 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-md"
                >
                  Book Clinic Visit
                </button>
              </div>
            </div>
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
import { onMounted, ref, computed, watch } from "vue";
import { useDoctorsStore } from "@/stores/doctors";
import { useClinicsStore } from "@/stores/clinics";
import { useLocationStore } from "@/stores/location";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import { navigateTo, useRoute, useRouter } from "#app";

// Route, Router, and Stores
const route = useRoute();
const router = useRouter();
const doctorsStore = useDoctorsStore();
const clinicsStore = useClinicsStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();
const doctorSlug = ref(route.params.doc);
const clinicSlug = ref(route.query.clinic || "");
const debugMode = ref(true); // Enable debug mode to see logs and debug info

// Doctor State
const loading = ref(true);
const error = ref("");
const doctor = ref(null);
const clinic = ref(null);

// Schedule State
const scheduleLoading = ref(true);
const scheduleError = ref("");
const schedule = ref([]);
const selectedDate = ref("");
const selectedSlot = ref(null);

// Recommendation State
const userRecommendation = ref(null); // true (thumbs up), false (thumbs down), null (no recommendation)
const recommendationPercentage = ref(0); // Simulated percentage

// Reference for smooth scrolling
const doctorsList = ref(null);

// Computed properties
const relatedDoctors = computed(() => {
  return doctorsStore.doctors.filter(
    (doc) =>
      doc.doc !== doctorSlug.value &&
      doc.specilities === doctor.value?.specilities
  );
});

const availableDates = computed(() => {
  const today = new Date("2025-06-04");
  return schedule.value
    .map((s) => s.date)
    .filter((date) => new Date(date) >= today)
    .sort();
});

const availableSlots = computed(() => {
  if (!selectedDate.value) return [];
  const slots =
    schedule.value.find((s) => s.date === selectedDate.value)?.slots || [];
  return slots.filter((slot) => slot.available);
});

const fetchDoctorData = async () => {
  loading.value = true;
  scheduleLoading.value = true;
  error.value = "";
  scheduleError.value = "";

  try {
    // Restore location from localStorage
    await locationStore.restoreLocation();
    console.log("Restored location:", locationStore.currentLocation);

    // Check if a location is set
    let location = locationStore.currentLocation;
    console.log("Location before validation:", location);

    if (!location || location === "Select Location") {
      console.warn("No location selected, redirecting to home");
      error.value = "Please select a location first.";
      navigateTo("/");
      return;
    }

    // Fetch doctors if not already in store
    if (
      !doctorsStore.doctors.length ||
      doctorsStore.selectedLocation !== location
    ) {
      console.log("Fetching doctors for location:", location);
      await doctorsStore.fetchDoctors(location);
      console.log("Doctors fetched:", doctorsStore.doctors.length);
    }

    // Validate location and doctors in store
    if (!doctorsStore.selectedLocation || doctorsStore.doctors.length === 0) {
      console.warn("No doctors found for location, redirecting to home");
      error.value = "No doctors found in the selected location.";
      navigateTo("/");
      return;
    }

    // Find the doctor
    doctor.value = doctorsStore.doctors.find(
      (doc) => doc.doc === doctorSlug.value
    );
    console.log("Doctor found:", doctor.value);
    if (!doctor.value) {
      error.value = "Doctor not found in the selected location.";
      return;
    }

    // Fetch Clinic if clinicSlug is provided
    if (clinicSlug.value) {
      // Fetch clinics if not already in store
      if (
        !clinicsStore.clinics.length ||
        clinicsStore.selectedLocation !== location
      ) {
        console.log("Fetching clinics for location:", location);
        await clinicsStore.fetchClinics(location);
        console.log("Clinics fetched:", clinicsStore.clinics.length);
      }

      const foundClinic = clinicsStore.clinics.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === clinicSlug.value
      );
      console.log("Clinic found:", foundClinic);
      if (foundClinic) {
        clinic.value = foundClinic;
        const doctorInClinic = foundClinic.doctors.find(
          (d) => d.docSlug === doctorSlug.value
        );
        if (doctorInClinic) {
          schedule.value = doctorInClinic.schedules || [];
          autoSelectDate();
        } else {
          scheduleError.value = "Doctor not found in this clinic.";
        }
      } else {
        scheduleError.value = "Clinic not found.";
      }
    } else {
      // Fetch general schedule if no clinic is specified
      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/doctor.php",
          JSON.stringify({ doc: doctorSlug.value }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );

        console.log("Schedule API response:", response.data);
        if (Object.keys(response.data).length === 0) {
          scheduleError.value = "No schedule found for this doctor.";
        } else {
          schedule.value = Object.entries(response.data).map(
            ([date, slots]) => ({
              date,
              slots: slots.map((slot) => ({
                time: slot,
                available: true, // Assuming all slots are available for mock
                scheduledate: date,
                scheduletime: slot,
                clinicname: "General Clinic", // Fallback for API data
                ClinicA: "Unknown Address", // Fallback for API data
              })),
            })
          );
          autoSelectDate();
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        scheduleError.value = "Error fetching schedule. Please try again.";
      }
    }

    // Fetch Recommendation Data (Simulated)
    if (authStore.isAuthenticated) {
      try {
        recommendationPercentage.value = 85; // Simulated
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        recommendationPercentage.value = 0;
      }
    }
  } catch (err) {
    error.value = "Error fetching doctor info.";
    console.error(err);
  } finally {
    loading.value = false;
    scheduleLoading.value = false;
  }
};

// Fetch Doctor, Schedule, and Recommendation on Mount
onMounted(async () => {
  await fetchDoctorData();
});

// Watch for route changes
watch(
  () => route.params.doc,
  async (newSlug) => {
    doctorSlug.value = newSlug;
    await fetchDoctorData();
  }
);

// Watch for clinic changes
watch(
  () => route.query.clinic,
  async (newClinicSlug) => {
    clinicSlug.value = newClinicSlug || "";
    await fetchDoctorData();
  }
);

// Recommendation Function
const recommendDoctor = async (isRecommended) => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    navigateTo("/auth");
    return;
  }

  userRecommendation.value = { value: isRecommended };
  console.log(
    `Submitting recommendation ${isRecommended} for doctor ${doctorSlug.value}`
  );

  try {
    recommendationPercentage.value = isRecommended
      ? Math.min(recommendationPercentage.value + 5, 100)
      : Math.max(recommendationPercentage.value - 5, 0);
  } catch (err) {
    console.error("Error submitting recommendation:", err);
    userRecommendation.value = null; // Reset on error
  }
};

// Other functions
const autoSelectDate = () => {
  if (availableDates.value.length > 0) {
    selectedDate.value = availableDates.value[0];
    selectDate(selectedDate.value);
  }
};

const selectDate = (date) => {
  selectedDate.value = date;
  const slots = availableSlots.value;
  selectedSlot.value = slots.length > 0 ? slots[0] : null;
};

const navigateToDoctor = (docSlug) => {
  navigateTo(`/doctor/${docSlug}`);
};

const scrollLeft = () => {
  doctorsList.value.scrollBy({ left: -150, behavior: "smooth" });
};

const scrollRight = () => {
  doctorsList.value.scrollBy({ left: 150, behavior: "smooth" });
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  }
  return num.toString();
};

const formatMonthYear = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const formatDay = (date) => {
  return parseInt(date.split("-")[2]);
};

const submitBooking = () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to book an appointment.");
    navigateTo("/auth");
    return;
  }

  console.log("Booking submitted:", {
    doctor: doctor.value.name,
    date: selectedSlot.value.date || selectedSlot.value.scheduledate,
    time: selectedSlot.value.time || selectedSlot.value.scheduletime,
    clinic: clinic ? clinic.name : selectedSlot.value.clinicname,
    address: clinic ? clinic.address : selectedSlot.value.ClinicA,
    docfee: selectedSlot.value.docfee || "500",
    pfee: selectedSlot.value.pfee || "50",
    sessionId: authStore.userInfo.sessionId,
  });
  alert("Booking submitted! (Placeholder action)");
};
</script>

<style scoped>
/* Hide Scrollbar but Keep Functionality */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Doctor Info Card */
.relative.bg-white {
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.relative.bg-white:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

/* Typography */
h1.text-2xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
}

p.text-gray-600 {
  line-height: 1.75;
}

/* Buttons */
button.bg-green-600 {
  transition: all 0.2s ease;
}

button.bg-green-600:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Date Selection */
.w-24.p-4 {
  transition: all 0.2s ease;
}

.w-24.p-4:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
