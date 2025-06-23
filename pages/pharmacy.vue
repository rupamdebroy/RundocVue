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
            location || "Your Area"
          }}</span>
        </h1>
        <p
          class="text-center text-green-600 font-medium mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base max-w-2xl mx-auto"
        >
          Enjoy Zero Platform Fees & Exclusive Discounts! Your health, your
          savings.
        </p>

        <PharmacyInfoBoxes />

        <PharmacyList />
      </div>
    </section>

    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLocationStore } from "@/stores/location";
import { useRoute } from "vue-router";

// Import your sub-components
import Header from "@/components/Header.vue";
import WebHeaderNav from "~/components/WebHeaderNav.vue";
import PharmacyInfoBoxes from "~/components/PharmacyInfoBoxes.vue"; // Import the new component
import PharmacyList from "~/components/PharmacyList.vue"; // Import the new component
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

const route = useRoute();
const locationStore = useLocationStore();

const location = ref(""); // This ref is primarily for the hero section display

onMounted(async () => {
  // Restore location from store (might be persisted from previous session)
  await locationStore.restoreLocation();

  // Prioritize location from route query, then from store, then default
  const initialLocation =
    route.query.location || locationStore.currentLocation || "Your Area";

  // If a new location is coming from the query, update the store
  if (
    route.query.location &&
    route.query.location !== locationStore.currentLocation
  ) {
    locationStore.setLocation(route.query.location);
  }

  location.value = initialLocation;
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
