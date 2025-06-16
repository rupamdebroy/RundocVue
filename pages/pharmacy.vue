<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen py-6 sm:py-8 lg:py-10 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-2 leading-tight"
        >
          Order Medicines in
          <span class="text-blue-600 block sm:inline-block mt-1 sm:mt-0">{{
            location
          }}</span>
        </h1>
        <p
          class="text-center text-green-600 font-medium mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base max-w-2xl mx-auto"
        >
          Enjoy Zero Platform Fees & Exclusive Discounts! Your health, your
          savings.
        </p>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12"
        >
          <div
            v-for="(info, index) in infoboxes"
            :key="index"
            class="relative w-full h-48 sm:h-52 group perspective cursor-pointer"
          >
            <div
              class="relative w-full h-full transition-transform duration-500 transform-style group-hover:rotate-y-180 rounded-2xl shadow-lg"
            >
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
              </div>

              <div
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
            RUNDOC ONLY FACILITATES BOOKINGS WITH REGISTERED PARTNER PHARMACIES.
            RUNDOC DOES NOT OPERATE ANY PHARMACY OR MEDICAL STORE OF ITS OWN.
            RUNDOC DOES NOT HOLD ANY MEDICINE STOCK, WAREHOUSE, OR ISSUE
            INVOICES. ALL MEDICINES ARE SOLD AND INVOICED SOLELY BY REGISTERED
            CHEMISTS.
          </p>
        </div>

        <div v-if="loading" class="text-center py-8 sm:py-10">
          <p class="text-gray-500 text-lg">Loading pharmacies...</p>
          <div
            class="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"
          ></div>
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-8 sm:py-10">
          <p class="text-lg font-medium">{{ error }}</p>
          <p class="text-sm mt-2 text-gray-600">
            Please try again or select a different location.
          </p>
        </div>

        <div v-else>
          <div
            v-if="pharmacyStore.pharmacies.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <div
              v-for="pharmacy in pharmacyStore.pharmacies"
              :key="pharmacy.id"
              class="p-4 sm:p-5 border border-gray-200 rounded-xl shadow-md bg-white flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              <span
                class="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white text-xs sm:text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md z-10"
              >
                Up to {{ pharmacy.discount }}% OFF
              </span>

              <div class="flex items-start space-x-4 mb-4 mt-4">
                <div
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold bg-blue-100 shrink-0 overflow-hidden shadow-inner border border-blue-200"
                >
                  <img
                    v-if="pharmacy.dp"
                    :src="pharmacy.dp"
                    :alt="`${pharmacy.name} DP`"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <span v-else>{{ pharmacy.name?.charAt(0) || "?" }}</span>
                </div>

                <div class="flex-grow">
                  <p
                    class="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-snug"
                  >
                    {{ pharmacy.name }}
                  </p>
                  <p class="text-sm text-gray-600 mb-1 leading-snug">
                    <i class="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                    {{ pharmacy.address }}
                  </p>
                  <p class="text-xs text-gray-500 leading-snug">
                    <i class="fas fa-city text-blue-500 mr-1"></i>
                    {{ pharmacy.city }}
                  </p>
                </div>
              </div>

              <NuxtLink
                :to="`/order-medicine?pharmacyId=${pharmacy.id}`"
                class="mt-auto w-full bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                <span> Order Medicine</span>
                <i class="fas fa-arrow-right ml-2 text-white text-base"></i>
              </NuxtLink>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <p class="text-gray-500 text-lg">
              No pharmacies found in this location.
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Try searching for another area or check back later.
            </p>
          </div>

          <p
            v-if="pharmacyStore.info"
            class="text-center text-gray-600 mt-6 text-sm italic"
          >
            {{ pharmacyStore.info }}
          </p>
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
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePharmacyStore } from "@/stores/pharmacy";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const pharmacyStore = usePharmacyStore();
const locationStore = useLocationStore();

const location = ref("");
const loading = ref(false);
const error = ref("");

const infoboxes = computed(() => [
  {
    title: "Easy Ordering",
    description: `Order your medicines online in just a few clicks from pharmacies in ${
      location.value || "your area"
    }.\n\nSay goodbye to queues — it's simple, fast, and hassle-free.`,
    icon: "fas fa-shopping-cart",
  },
  {
    title: "Verified Medicines",
    description:
      "100% genuine and doctor-approved medicines.\n\nWe ensure quality and safety in every single order.",
    icon: "fas fa-check-double",
  },
  {
    title: "Home Delivery",
    description:
      "Fast, reliable doorstep delivery.\n\nYour medicines delivered safely and securely to your home.",
    icon: "fas fa-truck-moving",
  },
  {
    title: "Upload Prescription",
    description:
      "Upload your prescription to get started.\n\nOur team verifies and processes your order quickly.",
    icon: "fas fa-file-upload",
  },
  {
    title: "Exclusive Discounts",
    description:
      "Save more with every order through special offers.\n\nEnjoy regular deals on a wide range of health products.",
    icon: "fas fa-tags",
  },
  {
    title: "Local & Out-of-City Delivery",
    description: `Order medicines locally in ${
      location.value || "your city"
    } or from trusted pharmacies outside your city.\n\nWe ensure prompt delivery, no matter your location.`,
    icon: "fas fa-globe-asia",
  },
]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  // Restore location from localStorage
  await locationStore.restoreLocation();

  // Use location from query if available, otherwise fall back to store
  location.value = route.query.location || locationStore.currentLocation;

  if (location.value && location.value !== "Select Location") {
    locationStore.setLocation(location.value);
    await pharmacyStore.fetchPharmacies(location.value);
  } else {
    error.value = "Please select a location.";
    // Optionally, redirect to home or a dedicated location selection page
    // router.push("/");
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
    await fetchData();
  },
  { deep: true }
);

// Watch for location changes in the store to reactively update computed infobox descriptions
watch(
  () => locationStore.currentLocation,
  (newLocation) => {
    location.value = newLocation;
  }
);

// Fallback image for pharmacy DP if the URL fails
const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/80?text=Pharmacy"; // Larger placeholder
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Add perspective to the parent to enable 3D transform */
.perspective {
  perspective: 1000px;
}

/* Preserve 3D transforms on the element that will be flipped */
.transform-style {
  transform-style: preserve-3d;
}

/* Hide the backface of the elements during the flip */
.backface-hidden {
  backface-visibility: hidden;
}

/* Apply the initial rotation to the back face */
.rotate-y-180 {
  transform: rotateY(180deg);
}

/* This is the key change: when the .group is hovered, apply rotateY(180deg) to its child with .transform-style */
.group:hover .group-hover\:rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
