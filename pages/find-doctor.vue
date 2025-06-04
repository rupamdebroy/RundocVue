<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Doctors in {{ location }}</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <p>Loading doctors...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="doctorsStore.error" class="text-center text-red-500">
      <p>{{ doctorsStore.error }}</p>
    </div>

    <!-- Specialties data -->
    <div
      v-else-if="uniqueSpecialties.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="specialty in uniqueSpecialties"
        :key="specialty"
        class="flex flex-col items-center cursor-pointer"
        @click="goToDoctorList(specialty)"
      >
        <!-- Circular "pic" with the first letter -->
        <div
          class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold"
        >
          {{ specialty.charAt(0).toUpperCase() }}
        </div>
        <!-- Specialty name below -->
        <p class="mt-2 text-center text-sm font-medium">{{ specialty }}</p>
      </div>
    </div>

    <!-- No specialties found -->
    <div v-else class="text-center">
      <p>No specialties available in this location.</p>
    </div>
  </div>
</template>

<script>
import { useDoctorsStore } from "~/stores/doctors";

export default {
  name: "FindDoctorPage",

  setup() {
    const doctorsStore = useDoctorsStore();
    return { doctorsStore };
  },

  data() {
    return {
      location: "",
      uniqueSpecialties: [],
      loading: false,
    };
  },

  async mounted() {
    // Get the location from the query parameter
    this.location = this.$route.query.location || "";

    if (this.location) {
      await this.fetchDoctors();
    } else {
      this.doctorsStore.error = "Location parameter is required";
    }
  },

  methods: {
    async fetchDoctors() {
      this.loading = true;
      this.uniqueSpecialties = [];

      try {
        // Use the Pinia store's fetchDoctors action
        await this.doctorsStore.fetchDoctors(this.location);

        // Extract specialties from the store's doctors
        if (this.doctorsStore.doctors.length > 0) {
          // Get all specialties
          const specialties = this.doctorsStore.doctors.map(
            (doctor) => doctor.specilities
          );

          // Normalize and deduplicate specialties
          const normalizedSpecialties = specialties.map((s) => {
            if (s.toLowerCase() === "orthapadic") return "Orthopedic";
            return s;
          });

          // Remove duplicates using Set
          this.uniqueSpecialties = [...new Set(normalizedSpecialties)].sort();
        }
      } catch (err) {
        console.error("Error in fetchDoctors:", err);
        this.doctorsStore.error =
          "Failed to fetch doctors. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    goToDoctorList(specialty) {
      // Redirect to doctor-list page with location and specialities query params
      this.$router.push({
        path: "/doctor-list",
        query: {
          location: this.location,
          specialities: specialty,
        },
      });
    },
  },
};
</script>

<style scoped>
.rounded-full {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
