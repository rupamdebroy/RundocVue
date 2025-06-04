<template>
  <section class="py-10 px-4 bg-white">
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
      Not Sure Who to See? Start with Your Symptoms
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div v-for="symptom in symptoms" :key="symptom" class="text-center">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center"
        >
          <!-- Placeholder for symptom icon -->
        </div>
        <p class="mt-2 text-sm text-gray-700">{{ symptom }}</p>
      </div>
      <div class="text-center">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
        >
          See More
        </div>
        <p class="mt-2 text-sm text-gray-700">See More</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const symptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Stomach Pain",
  "Back Pain",
  "Skin Rash",
  "Sore Throat",
  "Fatigue",
  "Chest Pain",
];
</script>
