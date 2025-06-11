<template>
  <section class="py-10 px-4">
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
      Find a Doctor by Speciality in {{ locationStore.currentLocation }}
    </h2>
    <div v-if="loading" class="text-center">
      <p>Loading specialties...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
      <div
        v-for="speciality in uniqueSpecialties"
        :key="speciality"
        class="text-center cursor-pointer"
        @click="goToDoctorList(speciality)"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLocationStore } from "@/stores/location";
import { useDoctorsStore } from "~/stores/doctors";

const router = useRouter();
const locationStore = useLocationStore();
const doctorsStore = useDoctorsStore();
const uniqueSpecialties = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchSpecialties = async () => {
  loading.value = true;
  error.value = null;
  try {
    await doctorsStore.fetchDoctors(locationStore.currentLocation);
    if (doctorsStore.doctors.length > 0) {
      const specialties = doctorsStore.doctors.map(
        (doctor) => doctor.specilities
      );
      const normalizedSpecialties = specialties.map((s) => {
        if (s.toLowerCase() === "orthapadic") return "Orthopedic";
        return s;
      });
      uniqueSpecialties.value = [...new Set(normalizedSpecialties)].sort();
    }
  } catch (err) {
    console.error("Error fetching specialties:", err);
    error.value = "Failed to fetch specialties.";
  } finally {
    loading.value = false;
  }
};

const goToDoctorList = (speciality) => {
  router.push({
    path: "/doctor-list", // Changed from /find-doctor to /doctor-list
    query: {
      location: locationStore.currentLocation,
      specialities: speciality, // Kept as is
    },
  });
};

onMounted(fetchSpecialties);
</script>
