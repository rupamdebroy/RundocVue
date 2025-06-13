<template>
  <Header />

  <!-- Banner -->
  <section class="bg-gradient-to-r from-blue-50 to-white py-10 text-center">
    <h1 class="text-4xl font-bold text-gray-800">
      Find the Right <span class="text-blue-600">Doctor</span> for You
    </h1>
    <p class="mt-2 text-gray-600">
      Choose by Specialty or Symptoms in
      <span class="font-medium">{{ location }}</span>
    </p>
  </section>

  <!-- Horizontal Banner Below Main Banner -->
  <div class="bg-blue-600 text-white text-center py-3 px-4">
    <p class="text-sm sm:text-base font-medium">
      500+ Verified Doctors | 100+ Specialties | Trusted by Thousands
    </p>
  </div>

  <!-- Specialties Section -->
  <section class="py-14 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Explore Specialties in <span class="text-blue-600">{{ location }}</span>
      </h2>

      <div v-if="loading" class="flex justify-center items-center py-10">
        <p class="text-gray-600 animate-pulse">Loading specialties...</p>
      </div>

      <div v-else-if="doctorsStore.error" class="text-center text-red-600 py-8">
        <p>{{ doctorsStore.error }}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <div
          v-for="specialty in uniqueSpecialties"
          :key="specialty"
          @click="goToDoctorList(specialty)"
          class="cursor-pointer text-center group transition-all duration-200"
        >
          <div
            class="w-16 h-16 mx-auto rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-blue-100 transition"
          >
            <span
              class="text-sm font-medium text-gray-600 group-hover:text-blue-600"
            >
              {{ specialty.charAt(0).toUpperCase() }}
            </span>
          </div>
          <p
            class="mt-3 text-sm text-gray-700 group-hover:text-blue-600 transition"
          >
            {{ specialty }}
          </p>
        </div>
      </div>

      <div
        v-if="!loading && uniqueSpecialties.length === 0"
        class="text-center mt-6"
      >
        <p class="text-gray-500">No specialties available in this location.</p>
      </div>
    </div>
  </section>

  <!-- Symptoms Section -->
  <section class="py-14 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Not Sure Who to See?
        <span class="text-blue-600">Start with Your Symptoms</span>
      </h2>

      <div
        v-if="symptomsLoading"
        class="flex justify-center items-center py-10"
      >
        <p class="text-gray-600 animate-pulse">Loading symptoms...</p>
      </div>

      <div v-else-if="symptomsError" class="text-center text-red-600 py-8">
        <p>{{ symptomsError }}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        <div
          v-for="symptom in uniqueSymptoms"
          :key="symptom"
          @click="goToDoctorListBySymptom(symptom)"
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
      </div>

      <div
        v-if="!symptomsLoading && uniqueSymptoms.length === 0"
        class="text-center mt-6"
      >
        <p class="text-gray-500">No symptoms available for this location.</p>
      </div>
    </div>
  </section>

  <Footer />
  <BottomNav />
</template>

<script>
import { useDoctorsStore } from "~/stores/doctors";
import { useRouter } from "vue-router";
import symptoms from "~/mock/symptoms.json";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";

export default {
  name: "FindDoctorPage",

  setup() {
    const doctorsStore = useDoctorsStore();
    return { doctorsStore, $router: useRouter() };
  },

  data() {
    return {
      location: "",
      uniqueSpecialties: [],
      loading: false,
      uniqueSymptoms: [],
      symptomsLoading: false,
      symptomsError: null,
    };
  },

  async mounted() {
    this.location = this.$route.query.location || "";
    if (this.location) {
      await Promise.all([this.fetchDoctors(), this.fetchSymptoms()]);
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
        }
      } catch (err) {
        console.error("Error in fetchDoctors:", err);
        this.doctorsStore.error =
          "Failed to fetch doctors. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    fetchSymptoms() {
      this.symptomsLoading = true;
      this.symptomsError = null;
      try {
        this.uniqueSymptoms = [...new Set(symptoms)].sort();
      } catch (err) {
        console.error("Error processing symptoms:", err);
        this.symptomsError = "Failed to process symptoms.";
      } finally {
        this.symptomsLoading = false;
      }
    },

    goToDoctorList(specialty) {
      this.$router.push({
        path: "/doctor-list",
        query: { location: this.location, specialities: specialty },
      });
    },

    goToDoctorListBySymptom(symptom) {
      this.$router.push({
        path: "/doctor-list",
        query: { location: this.location, symptom },
      });
    },
  },
};
</script>

<style scoped>
/* Smooth center-align inside circle */
.rounded-full {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
