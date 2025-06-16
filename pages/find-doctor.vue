<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section
      class="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-24 overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-pattern opacity-10 pointer-events-none"
      ></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in-down"
          >
            Find the Right
            <span class="text-blue-600 drop-shadow-md">Doctor</span> for You
          </h1>
          <p
            class="text-lg sm:text-xl text-gray-700 mb-8 animate-fade-in-down delay-100"
          >
            Expert care, tailored to your needs, in
            <span class="font-bold text-blue-700">{{
              location || "Your Area"
            }}</span>
          </p>

          <div
            class="max-w-xl mx-auto bg-gradient-to-r from-teal-50 to-blue-100 rounded-xl shadow-lg p-6 sm:p-8 transform animate-fade-in-up delay-300 border border-teal-200"
          >
            <h3 class="text-xl sm:text-2xl font-bold text-teal-800 mb-2">
              Exclusive Partner Offers!
            </h3>
            <p class="text-gray-700 text-sm sm:text-base">
              Get special discounts on your first consultation with select
              doctors.
            </p>
            <button
              class="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 text-sm sm:text-base shadow-md"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="bg-blue-600 text-white text-center py-4 px-4 shadow-inner">
      <p
        class="text-sm sm:text-base font-medium flex items-center justify-center flex-wrap gap-x-6 gap-y-2"
      >
        <span class="flex items-center"
          ><CheckCircleIcon class="h-5 w-5 mr-2 text-blue-200" />500+ Verified
          Doctors</span
        >
        <span class="flex items-center"
          ><GlobeAltIcon class="h-5 w-5 mr-2 text-blue-200" />100+
          Specialties</span
        >
        <span class="flex items-center"
          ><SparklesIcon class="h-5 w-5 mr-2 text-blue-200" />Trusted by
          Thousands</span
        >
      </p>
    </div>

    <div
      class="w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg h-40 flex items-center justify-center my-10 px-6 sm:px-10 border border-blue-200 animate-fade-in-up delay-400"
    >
      <div class="text-center">
        <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Find Your Ideal Clinic
        </h3>
        <p class="text-gray-600 text-sm sm:text-base">
          Discover top-rated clinics and hospitals near you.
        </p>
        <button
          @click="goToFindClinic"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm sm:text-base shadow-md"
        >
          Explore Clinics
        </button>
      </div>
    </div>

    <section class="py-16 sm:py-20 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2
          class="text-center text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12 animate-fade-in-down"
        >
          Explore Specialties in
          <span class="text-blue-600">{{ location || "Your Area" }}</span>
        </h2>

        <div
          v-if="loadingSpecialties"
          class="flex justify-center items-center py-10"
        >
          <p class="text-lg text-gray-600 animate-pulse flex items-center">
            <i class="fas fa-spinner fa-spin mr-3"></i> Loading specialties...
          </p>
        </div>

        <div
          v-else-if="specialtiesError"
          class="text-center text-lg text-red-600 py-8 font-semibold"
        >
          <p>
            <i class="fas fa-exclamation-triangle mr-2"></i>
            {{ specialtiesError }}
          </p>
        </div>

        <div v-else>
          <transition-group
            name="fade"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 animate-fade-in-up delay-200"
          >
            <div
              v-for="speciality in displayedSpecialties"
              :key="speciality"
              @click="goToDoctorList(speciality)"
              class="cursor-pointer text-center group transition-all duration-300 transform hover:scale-105 bg-white rounded-xl shadow-md hover:shadow-lg p-4 flex flex-col items-center justify-center border border-gray-100"
            >
              <div
                class="w-20 h-20 mx-auto rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-inner group-hover:shadow-xl group-hover:border-blue-600"
              >
                <i
                  :class="getSpecialtyIcon(speciality)"
                  class="text-3xl transition-all duration-300 group-hover:text-white"
                ></i>
              </div>
              <p
                class="mt-4 text-base font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300 px-2"
              >
                {{ speciality }}
              </p>
            </div>
          </transition-group>

          <div
            v-if="uniqueSpecialties.length > 15"
            class="col-span-full text-center mt-10"
          >
            <button
              @click="toggleShowAllSpecialties"
              class="text-base text-blue-600 font-semibold hover:underline transition-all duration-200 flex items-center justify-center mx-auto"
            >
              {{ showAllSpecialties ? "See Less" : "See More" }}
              <i
                :class="
                  showAllSpecialties
                    ? 'fas fa-chevron-up'
                    : 'fas fa-chevron-down'
                "
                class="ml-2"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2
          class="text-center text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12 animate-fade-in-down"
        >
          Not Sure Who to See?
          <span class="text-blue-600">Start with Your Symptoms</span>
        </h2>

        <div
          v-if="loadingSymptoms"
          class="flex justify-center items-center py-10"
        >
          <p class="text-lg text-gray-600 animate-pulse flex items-center">
            <i class="fas fa-spinner fa-spin mr-3"></i> Loading symptoms...
          </p>
        </div>

        <div
          v-else-if="symptomsError"
          class="text-center text-lg text-red-600 py-8 font-semibold"
        >
          <p>
            <i class="fas fa-exclamation-triangle mr-2"></i> {{ symptomsError }}
          </p>
        </div>

        <div v-else>
          <transition-group
            name="fade"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 animate-fade-in-up delay-200"
          >
            <div
              v-for="symptom in displayedSymptoms"
              :key="symptom"
              @click="goToDoctorListBySymptom(symptom)"
              class="cursor-pointer text-center group transition-all duration-300 transform hover:scale-105 bg-white rounded-xl shadow-md hover:shadow-lg p-4 flex flex-col items-center justify-center border border-gray-100"
            >
              <div
                class="w-20 h-20 mx-auto rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-inner group-hover:shadow-xl group-hover:border-blue-600"
              >
                <i
                  :class="getSymptomIcon(symptom)"
                  class="text-3xl transition-all duration-300 group-hover:text-white"
                ></i>
              </div>
              <p
                class="mt-4 text-base font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300 px-2"
              >
                {{ symptom }}
              </p>
            </div>
          </transition-group>

          <div
            v-if="uniqueSymptoms.length > 15"
            class="col-span-full text-center mt-10"
          >
            <button
              @click="toggleShowAllSymptoms"
              class="text-base text-blue-600 font-semibold hover:underline transition-all duration-200 flex items-center justify-center mx-auto"
            >
              {{ showAllSymptoms ? "See Less" : "See More" }}
              <i
                :class="
                  showAllSymptoms ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
                "
                class="ml-2"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLocationStore } from "@/stores/location";
import { useDoctorsStore } from "~/stores/doctors";
import symptomsData from "~/mock/symptoms.json";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

// Heroicons for the value proposition banner
import {
  CheckCircleIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/vue/24/solid";

const route = useRoute();
const router = useRouter();
const locationStore = useLocationStore();
const doctorsStore = useDoctorsStore();

// Reactive states
const location = ref("");
const uniqueSpecialties = ref([]);
const loadingSpecialties = ref(false);
const specialtiesError = ref(null);
const showAllSpecialties = ref(false);

const uniqueSymptoms = ref([]);
const loadingSymptoms = ref(false);
const symptomsError = ref(null);
const showAllSymptoms = ref(false);

// Computed properties for displaying sliced lists
const displayedSpecialties = computed(() =>
  showAllSpecialties.value
    ? uniqueSpecialties.value
    : uniqueSpecialties.value.slice(0, 15)
);

const displayedSymptoms = computed(() =>
  showAllSymptoms.value
    ? uniqueSymptoms.value
    : uniqueSymptoms.value.slice(0, 15)
);

// Functions to toggle 'show all'
const toggleShowAllSpecialties = () => {
  showAllSpecialties.value = !showAllSpecialties.value;
};

const toggleShowAllSymptoms = () => {
  showAllSymptoms.value = !showAllSymptoms.value;
};

// --- Data Fetching Logic ---
const fetchSpecialties = async () => {
  loadingSpecialties.value = true;
  specialtiesError.value = null;
  try {
    await doctorsStore.fetchDoctors(location.value);
    if (doctorsStore.doctors.length > 0) {
      const specialties = doctorsStore.doctors.map((d) => d.specilities);
      const cleaned = specialties.map((s) => {
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
      uniqueSpecialties.value = [...new Set(cleaned)].sort();
    } else {
      uniqueSpecialties.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch specialties:", err);
    specialtiesError.value =
      "Failed to fetch specialties. Please try again later.";
  } finally {
    loadingSpecialties.value = false;
  }
};

const fetchSymptoms = () => {
  loadingSymptoms.value = true;
  symptomsError.value = null;
  try {
    uniqueSymptoms.value = [...new Set(symptomsData)].sort();
  } catch (err) {
    console.error("Error processing symptoms:", err);
    symptomsError.value = "Failed to process symptoms. Please try again later.";
  } finally {
    loadingSymptoms.value = false;
  }
};

// --- Navigation Logic ---
const goToDoctorList = (speciality) => {
  router.push({
    path: "/doctor-list",
    query: {
      location: location.value,
      specialities: speciality,
    },
  });
};

const goToDoctorListBySymptom = (symptom) => {
  router.push({
    path: "/doctor-list",
    query: {
      location: location.value,
      symptom: symptom,
    },
  });
};

const goToFindClinic = () => {
  router.push({
    path: "/find-clinic",
    query: {
      location: location.value, // Pass the current dynamic location
    },
  });
};

// --- Icon Helpers (same as before, ensuring consistency) ---
const getSpecialtyIcon = (speciality) => {
  const lowerSpeciality = speciality.toLowerCase();
  if (lowerSpeciality.includes("cardiology"))
    return "fas fa-heartbeat text-red-500";
  if (lowerSpeciality.includes("pediatrics"))
    return "fas fa-child text-blue-500";
  if (lowerSpeciality.includes("dermatology"))
    return "fas fa-shield-alt text-green-500";
  if (lowerSpeciality.includes("orthopedic"))
    return "fas fa-bone text-yellow-600";
  if (lowerSpeciality.includes("neurology"))
    return "fas fa-brain text-purple-500";
  if (lowerSpeciality.includes("general physician"))
    return "fas fa-user-md text-gray-600";
  if (lowerSpeciality.includes("gynecology"))
    return "fas fa-venus text-pink-500";
  if (lowerSpeciality.includes("ent"))
    return "fas fa-ear-listen text-orange-500";
  if (lowerSpeciality.includes("psychiatry"))
    return "fas fa-head-side-brain text-indigo-500";
  if (lowerSpeciality.includes("urology")) return "fas fa-flask text-teal-500";
  if (lowerSpeciality.includes("gastroenterology"))
    return "fas fa-stomach text-lime-600";
  if (lowerSpeciality.includes("oncology")) return "fas fa-dna text-red-700";
  if (lowerSpeciality.includes("diabetology"))
    return "fas fa-tint text-amber-600";
  if (lowerSpeciality.includes("pulmonology"))
    return "fas fa-lungs text-sky-500";
  if (lowerSpeciality.includes("radiology"))
    return "fas fa-x-ray text-gray-700";
  if (lowerSpeciality.includes("ophthalmology"))
    return "fas fa-eye text-cyan-600";
  if (lowerSpeciality.includes("dentistry"))
    return "fas fa-tooth text-blue-400";
  if (lowerSpeciality.includes("nutrition"))
    return "fas fa-carrot text-orange-400";

  return "fas fa-hand-sparkles text-gray-600";
};

const getSymptomIcon = (symptom) => {
  const lowerSymptom = symptom.toLowerCase();
  if (lowerSymptom.includes("fever"))
    return "fas fa-thermometer-half text-red-500";
  if (lowerSymptom.includes("cough")) return "fas fa-lungs text-orange-500";
  if (lowerSymptom.includes("headache"))
    return "fas fa-head-side-mask text-purple-500";
  if (
    lowerSymptom.includes("stomach") ||
    lowerSymptom.includes("nausea") ||
    lowerSymptom.includes("vomiting")
  )
    return "fas fa-stomach text-green-500";
  if (lowerSymptom.includes("pain") || lowerSymptom.includes("ache"))
    return "fas fa-hand-holding-medical text-yellow-600";
  if (
    lowerSymptom.includes("cold") ||
    lowerSymptom.includes("flu") ||
    lowerSymptom.includes("sneeze")
  )
    return "fas fa-snowflake text-blue-500";
  if (lowerSymptom.includes("rash") || lowerSymptom.includes("skin"))
    return "fas fa-allergies text-pink-500";
  if (lowerSymptom.includes("dizziness") || lowerSymptom.includes("vertigo"))
    return "fas fa-dizzy text-indigo-500";
  if (lowerSymptom.includes("fatigue") || lowerSymptom.includes("tiredness"))
    return "fas fa-bed text-gray-500";
  if (lowerSymptom.includes("sore throat") || lowerSymptom.includes("hoarse"))
    return "fas fa-comment-medical text-cyan-600";
  if (
    lowerSymptom.includes("breathing") ||
    lowerSymptom.includes("shortness of breath")
  )
    return "fas fa-lungs-virus text-teal-500";
  if (lowerSymptom.includes("eyes") || lowerSymptom.includes("vision"))
    return "fas fa-eye text-blue-400";
  if (lowerSymptom.includes("joint") || lowerSymptom.includes("arthritis"))
    return "fas fa-bone text-brown-500";
  if (
    lowerSymptom.includes("anxiety") ||
    lowerSymptom.includes("depression") ||
    lowerSymptom.includes("stress")
  )
    return "fas fa-brain text-purple-600";

  return "fas fa-question-circle text-gray-600";
};

// Initial data fetch on mount
onMounted(async () => {
  // Use route.query.location first, then locationStore, then a default
  location.value =
    route.query.location || locationStore.currentLocation || "Your Area";
  if (location.value) {
    await Promise.all([fetchSpecialties(), fetchSymptoms()]);
  } else {
    specialtiesError.value = "Location parameter is required to find doctors.";
    symptomsError.value = "Location parameter is required to find symptoms.";
  }
});
</script>

<style scoped>
/* Background pattern for the hero section */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 0h3v3H0V0zm3 3h3v3H3V3z'/%3E%3C/g%3E%3C/svg%3E");
}

/* Animations for transition-group (Specialties/Symptoms) */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-active {
  position: absolute; /* Ensures smooth removal without layout shift */
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

.animate-fade-in-down.delay-100 {
  animation-delay: 0.1s;
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
</style>
