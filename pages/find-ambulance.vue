<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div
          v-if="debugMode"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 rounded-md"
        >
          <p class="text-xs text-yellow-700">
            Debug: Location = {{ locationStore.currentLocation }}
          </p>
          <p class="text-xs text-yellow-700">
            Debug: Providers = {{ ambulanceStore.providers.length }}
          </p>
          <p class="text-xs text-yellow-700">Error = {{ error || "None" }}</p>
        </div>

        <div
          class="relative overflow-hidden rounded-xl shadow-md mb-12 bg-gradient-to-r from-red-700 to-red-500 min-h-[400px] md:min-h-[350px] lg:min-h-[300px]"
        >
          <img
            :src="heroBackgroundImage"
            alt="Ambulance Emergency"
            class="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-6 rounded-xl text-white"
          >
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-center animate-fade-in-down"
            >
              Rundoc <span class="text-red-200">Ambulance</span> Booking in
              {{ location }}
            </h1>
            <p
              class="text-lg sm:text-xl text-red-100 mb-4 max-w-3xl text-center opacity-90 animate-fade-in-up"
            >
              Your reliable partner for urgent medical transport.
            </p>
            <p
              class="text-base text-white opacity-80 mb-6 max-w-2xl text-center animate-fade-in-up"
            >
              Quick, dependable ambulance booking, available 24/7 for
              emergencies.
            </p>
            <NuxtLink
              v-if="ambulanceStore.providers.length > 0"
              :to="`/book-ambulance?ambulanceID=${ambulanceStore.providers[0].id}`"
              class="inline-flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105 font-semibold text-base shadow-md ease-in-out animate-pulse"
            >
              <i class="fas fa-ambulance mr-2"></i> Book Ambulance Now
            </NuxtLink>
            <p v-else class="text-red-200 text-base font-medium mt-4">
              No ambulance providers found for this location.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            class="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center transition-transform duration-200"
          >
            <i class="fas fa-headset text-red-600 text-3xl mb-3"></i>
            <h3 class="font-bold text-lg text-gray-900 mb-2">
              24/7 Emergency Support
            </h3>
            <p class="text-sm text-gray-700 hidden sm:block">
              Available around the clock for medical crises in {{ location }}.
            </p>
          </div>
          <div
            class="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center transition-transform duration-200"
          >
            <i class="fas fa-hospital-symbol text-red-600 text-3xl mb-3"></i>
            <h3 class="font-bold text-lg text-gray-900 mb-2">
              Multiple Ambulance Types
            </h3>
            <p class="text-sm text-gray-700 hidden sm:block">
              Choose from basic support to ICU-equipped vehicles.
            </p>
          </div>
          <div
            class="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center transition-transform duration-200"
          >
            <i class="fas fa-user-shield text-red-600 text-3xl mb-3"></i>
            <h3 class="font-bold text-lg text-gray-900 mb-2">
              Private & Secure
            </h3>
            <p class="text-sm text-gray-700 hidden sm:block">
              Confidential bookings handled by our dedicated team.
            </p>
          </div>
          <div
            class="p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center transition-transform duration-200"
          >
            <i class="fas fa-coins text-red-600 text-3xl mb-3"></i>
            <h3 class="font-bold text-lg text-gray-900 mb-2">
              No Extra Charges
            </h3>
            <p class="text-sm text-gray-700 hidden sm:block">
              Pay directly to providers, no booking fees from Rundoc.
            </p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6"
          >
            How Rundoc Ambulance Booking Works
          </h2>
          <div
            class="relative grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center"
          >
            <div
              class="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-red-200 z-0 mx-20"
            ></div>
            <div
              class="hidden md:block lg:hidden absolute top-1/2 left-0 right-0 h-1 bg-red-200 z-0 mx-12"
            ></div>

            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl font-bold border-2 border-red-300"
              >
                <i class="fas fa-user-lock"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Login to Account
              </h3>
              <p class="text-sm text-gray-700 hidden sm:block">
                Log in to your Rundoc account to start booking.
              </p>
            </div>

            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl font-bold border-2 border-red-300"
              >
                <i class="fas fa-file-alt"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Submit Request
              </h3>
              <p class="text-sm text-gray-700 hidden sm:block">
                Enter patient details, pickup, and destination addresses.
              </p>
            </div>

            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl font-bold border-2 border-red-300"
              >
                <i class="fas fa-phone-alt"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Team Coordinates
              </h3>
              <p class="text-sm text-gray-700 hidden sm:block">
                Our team contacts reliable providers in your area.
              </p>
            </div>

            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl font-bold border-2 border-red-300"
              >
                <i class="fas fa-check-circle"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Ambulance Dispatched
              </h3>
              <p class="text-sm text-gray-700 hidden sm:block">
                The closest ambulance is dispatched to your location.
              </p>
            </div>
          </div>
          <p class="text-center text-gray-700 mt-6 max-w-2xl mx-auto text-sm">
            Every request is handled manually for maximum reliability and care.
          </p>
        </div>

        <div class="bg-gray-50 p-8 rounded-xl shadow-md mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6"
          >
            Why Trust Rundoc for Ambulance Services?
          </h2>
          <div
            class="flex flex-col lg:flex-row items-center justify-center gap-6"
          >
            <div class="lg:w-1/2 text-center lg:text-left">
              <p class="text-sm text-gray-700 mb-4">
                Rundoc provides seamless, secure ambulance booking during
                critical times, connecting you with verified providers.
              </p>
              <p class="text-sm text-gray-700 mb-4">
                Our service removes the stress of finding a reliable ambulance,
                letting you focus on the patient.
              </p>
            </div>
            <div class="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <i class="fas fa-check-circle text-green-500 text-lg"></i>
                <span class="font-semibold text-sm text-gray-800"
                  >Verified Providers</span
                >
              </div>
              <div
                class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <i class="fas fa-check-circle text-green-500 text-lg"></i>
                <span class="font-semibold text-sm text-gray-800"
                  >Fast Response</span
                >
              </div>
              <div
                class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <i class="fas fa-check-circle text-green-500 text-lg"></i>
                <span class="font-semibold text-sm text-gray-800"
                  >Transparent Pricing</span
                >
              </div>
              <div
                class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <i class="fas fa-check-circle text-green-500 text-lg"></i>
                <span class="font-semibold text-sm text-gray-800"
                  >24/7 Availability</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6"
          >
            Frequently Asked Questions
          </h2>
          <div class="space-y-3">
            <div
              v-for="(faq, index) in faqs"
              :key="index"
              class="border-b border-gray-200 last:border-b-0"
            >
              <div
                class="flex justify-between items-center py-3 cursor-pointer text-gray-800 hover:text-red-600 transition-colors duration-200"
                @click="toggleFaq(index)"
              >
                <span class="font-semibold text-base">{{ faq.question }}</span>
                <i
                  class="fas transition-transform duration-200"
                  :class="{
                    'fa-chevron-up': faq.open,
                    'fa-chevron-down': !faq.open,
                  }"
                ></i>
              </div>
              <div
                class="overflow-hidden transition-all duration-200 ease-in-out"
                :style="{
                  maxHeight: faq.open ? faq.height + 'px' : '0px',
                }"
              >
                <p ref="faqAnswer" class="text-gray-700 pb-3 text-sm">
                  {{ faq.answer }}
                </p>
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
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useAmbulanceStore } from "@/stores/ambulance";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const ambulanceStore = useAmbulanceStore();
const locationStore = useLocationStore();

const location = ref("");
const loading = ref(false);
const error = ref("");
const debugMode = ref(false);

const heroBackgroundImage = ref(
  "https://www.shutterstock.com/image-illustration/ambulance-car-isolated-on-white-600nw-1951060498.jpg"
);

const faqs = ref([
  {
    question: "Q1. Do I need to log in to request an ambulance?",
    answer:
      "A. Yes, logging in ensures your request is verified and gets priority handling, allowing us to serve you more efficiently during an emergency. It also helps in pre-filling your details for a faster booking process.",
    open: false,
    height: 0,
  },
  {
    question: "Q2. Will Rundoc assign the ambulance directly?",
    answer:
      "A. Our dedicated team contacts trusted ambulance providers manually based on your specific location and medical needs. We ensure a reliable dispatch and maintain communication with you throughout the process.",
    open: false,
    height: 0,
  },
  {
    question: "Q3. Are there any charges by Rundoc for booking?",
    answer:
      "A. No, we believe in transparent service. Rundoc does not charge any booking or service fees for facilitating the ambulance request. All payments for the ambulance service itself are made directly to the ambulance provider upon service completion.",
    open: false,
    height: 0,
  },
  {
    question: "Q4. Can I request an ICU or Oxygen Ambulance?",
    answer:
      "A. Yes, during the booking process, you can specify the type of ambulance required (e.g., Basic Life Support, Advanced Life Support, ICU-equipped, Oxygen Support). Our team will strive to find an ambulance that meets your specific medical requirements, subject to availability within our partner network.",
    open: false,
    height: 0,
  },
]);

const faqAnswer = ref([]);

const toggleFaq = async (index) => {
  faqs.value[index].open = !faqs.value[index].open;
  if (faqs.value[index].open) {
    await nextTick();
    faqs.value[index].height = faqAnswer.value[index]?.scrollHeight || 0;
  } else {
    faqs.value[index].height = 0;
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  await locationStore.restoreLocation();

  const queryLocation = route.query.location;
  if (queryLocation && queryLocation !== "Select Location") {
    location.value = queryLocation;
    locationStore.setLocation(queryLocation);
  } else if (locationStore.currentLocation) {
    location.value = locationStore.currentLocation;
  } else {
    location.value = "Baidyabati";
    locationStore.setLocation("Baidyabati");
  }

  await ambulanceStore.fetchProviders(location.value);

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
  await nextTick();
  faqs.value.forEach((faq, index) => {
    if (faq.open) {
      faq.height = faqAnswer.value[index]?.scrollHeight || 0;
    }
  });
});

watch(
  () => route.query.location,
  async (newLocation) => {
    if (newLocation && newLocation !== location.value) {
      location.value = newLocation;
      locationStore.setLocation(newLocation);
      await ambulanceStore.fetchProviders(newLocation);
    }
  }
);
</script>

<style scoped>
.container {
  max-width: 1152px;
}

/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* General styling */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Custom focus ring */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

/* Connecting line for How It Works */
@media (min-width: 1024px) {
  .how-it-works-grid::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      #fecaca,
      #fecaca,
      transparent
    );
    z-index: 0;
  }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .how-it-works-grid::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      #fecaca,
      #fecaca,
      transparent
    );
    z-index: 0;
  }
}
</style>
