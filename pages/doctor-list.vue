<template>
  <Header />

  <div class="container max-w-7xl mx-auto p-4 min-h-screen flex flex-col">
    <h2 class="text-center text-3xl font-semibold text-gray-800 mb-4 py-6">
      Doctors in
      <span class="text-blue-600">{{ location }}</span>
    </h2>

    <!-- Horizontal Banner (Now Below Search) -->
    <div
      class="w-full bg-gray-200 rounded-xl shadow-md h-36 flex items-center justify-center mb-10"
    >
      <span class="text-base text-gray-700 font-medium"
        >Horizontal Ad Banner</span
      >
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <p class="text-gray-500">Loading doctors...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="doctorsStore.error" class="text-center text-red-600 py-4">
      <p>{{ doctorsStore.error }}</p>
    </div>

    <!-- Doctor Filter & List -->
    <div v-else>
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div class="mx-auto w-full sm:max-w-xs relative z-10">
          <label
            for="specialty-select"
            class="block text-base font-medium text-gray-700 mb-2"
          >
            Select Specialty:
          </label>
          <select
            id="specialty-select"
            v-model="selectedSpecialty"
            class="border border-gray-300 rounded-xl px-4 py-2 w-52 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700"
            @change="updateSpecialty"
          >
            <option disabled value="">-- Select Specialty --</option>
            <option
              v-for="specialty in uniqueSpecialties"
              :key="specialty"
              :value="specialty"
            >
              {{ specialty }}
            </option>
          </select>
        </div>

        <div class="flex flex-col justify-end">
          <label class="text-base font-medium text-gray-700 mb-2"
            >Filter:</label
          >
          <div class="flex space-x-4 items-center">
            <button
              class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors duration-300"
              :class="
                isAllSelected
                  ? 'border-blue-600 text-blue-600 bg-blue-100'
                  : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500'
              "
              @click="toggleAllFilter"
            >
              All
            </button>
            <label
              class="flex items-center space-x-2 text-gray-400 cursor-not-allowed"
            >
              <input type="radio" disabled class="accent-blue-500" />
              <span>Today</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Doctor list -->
      <div
        v-if="filteredDoctors.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <div
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="flex flex-col justify-between p-4 border rounded-xl shadow-md bg-white hover:shadow-lg transition-all"
        >
          <!-- Top row: Avatar + Info inline -->
          <div class="flex items-center space-x-6 mb-2">
            <div
              class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            >
              {{ doctor.name.charAt(0).toUpperCase() }}
            </div>

            <div class="flex-1 space-y-1">
              <p class="text-lg font-semibold text-gray-900 mb-2">
                {{ doctor.name }}
              </p>
              <p class="text-sm text-gray-700">
                Specialty:
                <span class="font-medium">{{ doctor.specilities }}</span>
              </p>
              <p class="text-sm text-gray-700">Degree: {{ doctor.degree }}</p>
              <p class="text-sm text-gray-700">
                Experience: {{ doctor.experience }} years
              </p>
            </div>
          </div>

          <!-- View button full width -->
          <button
            class="mt-4 w-full bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-all flex items-center justify-between"
            @click="viewDoctor(doctor.doc)"
          >
            <span>View Doctor</span>
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-8">
        <p class="text-gray-500">No doctors found for this specialty.</p>
      </div>
    </div>
  </div>

  <Footer />
  <BottomNav />
</template>

<script>
import { useDoctorsStore } from "~/stores/doctors";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

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
      if (this.isAllSelected) return this.doctorsStore.doctors;
      return this.doctorsStore.doctors.filter(
        (doctor) => doctor.specilities === this.selectedSpecialty
      );
    },
  },

  async mounted() {
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
        await this.doctorsStore.fetchDoctors(this.location);

        if (this.doctorsStore.doctors.length > 0) {
          const specialties = this.doctorsStore.doctors.map(
            (d) => d.specilities
          );
          const normalized = specialties.map((s) =>
            s.toLowerCase() === "orthapadic" ? "Orthopedic" : s
          );
          this.uniqueSpecialties = [...new Set(normalized)].sort();

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
      this.$router.push(`/doctor/${docSlug}`);
    },
  },
};
</script>

<style scoped>
/* select {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */

.rounded-full {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 640px) {
  select {
    font-size: 16px; /* prevents iOS zoom on tap */
  }
}
</style>
