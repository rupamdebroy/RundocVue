<template>
  <section class="py-14 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Not Sure Who to See?
        <span class="text-blue-600">Start with Your Symptoms</span>
      </h2>

      <div v-if="loading" class="flex justify-center items-center py-10">
        <p class="text-gray-600 animate-pulse">Loading symptoms...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-8">
        <p>{{ error }}</p>
      </div>

      <div v-else>
        <transition-group
          name="fade"
          tag="div"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
        >
          <div
            v-for="symptom in displayedSymptoms"
            :key="symptom"
            class="cursor-pointer text-center group transition-all duration-200"
          >
            <div
              class="w-16 h-16 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:bg-blue-100 transition"
            >
              <span
                class="text-sm font-medium text-gray-600 group-hover:text-blue-600"
                >🤒</span
              >
            </div>
            <p
              class="mt-3 text-sm text-gray-700 group-hover:text-blue-600 transition"
            >
              {{ symptom }}
            </p>
          </div>
        </transition-group>

        <div
          v-if="uniqueSymptoms.length > 15"
          class="col-span-full text-center mt-6"
        >
          <button
            @click="toggleShowAll"
            class="text-sm text-blue-600 font-semibold hover:underline transition"
          >
            {{ showAll ? "See Less" : "See More" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import symptoms from "~/mock/symptoms.json";

const uniqueSymptoms = ref([]);
const loading = ref(true);
const error = ref(null);
const showAll = ref(false);

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

const displayedSymptoms = computed(() =>
  showAll.value ? uniqueSymptoms.value : uniqueSymptoms.value.slice(0, 15)
);

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

onMounted(fetchSymptoms);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
