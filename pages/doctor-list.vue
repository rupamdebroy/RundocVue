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

    <!-- Doctors data -->
    <div v-else>
      <!-- Dropdown for specialties -->
      <div class="mb-6">
        <label for="specialty-select" class="block text-lg font-medium mb-2"
          >Select Specialty:</label
        >
        <select
          id="specialty-select"
          v-model="selectedSpecialty"
          class="border rounded-lg p-2 w-full max-w-xs"
          @change="updateSpecialty"
        >
          <option
            v-for="specialty in uniqueSpecialties"
            :key="specialty"
            :value="specialty"
          >
            {{ specialty }}
          </option>
        </select>
      </div>

      <!-- "All" filter -->
      <div class="mb-6">
        <button
          class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium"
          :class="
            isAllSelected
              ? 'border-blue-500 text-blue-500'
              : 'border-gray-300 text-gray-500'
          "
          @click="toggleAllFilter"
        >
          All
        </button>
      </div>

      <!-- Doctor list -->
      <div v-if="filteredDoctors.length > 0" class="space-y-4">
        <div
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="flex items-center p-4 border rounded-lg shadow-sm"
        >
          <!-- Circular "image" with first letter -->
          <div
            class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold mr-4"
          >
            {{ doctor.name.charAt(0).toUpperCase() }}
          </div>
          <!-- Doctor details -->
          <div class="flex-1">
            <p class="text-lg font-semibold">{{ doctor.name }}</p>
            <p class="text-sm text-gray-600">{{ doctor.name }}</p>
            <p class="text-sm">Specialty: {{ doctor.specilities }}</p>
            <p class="text-sm">Experience: {{ doctor.experience }} years</p>
          </div>
          <!-- View button -->
          <button
            class="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
            @click="viewDoctor(doctor.doc)"
          >
            View
          </button>
        </div>
      </div>

      <!-- No doctors found -->
      <div v-else class="text-center">
        <p>No doctors found for this specialty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useDoctorsStore } from "~/stores/doctors";

export default {
  name: "DoctorListPage",

  setup() {
    const doctorsStore = useDoctorsStore();
    return { doctorsStore };
  },

  data() {
    return {
      location: "",
      selectedSpecialty: "",
      uniqueSpecialties: [],
      isAllSelected: false,
      loading: false,
    };
  },

  computed: {
    filteredDoctors() {
      if (this.isAllSelected) {
        return this.doctorsStore.doctors;
      }
      return this.doctorsStore.doctors.filter(
        (doctor) => doctor.specilities === this.selectedSpecialty
      );
    },
  },

  async mounted() {
    // Get query parameters
    this.location = this.$route.query.location || "";
    this.selectedSpecialty = this.$route.query.specialities || "";
    this.isAllSelected = this.$route.query.specialities === "all";

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
        // Fetch doctors using the Pinia store
        await this.doctorsStore.fetchDoctors(this.location);

        // Extract specialties
        if (this.doctorsStore.doctors.length > 0) {
          const specialties = this.doctorsStore.doctors.map(
            (doctor) => doctor.specilities
          );
          const normalizedSpecialties = specialties.map((s) => {
            if (s.toLowerCase() === "orthapadic") return "Orthopedic";
            return s;
          });
          this.uniqueSpecialties = [...new Set(normalizedSpecialties)].sort();

          // If the selected specialty from URL isn't in the list, reset it
          if (
            this.selectedSpecialty &&
            !this.uniqueSpecialties.includes(this.selectedSpecialty)
          ) {
            this.selectedSpecialty = "";
            this.updateSpecialty();
          }
        }
      } catch (err) {
        console.error("Error in fetchDoctors:", err);
        this.doctorsStore.error =
          "Failed to fetch doctors. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    updateSpecialty() {
      // Update URL with the new specialty
      this.isAllSelected = false;
      this.$router.push({
        path: "/doctor-list",
        query: {
          location: this.location,
          specialities: this.selectedSpecialty,
        },
      });
    },

    toggleAllFilter() {
      this.isAllSelected = !this.isAllSelected;
      this.$router.push({
        path: "/doctor-list",
        query: {
          location: this.location,
          specialities: this.isAllSelected ? "all" : this.selectedSpecialty,
        },
      });
    },

    viewDoctor(docSlug) {
      // Redirect to the doctor's profile page
      this.$router.push(`/doctor/${docSlug}`);
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
