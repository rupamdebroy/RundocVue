<template>
  <div>
    <Header />
    <WebHeaderNav />

    <section class="py-8 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-blue-700 mb-3">
            Your Health, Simplified in
            <span class="text-green-600">{{ location || "Your Area" }}</span>
          </h1>
          <p class="text-lg text-gray-600 font-semibold mb-6">
            Book your lab tests and diagnostics with ease. No extra charges!
          </p>
        </div>

        <LabInfoBoxes />

        <LabCenterList />
      </div>
    </section>

    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useLocationStore } from "@/stores/location";
import { useRoute } from "vue-router"; // Use useRoute to get initial query location

import Header from "@/components/Header.vue";
import WebHeaderNav from "~/components/WebHeaderNav.vue"; // Added based on template
import LabInfoBoxes from "~/components/LabInfoBoxes.vue"; // Import the new component
import LabCenterList from "~/components/LabCenterList.vue"; // Import the new component
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

const locationStore = useLocationStore();
const route = useRoute(); // To get the location from the URL query initially

const location = ref(""); // This ref is only for display in the hero section

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
