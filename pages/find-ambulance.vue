<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Providers = {{ ambulanceStore.providers.length }}</p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Hero Section -->
        <div
          class="bg-cover bg-center mb-8 rounded-lg"
          style="
            background-image: url('https://via.placeholder.com/1200x300?text=Ambulance+Emergency');
          "
        >
          <div
            class="bg-black bg-opacity-50 p-6 md:p-12 text-white text-center rounded-lg"
          >
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
              🚑 **RUNDOC Ambulance Booking – {{ location }}**
            </h1>
            <p class="text-lg md:text-xl mb-4">
              Need an Ambulance in {{ location }}? Book Instantly with RUNDOC
            </p>
            <p class="text-md mb-6">
              Quick and reliable ambulance booking at your fingertips. Available
              24/7 for emergencies.
            </p>
            <NuxtLink
              v-if="ambulanceStore.providers.length > 0"
              :to="`/book-ambulance?ambulanceID=${ambulanceStore.providers[0].id}`"
              class="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
            >
              🔐 **[ Book Ambulance ]**
            </NuxtLink>
            <p v-else class="text-red-500">
              No ambulances available in this location.
            </p>
          </div>
        </div>

        <!-- Info Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <i class="fas fa-phone-volume text-red-600 text-2xl mb-2"></i>
            <h3 class="font-semibold">📞 24/7 Emergency Support</h3>
            <p class="text-sm text-gray-600">
              We’re available around the clock to help you during any medical
              crisis in {{ location }}.
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <i class="fas fa-ambulance text-red-600 text-2xl mb-2"></i>
            <h3 class="font-semibold">🏥 Multiple Ambulance Types</h3>
            <p class="text-sm text-gray-600">
              From basic support to ICU-equipped vehicles — choose based on your
              emergency needs.
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <i class="fas fa-lock text-red-600 text-2xl mb-2"></i>
            <h3 class="font-semibold">🔒 Private & Secure Coordination</h3>
            <p class="text-sm text-gray-600">
              All bookings are handled manually by our team — with complete
              confidentiality.
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg shadow-sm text-center">
            <i class="fas fa-money-bill-wave text-red-600 text-2xl mb-2"></i>
            <h3 class="font-semibold">🚫 No Extra Booking Charges</h3>
            <p class="text-sm text-gray-600">
              You pay directly to the ambulance provider. RUNDOC does not charge
              any service fee.
            </p>
          </div>
        </div>

        <!-- About Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-center mb-4">
            Why Choose RUNDOC in {{ location }}?
          </h2>
          <p class="text-center text-gray-600 mb-4">
            RUNDOC helps you during medical emergencies by connecting you with
            available ambulance services in {{ location }}. You just need to log
            in and submit your request — our trained team takes care of
            everything else.
          </p>
          <ul class="list-disc pl-6 text-gray-600 text-center md:text-left">
            <li>✅ Book Ambulance After Login</li>
            <li>✅ Response Within Minutes</li>
            <li>✅ Trusted by Families in {{ location }}</li>
            <li>✅ Clean & Safe Vehicle Coordination</li>
          </ul>
        </div>

        <!-- How It Works -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-center mb-4">
            How RUNDOC Ambulance Booking Works
          </h2>
          <ol class="list-decimal pl-6 text-gray-600">
            <li>🔐 Login to Your RUNDOC Account</li>
            <li>📝 Submit Ambulance Request with Basic Details</li>
            <li>📞 Our Team Contacts Ambulance Providers</li>
            <li>🚑 Ambulance Is Dispatched as Soon as Available</li>
          </ol>
          <p class="text-center text-gray-600 mt-2">
            *We don’t use automated systems — every request is handled manually
            for reliability and personal care.*
          </p>
        </div>

        <!-- FAQs -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <div class="space-y-4">
            <div>
              <p class="font-semibold">
                Q1. Do I need to log in to request an ambulance?
              </p>
              <p class="text-gray-600">
                A. Yes, login ensures your request is verified and gets priority
                handling.
              </p>
            </div>
            <div>
              <p class="font-semibold">
                Q2. Will RUNDOC assign the ambulance directly?
              </p>
              <p class="text-gray-600">
                A. Our team contacts trusted ambulance providers manually and
                follows up with you.
              </p>
            </div>
            <div>
              <p class="font-semibold">Q3. Are there any charges by RUNDOC?</p>
              <p class="text-gray-600">
                A. No, we don't charge booking fees. Payment goes directly to
                the ambulance provider.
              </p>
            </div>
            <div>
              <p class="font-semibold">
                Q4. Can I request ICU or Oxygen Ambulance?
              </p>
              <p class="text-gray-600">
                A. Yes, these are available based on the patient’s need. You can
                choose the type after logging in.
              </p>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAmbulanceStore } from "@/stores/ambulance";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const ambulanceStore = useAmbulanceStore();
const locationStore = useLocationStore();

const location = ref("");
const loading = ref(false);
const error = ref("");
const debugMode = ref(true);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  // Force update location from route query
  const queryLocation = route.query.location;
  if (queryLocation && queryLocation !== "Select Location") {
    locationStore.setLocation(queryLocation);
    location.value = queryLocation;
    await ambulanceStore.fetchProviders(queryLocation);
  } else {
    location.value = locationStore.currentLocation || "Dharmanager"; // Fallback
    locationStore.setLocation(location.value);
    await ambulanceStore.fetchProviders(location.value);
  }

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
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
  max-width: 1200px;
}
</style>
