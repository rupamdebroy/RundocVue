<template>
  <section class="py-10 px-4 bg-white">
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
      Not Sure Who to See? Start with Your Symptoms
    </h2>
    <div v-if="loading" class="text-center">
      <p>Loading symptoms...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div v-for="symptom in uniqueSymptoms" :key="symptom" class="text-center">
        <div
          class="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center"
        >
          <!-- Placeholder for symptom icon -->
        </div>
        <p class="mt-2 text-sm text-gray-700">{{ symptom }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import symptoms from "~/mock/symptoms.json"; // Import as module from root mock folder

const uniqueSymptoms = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchSymptoms = () => {
  loading.value = true;
  error.value = null;
  try {
    uniqueSymptoms.value = [...new Set(symptoms)].sort();
  } catch (err) {
    console.error("Error processing symptoms:", err);
    error.value = "Failed to process symptoms.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSymptoms);
</script>
