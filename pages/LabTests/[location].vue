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
import { ref, onMounted, watch } from "vue";
import { useLocationStore } from "@/stores/location";
import { useRoute } from "vue-router";

import Header from "@/components/Header.vue";
import WebHeaderNav from "~/components/WebHeaderNav.vue";
import LabInfoBoxes from "~/components/LabInfoBoxes.vue";
import LabCenterList from "~/components/LabCenterList.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

const locationStore = useLocationStore();
const route = useRoute();

const location = ref("");

// Set location from route param and update store if needed
const setLocationFromRoute = () => {
  const paramLocation =
    route.params.location || locationStore.currentLocation || "Your Area";
  if (paramLocation && paramLocation !== locationStore.currentLocation) {
    locationStore.setLocation(paramLocation);
  }
  location.value = paramLocation;
};

onMounted(async () => {
  await locationStore.restoreLocation();
  setLocationFromRoute();
});

// Watch for route changes (if user navigates to a different location param)
watch(() => route.params.location, setLocationFromRoute);
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
