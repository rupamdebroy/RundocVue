<template>
  <section class="py-10 px-4">
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
      Find a Doctor by Speciality in {{ locationStore.currentLocation }}
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div
        v-for="speciality in specialities"
        :key="speciality"
        class="text-center"
      >
        <div
          class="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center"
        >
          <!-- Placeholder for speciality icon -->
        </div>
        <p class="mt-2 text-sm text-gray-700">{{ speciality }}</p>
      </div>
      <NuxtLink to="/find-doctor" class="text-center">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
        >
          See More
        </div>
        <p class="mt-2 text-sm text-gray-700">See More</p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();

const specialities = [
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic",
  "Gynecologist",
  "ENT Specialist",
  "Urologist",
  "Dentist",
];
</script>
