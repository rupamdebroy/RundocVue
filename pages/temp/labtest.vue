<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
          Book Lab Test & Diagnostics in
          <span class="text-blue-600">{{ location }}</span>
        </h1>
        <p class="text-center text-green-600 font-medium mb-10">
          Enjoy Free Booking – No Extra Charges!
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div
            v-for="(info, index) in infoboxes"
            :key="index"
            class="relative w-full h-52 group perspective"
          >
            <div
              class="relative w-full h-full transition-transform duration-500 transform-style group-hover:rotate-y-180"
            >
              <div
                class="absolute w-full h-full rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center backface-hidden"
                :class="[
                  index % 3 === 0
                    ? 'bg-blue-50'
                    : index % 3 === 1
                    ? 'bg-green-50'
                    : 'bg-yellow-50',
                ]"
              >
                <div class="text-blue-600 text-4xl mb-2">
                  <i :class="info.icon"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ info.title }}
                </h3>
              </div>

              <div
                class="absolute w-full h-full rounded-xl p-6 shadow-md text-sm text-gray-700 bg-white backface-hidden rotate-y-180"
              >
                <p
                  class="whitespace-pre-line leading-relaxed text-base items-center justify-center"
                >
                  {{ info.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Horizontal Banner -->
        <div class="bg-blue-600 text-white text-center py-3 px-4 mb-8">
          <p class="text-sm sm:text-base font-medium normal-case">
            Rundoc only facilitates bookings with registered partner
            Laboratories. Rundoc does not operate any lab or diagnostic center
            Of its own.
          </p>
        </div>

        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">Loading lab centers...</p>
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-4">
          <p>{{ error }}</p>
        </div>

        <div v-else>
          <div
            v-if="labStore.labCenters.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            <div
              v-for="lab in labStore.labCenters"
              :key="lab.id"
              class="p-4 py-6 border rounded-xl shadow-md bg-white flex flex-col justify-between hover:shadow-lg transition-all relative"
            >
              <span
                class="absolute top-0 right-0 mt-2 mr-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
              >
                Up to {{ lab.discount }}% OFF
              </span>

              <div class="flex items-center space-x-4 mb-4 mt-4">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold bg-blue-200 shrink-0 overflow-hidden"
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
                  <p class="text-lg font-semibold text-gray-800">
                    {{ lab.name }}
                  </p>
                  <p class="text-sm text-gray-600">{{ lab.address }}</p>
                </div>
              </div>

              <NuxtLink
                :to="`/order-labtest?labcenterId=${lab.id}`"
                class="mt-6 w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-all flex items-center justify-between"
              >
                <span> Order Lab Test</span>
                <i class="fas fa-arrow-right ml-2"></i>
              </NuxtLink>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <p class="text-gray-500">No lab centers found in this location.</p>
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

const infoboxes = [
  {
    title: "Book Tests Online",
    description:
      "Schedule your lab tests anytime, anywhere.\n\nNo waiting lines – fast and convenient bookings.",
    icon: "fas fa-calendar-check",
  },
  {
    title: "Certified Labs",
    description:
      "Partnered with trusted and accredited laboratories.\n\nEnsuring accurate and reliable test results.",
    icon: "fas fa-vial",
  },
  {
    title: "Home Sample Collection",
    description:
      "Get samples collected at your doorstep.\n\nSafe, hygienic, and hassle-free experience.",
    icon: "fas fa-house-user",
  },
  {
    title: "Quick Reports",
    description:
      "Receive your test reports faster.\n\nAccess digital reports directly on your phone or email.",
    icon: "fas fa-file-medical-alt",
  },
  {
    title: "Affordable Packages",
    description:
      "Choose from cost-effective health test packages.\n\nHigh-quality services at reasonable prices.",
    icon: "fas fa-rupee-sign",
  },
  {
    title: "Local & Outstation Booking",
    description:
      "Book tests within your city or from outside – we’ve got you covered.\n\nFlexible booking options for your convenience.",
    icon: "fas fa-globe-asia",
  },
];

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
