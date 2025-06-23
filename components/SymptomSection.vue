<template>
  <section class="py-12 sm:py-16 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 animate-fade-in-down"
      >
        Not Sure Who to See?
        <span class="text-blue-600">Start with Your Symptoms</span>
      </h2>

      <div v-if="loading" class="flex justify-center items-center py-8">
        <p class="text-base text-gray-600 animate-pulse flex items-center">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading symptoms...
        </p>
      </div>

      <div
        v-else-if="error"
        class="text-center text-base text-red-600 py-6 font-semibold"
      >
        <p><i class="fas fa-exclamation-triangle mr-2"></i> {{ error }}</p>
      </div>

      <div v-else>
        <transition-group
          name="fade"
          tag="div"
          class="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 animate-fade-in-up delay-200"
        >
          <div
            v-for="symptom in displayedSymptoms"
            :key="symptom"
            class="cursor-pointer text-center group transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-16 h-16 mx-auto rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-md group-hover:shadow-lg"
            >
              <i
                :class="getSymptomIcon(symptom)"
                class="text-2xl transition-all duration-300 group-hover:text-white"
              ></i>
            </div>
            <p
              class="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ symptom }}
            </p>
          </div>
        </transition-group>

        <div
          v-if="uniqueSymptoms.length > 15"
          class="col-span-full text-center mt-8"
        >
          <button
            @click="toggleShowAll"
            class="text-sm text-blue-600 font-semibold hover:underline transition-all duration-200 flex items-center justify-center mx-auto"
          >
            {{ showAll ? "See Less" : "See More" }}
            <i
              :class="showAll ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
              class="ml-2"
            ></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import symptoms from "~/mock/symptoms.json"; // Ensure this path is correct

const uniqueSymptoms = ref([]);
const loading = ref(true);
const error = ref(null);
const showAll = ref(false);

const fetchSymptoms = () => {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    uniqueSymptoms.value = [...new Set(symptoms)].sort();
  } catch (err) {
    console.error("Error processing symptoms:", err);
    error.value = "Failed to process symptoms. Please try again later.";
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

// Helper to get Font Awesome icon for symptoms (add more as needed)
const getSymptomIcon = (symptom) => {
  const lowerSymptom = symptom.toLowerCase();
  if (lowerSymptom.includes("fever"))
    return "fas fa-thermometer-half text-red-500";
  if (lowerSymptom.includes("cough")) return "fas fa-lungs text-orange-500";
  if (lowerSymptom.includes("headache"))
    return "fas fa-head-side-mask text-purple-500";
  if (lowerSymptom.includes("stomach")) return "fas fa-stomach text-green-500";
  if (lowerSymptom.includes("pain"))
    return "fas fa-hand-holding-medical text-yellow-600";
  if (lowerSymptom.includes("cold")) return "fas fa-snowflake text-blue-500";
  if (lowerSymptom.includes("rash")) return "fas fa-allergies text-pink-500";
  if (lowerSymptom.includes("dizziness")) return "fas fa-dizzy text-indigo-500";
  if (lowerSymptom.includes("fatigue")) return "fas fa-bed text-gray-500";
  if (lowerSymptom.includes("sore throat"))
    return "fas fa-comment-medical text-cyan-600";

  return "fas fa-question-circle text-gray-600"; // Default icon
};

onMounted(fetchSymptoms);
</script>

<style scoped>
/* Animations for transition-group */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* Base animations (reused from other components) */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}
</style>
