<template>
  <section class="py-4 bg-gray-100">
    <div class="container mx-auto px-4">
      <div
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-0"
      >
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
          <p class="text-sm text-gray-600 hidden sm:block">
            {{ info.shortDescription }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

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
</script>

<style scoped>
/* Scoped styles specific to this component */
.container {
  max-width: 1200px;
}
</style>
