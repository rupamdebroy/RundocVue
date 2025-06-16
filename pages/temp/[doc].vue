<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <WebHeaderNav />
    <section class="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
      <!-- Debug Information -->
      <!-- <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Doctors in Store = {{ doctorsStore.doctors.length }}</p>
          <p>Debug: Doctor Found = {{ doctor ? doctor.name : "Not Found" }}</p>
          <p>Debug: Error = {{ error || "None" }}</p>
        </div> -->

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-600 py-8">
        Loading doctor details...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>

      <!-- Doctor Details -->
      <div v-else-if="doctor" class="space-y-8">
        <!-- Breadcrumb Navigation -->
        <!-- <div class="max-w-7xl mx-auto">
            <nav class="text-blue-600 text-sm">
              <NuxtLink to="/" class="">Home</NuxtLink>
              <span class="mx-2">></span>
              <NuxtLink
                :to="`/find-doctor?location=${doctorsStore.selectedLocation}`"
                class=""
              >Find Doctors</NuxtLink>
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
          </div> -->

        <!-- Banner Ad -->
        <div class="max-w-7xl mx-auto">
          <div
            class="bg-gray-200 rounded-xl shadow-md h-32 flex items-center justify-center"
          >
            <span class="text-base text-gray-700 font-medium"
              >Horizontal Ad Banner</span
            >
          </div>
        </div>

        <!-- 👨‍⚕️ Doctor Info Card -->
        <div
          class="bg-white p-4 sm:p-6 rounded-2xl shadow-lg max-w-7xl mx-auto border border-gray-200"
        >
          <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <img
                src="https://static.vecteezy.com/system/resources/previews/041/408/858/non_2x/ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab-coat-isolated-on-transparent-background-free-png.png"
                class="w-48 h-48 object-cover"
                alt="Doctor Illustration"
              />
              <div class="text-center md:text-left space-y-2">
                <h1 class="text-xl md:text-3xl font-bold text-gray-900">
                  Dr. {{ doctor.name }}
                </h1>
                <p class="text-gray-600 text-base">{{ doctor.degree }}</p>
                <p class="text-blue-700 font-medium text-base tracking-wide">
                  {{ doctor.specilities }}
                </p>
              </div>
            </div>

            <div class="border-t border-gray-300"></div>

            <!-- 👍👎 Recommend Doctor -->
            <div
              v-if="!loading && !error && doctor"
              class="flex flex-col items-center gap-3"
            >
              <div class="flex items-center gap-4">
                <p class="text-sm font-medium text-gray-600">
                  Recommend this Doctor:
                </p>
                <div class="flex items-center gap-4">
                  <button
                    v-if="authStore.isAuthenticated"
                    @click="recommendDoctor(true)"
                    :class="[
                      'text-2xl transition-transform duration-200',
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
                      'text-2xl transition-transform duration-200',
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
              </div>
              <p
                v-if="recommendationPercentage > 0"
                class="text-sm text-gray-600"
              >
                {{ recommendationPercentage }}% of users recommend Dr.
                {{ doctor.name }}
              </p>
            </div>

            <div class="border-t border-gray-300"></div>

            <!-- Stats Section -->
            <div class="flex flex-row justify-around text-center">
              <div class="space-y-1">
                <p class="text-xl md:text-2xl font-semibold text-gray-900">
                  {{ formatNumber(2050) }}
                </p>
                <p class="text-sm text-gray-500">Patients</p>
              </div>
              <div v-if="doctor.experience !== ''" class="space-y-1">
                <p class="text-xl md:text-2xl font-semibold text-gray-900">
                  {{ doctor.experience }} Years
                </p>
                <p class="text-sm text-gray-500">Experience</p>
              </div>
              <div class="space-y-1">
                <p class="text-xl md:text-2xl font-semibold text-gray-900">
                  {{ formatNumber(5300) }}
                </p>
                <p class="text-sm text-gray-500">Reviews</p>
              </div>
            </div>

            <div class="border-t border-gray-300"></div>

            <!-- 📖 About Doctor -->
            <div class="py-4">
              <p class="text-gray-600 leading-relaxed">
                Dr. {{ doctor.name }} is an experienced
                {{ doctor.specilities.toLowerCase() }} specialist with over
                {{ doctor.experience || "several" }} years of practice.
                Committed to providing top-notch care, Dr.
                {{ doctor.name }} focuses on accurate diagnosis and effective
                treatment plans tailored to each patient's needs.
              </p>
            </div>
          </div>
        </div>

        <!-- 👨‍⚕️ Related Doctors -->
        <div class="max-w-7xl mx-auto py-6">
          <h2 class="text-center text-2xl font-semibold text-gray-800 mb-4">
            Other
            <span class="text-blue-600">{{ doctor.specilities }}</span> Doctors
            from
            <span class="text-blue-600">{{
              doctorsStore.selectedLocation
            }}</span>
          </h2>

          <div class="relative px-8 sm:px-12">
            <button
              @click="scrollLeft"
              class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>
            <div
              ref="doctorsList"
              class="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 px-2 hide-scrollbar"
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
            <button
              @click="scrollRight"
              class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- 📅 Available Dates -->
        <div class="bg-gray-100 py-6">
          <div class="max-w-7xl mx-auto px-0">
            <h2 class="text-center text-2xl font-semibold text-gray-800 mb-4">
              Available Dates <span v-if="clinic">at {{ clinic.name }}</span>
            </h2>

            <div v-if="scheduleLoading" class="text-center text-gray-500">
              Loading schedule...
            </div>
            <div v-else-if="scheduleError" class="text-center text-red-500">
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

            <div v-else class="relative px-14">
              <button
                @click="scrollLeftDates"
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
              >
                <ChevronLeftIcon class="w-5 h-5" />
              </button>
              <div
                ref="datesList"
                class="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 hide-scrollbar"
              >
                <div
                  v-for="date in availableDates"
                  :key="date"
                  @click="selectDate(date)"
                  :class="[
                    'flex-shrink-0 w-24 p-4 rounded-lg border text-center cursor-pointer transition-all duration-200',
                    selectedDate === date
                      ? 'bg-blue-700 text-white border-blue-700 shadow-lg'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100',
                  ]"
                >
                  <p class="text-sm font-medium">{{ formatMonthYear(date) }}</p>
                  <p class="text-xl font-bold">{{ formatDay(date) }}</p>
                </div>
              </div>
              <button
                @click="scrollRightDates"
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 rounded-full shadow hover:bg-blue-600 transition"
              >
                <ChevronRightIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 📋 Appointment Summary -->
        <div v-if="selectedSlot" class="py-6 px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
              <span class="text-blue-600">Appointment</span> Details
            </h2>

            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 border rounded-2xl p-6 bg-white shadow-md"
            >
              <!-- Left: Info -->
              <div class="space-y-2 text-gray-700 flex-1">
                <p>
                  <span class="font-medium">Date:</span>
                  {{ selectedSlot.date || selectedSlot.scheduledate }}
                </p>

                <p>
                  <span class="font-medium">Clinic:</span>
                  <NuxtLink
                    v-if="clinic"
                    :to="`/find-clinic?clinic=${clinicSlug}`"
                    class="text-blue-600 underline hover:text-blue-500 transition"
                  >
                    {{ clinic.name }}
                  </NuxtLink>
                  <span v-else>{{ selectedSlot.clinicname }}</span>
                </p>

                <p>
                  <span class="font-medium">Address:</span>
                  {{ clinic ? clinic.address : selectedSlot.ClinicA }}
                </p>

                <p>
                  <span class="font-medium">Doctor Fee:</span>
                  ₹{{ selectedSlot.docfee || "500" }}
                </p>

                <p>
                  <span class="font-medium">Platform Fee:</span>
                  ₹{{ selectedSlot.pfee || "50" }}
                </p>
              </div>

              <!-- Right: Button -->
              <div class="sm:self-center w-full sm:w-auto">
                <button
                  @click="submitBooking"
                  class="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow"
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
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
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

// References for smooth scrolling
const doctorsList = ref(null);
const datesList = ref(null);

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

const scrollLeftDates = () => {
  datesList.value.scrollBy({ left: -150, behavior: "smooth" });
};

const scrollRightDates = () => {
  datesList.value.scrollBy({ left: 150, behavior: "smooth" });
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
.bg-white {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.bg-white:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

/* Typography */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.text-gray-600 {
  line-height: 1.75;
}

/* Buttons */
.bg-green-600 {
  transition: all 0.2s ease;
}

.bg-green-600:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Date Selection and Carousel */
.w-24 {
  transition: all 0.2s ease;
}

.w-24:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (min-width: 640px) {
  .text-xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

@media (min-width: 768px) {
  .text-xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
}
</style>
