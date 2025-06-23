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

    <ExploreSpecialties />

    <StartWithSymptoms />

    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Use useRouter for navigation
import { useLocationStore } from "@/stores/location";

// Import your sub-components
import Header from "~/components/Header.vue";
import WebHeaderNav from "~/components/WebHeaderNav.vue";
import ExploreSpecialties from "~/components/SpecialitySection.vue"; // Adjust path as needed
import StartWithSymptoms from "~/components/SymptomSection.vue"; // Adjust path as needed
import Footer from "~/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

// Heroicons for the value proposition banner
import {
  CheckCircleIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();
const locationStore = useLocationStore();

// This 'location' ref will now primarily be used for the main page's
// display in the hero section and 'Find Clinic' section.
// The sub-components will manage their own location dependencies via their stores.
const location = ref("");

// Navigation logic for 'Find Clinic'
const goToFindClinic = () => {
  router.push({
    path: "/find-clinic",
    query: {
      location: location.value,
    },
  });
};

onMounted(async () => {
  // Ensure locationStore.currentLocation is available for the hero section
  // The sub-components will internally handle fetching doctors/symptoms based on this.
  await locationStore.fetchLocations(); // Fetch locations if not already
  location.value = locationStore.currentLocation || "Your Area";
});
</script>

<style scoped>
/* Background pattern for the hero section */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 0h3v3H0V0zm3 3h3v3H3V3z'/%3E%3C/g%3E%3C/svg%3E");
}

/* Animations (these can be moved to a shared utility CSS if used across many components) */
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
