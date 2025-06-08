<template>
  <div>
    <Header />
    <section class="min-h-screen py-8 bg-red-50">
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-red-600">
          Find Blood Donors
        </h1>
        <form
          @submit.prevent="searchDonors"
          class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Blood Group</label
            >
            <select
              v-model="searchCriteria.bloodGroup"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All</option>
              <option v-for="group in bloodGroups" :key="group" :value="group">
                {{ group }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Country</label
            >
            <select
              v-model="searchCriteria.country"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All</option>
              <option value="India">India</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">State</label>
            <select
              v-model="searchCriteria.state"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All</option>
              <option value="Tripura">Tripura</option>
              <option value="Assam">Assam</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >District</label
            >
            <select
              v-model="searchCriteria.district"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All</option>
              <option value="North Tripura">North Tripura</option>
              <option value="Cachar">Cachar</option>
              <option value="Unakoti">Unakoti</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">City</label>
            <select
              v-model="searchCriteria.city"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All</option>
              <option value="Dharmanagar">Dharmanagar</option>
              <option value="Silchar">Silchar</option>
              <option value="Kadamtala">Kadamtala</option>
              <option value="Kailashahar">Kailashahar</option>
              <option value="Kail">Kail</option>
            </select>
          </div>
          <button
            type="submit"
            class="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
          >
            SEARCH
          </button>
        </form>

        <!-- Search Results -->
        <div v-if="filteredDonors.length > 0" class="space-y-4">
          <h2 class="text-xl font-semibold text-red-600 mb-2">
            Search Results
          </h2>
          <div
            v-for="donor in filteredDonors"
            :key="donor.id"
            class="bg-white p-4 rounded-lg shadow-md"
          >
            <p><strong>Name:</strong> {{ donor.name }}</p>
            <p><strong>Blood Group:</strong> {{ donor.bloodGroup }}</p>
            <p><strong>Mobile:</strong> {{ donor.mobile }}</p>
            <p><strong>Address:</strong> {{ donor.address }}</p>
          </div>
        </div>
        <p v-else class="text-center text-red-500">
          No donors found matching your criteria.
        </p>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref, computed, onMounted } from "vue";
import bloodDonorsData from "~/mock/blood-donors.json";

const searchCriteria = ref({
  bloodGroup: "",
  country: "",
  state: "",
  district: "",
  city: "",
});

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const filteredDonors = computed(() => {
  return bloodDonorsData.filter((donor) => {
    return (
      (!searchCriteria.value.bloodGroup ||
        donor.bloodGroup === searchCriteria.value.bloodGroup) &&
      (!searchCriteria.value.country ||
        donor.country === searchCriteria.value.country) &&
      (!searchCriteria.value.state ||
        donor.state === searchCriteria.value.state) &&
      (!searchCriteria.value.district ||
        donor.district === searchCriteria.value.district) &&
      (!searchCriteria.value.city || donor.city === searchCriteria.value.city)
    );
  });
});

const searchDonors = () => {
  // Trigger refetch or just let computed handle it
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
