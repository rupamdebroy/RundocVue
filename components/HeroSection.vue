<template>
  <section class="text-center py-16 px-4 bg-gray-50">
    <h2 class="text-green-600 text-xs font-bold uppercase">
      India’s Largest Doctor Appointment Booking Platform
    </h2>
    <h1 class="text-3xl md:text-5xl font-bold text-gray-800 mt-2">
      Search Doctor, Make an Appointment
    </h1>
    <p class="text-gray-600 mt-2">
      Discover the best doctors & clinics in the city nearest you
    </p>

    <div
      class="mt-6 flex flex-col md:flex-row justify-center items-center gap-4"
    >
      <select
        v-model="selectedLocation"
        class="border px-4 py-2 w-full md:w-64 rounded"
      >
        <option value="">Select Location</option>
        <option v-for="location in locations" :key="location" :value="location">
          {{ location }}
        </option>
      </select>

      <select
        v-model="selectedDoctor"
        class="border px-4 py-2 w-full md:w-64 rounded"
        :disabled="doctorsStore.doctors.length === 0"
      >
        <option value="">Select Doctor</option>
        <option
          v-for="doctor in doctorsStore.doctors"
          :key="doctor.id"
          :value="doctor.doc"
        >
          {{ doctor.name }}
        </option>
      </select>

      <button
        @click="handleSearch"
        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Book
      </button>
    </div>

    <p class="text-red-500 mt-4" v-if="doctorsStore.error">
      {{ doctorsStore.error }}
    </p>
    <p class="text-gray-500 mt-4" v-if="doctorsStore.info">
      {{ doctorsStore.info }}
    </p>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDoctorsStore } from "@/stores/doctors";

const router = useRouter();
const doctorsStore = useDoctorsStore();

const locations = ["Dharmanagar", "Kanchanpur", "Kumarghat", "Kailashahar"];
const selectedLocation = ref("");
const selectedDoctor = ref("");

watch(selectedLocation, async (newLocation, oldLocation) => {
  console.log(
    "Watcher triggered - New Location:",
    newLocation,
    "Old Location:",
    oldLocation
  );
  if (!newLocation) {
    console.log("Clearing doctors due to no location selected");
    doctorsStore.clearDoctors();
    selectedDoctor.value = "";
    return;
  }

  if (newLocation !== oldLocation) {
    console.log("Fetching doctors for location:", newLocation);
    await doctorsStore.fetchDoctors(newLocation);
    selectedDoctor.value = ""; // Reset doctor selection when location changes
  } else {
    console.log("Location unchanged, skipping fetch");
  }
});

const handleSearch = () => {
  console.log(
    "handleSearch called - Location:",
    selectedLocation.value,
    "Doctor:",
    selectedDoctor.value
  );
  console.log("Current store state:", {
    location: doctorsStore.selectedLocation,
    doctorsCount: doctorsStore.doctors.length,
  });

  if (!selectedLocation.value || !selectedDoctor.value) {
    console.log("Validation failed: Missing location or doctor");
    doctorsStore.error = "Please select both location and doctor.";
    return;
  }

  doctorsStore.error = "";
  console.log("Navigating to doctor page");
  // Normalize location to lowercase for routing
  router.push(
    `/doctors/${selectedLocation.value.toLowerCase()}/${selectedDoctor.value}`
  );
};
</script>
