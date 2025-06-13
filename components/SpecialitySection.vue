<template>
  <section class="py-14 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Explore Specialties in
        <span class="text-blue-600">{{ locationStore.currentLocation }}</span>
      </h2>

      <div v-if="loading" class="flex justify-center items-center py-10">
        <p class="text-gray-600 animate-pulse">Loading specialties...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-8">
        <p>{{ error }}</p>
      </div>

      <div v-else>
        <!-- Grid with animated transitions -->
        <transition-group
          name="fade"
          tag="div"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6"
        >
          <div
            v-for="speciality in displayedSpecialties"
            :key="speciality"
            @click="goToDoctorList(speciality)"
            class="cursor-pointer text-center group transition-all duration-200"
          >
            <div
              class="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-blue-100 transition"
            >
              <span
                class="text-sm font-medium text-gray-600 group-hover:text-blue-600"
                >🔍</span
              >
            </div>
            <p
              class="mt-3 text-sm text-gray-700 group-hover:text-blue-600 transition"
            >
              {{ speciality }}
            </p>
          </div>
        </transition-group>

        <!-- See More / See Less -->
        <div
          v-if="uniqueSpecialties.length > 15"
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
import { useRouter } from "vue-router";
import { useLocationStore } from "@/stores/location";
import { useDoctorsStore } from "~/stores/doctors";

const router = useRouter();
const locationStore = useLocationStore();
const doctorsStore = useDoctorsStore();

const uniqueSpecialties = ref([]);
const loading = ref(true);
const error = ref(null);
const showAll = ref(false);

const fetchSpecialties = async () => {
  loading.value = true;
  error.value = null;

  try {
    await doctorsStore.fetchDoctors(locationStore.currentLocation);
    const specialties = doctorsStore.doctors.map((d) => d.specilities);

    const cleaned = specialties.map((s) => {
      if (s.toLowerCase() === "orthapadic") return "Orthopedic";
      return s;
    });

    uniqueSpecialties.value = [...new Set(cleaned)].sort();
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch specialties. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const displayedSpecialties = computed(() =>
  showAll.value ? uniqueSpecialties.value : uniqueSpecialties.value.slice(0, 15)
);

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const goToDoctorList = (speciality) => {
  router.push({
    path: "/doctor-list",
    query: {
      location: locationStore.currentLocation,
      specialities: speciality,
    },
  });
};

onMounted(fetchSpecialties);
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
