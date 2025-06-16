<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="py-8 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-blue-700 mb-3">
            Your Health, Simplified in
            <span class="text-green-600">{{ location }}</span>
          </h1>
          <p class="text-lg text-gray-600 font-semibold mb-6">
            Book your lab tests and diagnostics with ease. No extra charges!
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div
            v-for="(info, index) in infoboxes"
            :key="index"
            class="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div
              class="mx-auto w-12 h-12 rounded-full flex items-center justify-center text-blue-600 bg-blue-100 mb-2"
            >
              <i :class="info.icon" class="text-2xl"></i>
            </div>
            <h3 class="text-md font-semibold text-gray-800 mb-1">
              {{ info.title }}
            </h3>
            <p class="text-sm text-gray-600">{{ info.shortDescription }}</p>
          </div>
        </div>

        <div
          class="bg-blue-50 text-blue-700 border border-blue-200 rounded-md py-2 px-4 mb-8 text-center text-sm"
        >
          <p class="font-medium">
            <i class="fas fa-info-circle mr-2"></i> Rundoc facilitates bookings
            with registered partner labs. We do not operate our own labs.
          </p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">
            <i class="fas fa-spinner fa-spin mr-2"></i> Loading lab centers...
          </p>
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-4">
          <p><i class="fas fa-exclamation-triangle mr-2"></i> {{ error }}</p>
        </div>

        <div v-else>
          <div
            v-if="labStore.labCenters.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="lab in labStore.labCenters"
              :key="lab.id"
              class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div class="relative px-4 py-8">
                <span
                  v-if="lab.discount"
                  class="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10"
                >
                  Up to {{ lab.discount }}% OFF
                </span>
                <div class="flex items-center space-x-3 mb-3">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold bg-blue-100 shrink-0 overflow-hidden"
                  >
                    <img
                      v-if="lab.dp"
                      :src="lab.dp"
                      alt="Lab DP"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <span v-else>{{ lab.name?.charAt(0) || "?" }}</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800 truncate">
                      {{ lab.name }}
                    </h3>
                    <p class="text-sm text-gray-600 truncate">
                      {{ lab.address }}
                    </p>
                  </div>
                </div>
                <div
                  class="flex items-center text-xs text-green-600 mt-1"
                  v-if="lab.homeCollection"
                >
                  <i class="fas fa-house-user mr-1"></i> Home Sample Collection
                  Available
                </div>
              </div>
              <div class="bg-gray-50 p-3 border-t">
                <NuxtLink
                  :to="`/order-labtest?labcenterId=${lab.id}`"
                  class="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                >
                  <i class="fas fa-vial mr-2"></i> Book Now
                </NuxtLink>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <p class="text-gray-500">
              <i class="fas fa-flask mr-2"></i> No lab centers found in this
              location.
            </p>
          </div>

          <p
            v-if="labStore.info"
            class="text-center text-gray-600 mt-4 text-sm"
          >
            {{ labStore.info }}
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLabStore } from "@/stores/lab";
import { useLocationStore } from "@/stores/location";

const route = useRoute();
const router = useRouter();
const labStore = useLabStore();
const locationStore = useLocationStore();

const location = ref("");
const loading = ref(false);
const error = ref("");

const infoboxes = ref([
  {
    title: "Book Tests Online",
    shortDescription: "Schedule tests easily, 24/7.",
    description:
      "Schedule your lab tests anytime, anywhere.\n\nNo waiting lines – fast and convenient bookings.",
    icon: "fas fa-calendar-check",
  },
  {
    title: "Certified Labs",
    shortDescription: "Accurate results from trusted labs.",
    description:
      "Partnered with trusted and accredited laboratories.\n\nEnsuring accurate and reliable test results.",
    icon: "fas fa-vial",
  },
  {
    title: "Home Sample Collection",
    shortDescription: "Comfort and convenience at your door.",
    description:
      "Get samples collected at your doorstep.\n\nSafe, hygienic, and hassle-free experience.",
    icon: "fas fa-house-user",
  },
  {
    title: "Quick Reports",
    shortDescription: "Get your reports delivered swiftly.",
    description:
      "Receive your test reports faster.\n\nAccess digital reports directly on your phone or email.",
    icon: "fas fa-file-medical-alt",
  },
  {
    title: "Affordable Packages",
    shortDescription: "Quality tests at budget-friendly prices.",
    description:
      "Choose from cost-effective health test packages.\n\nHigh-quality services at reasonable prices.",
    icon: "fas fa-rupee-sign",
  },
  {
    title: "Wide Network",
    shortDescription: "Booking available locally and outstation.",
    description:
      "Book tests within your city or from outside – we’ve got you covered.\n\nFlexible booking options for your convenience.",
    icon: "fas fa-globe-asia",
  },
]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  await locationStore.restoreLocation();
  location.value = route.query.location || locationStore.currentLocation;

  if (location.value && location.value !== "Select Location") {
    locationStore.setLocation(location.value);
    await labStore.fetchLabCenters(location.value);
  } else {
    error.value = "Please select a location.";
    router.push("/");
  }

  loading.value = false;
};

onMounted(fetchData);

watch(() => route.query, fetchData, { deep: true });

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/64?text=Lab";
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
