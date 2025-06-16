<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div class="text-center mb-8">
          <h1
            class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-down"
          >
            <i class="fas fa-search-location text-red-600 mr-2"></i>Find Blood
            Doners
          </h1>
          <p
            class="text-base text-gray-700 max-w-xl mx-auto animate-fade-in-up"
          >
            Connect with verified blood doners near you. Use the filters below
            to find a match.
          </p>
        </div>

        <form
          @submit.prevent="searchDoners"
          class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 animate-fade-in-up"
        >
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1"
                >Blood Group</label
              >
              <div class="relative">
                <select
                  v-model="searchCriteria.bloodGroup"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
                >
                  <option value="">All</option>
                  <option
                    v-for="group in bloodGroups"
                    :key="group"
                    :value="group"
                  >
                    {{ group }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1"
                >Country</label
              >
              <div class="relative">
                <select
                  v-model="searchCriteria.country"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
                >
                  <option value="">All</option>
                  <option value="India">India</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1"
                >State</label
              >
              <div class="relative">
                <select
                  v-model="searchCriteria.state"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
                >
                  <option value="">All</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Assam">Assam</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1"
                >District</label
              >
              <div class="relative">
                <select
                  v-model="searchCriteria.district"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
                >
                  <option value="">All</option>
                  <option value="Hooghly">Hooghly</option>
                  <option value="North Tripura">North Tripura</option>
                  <option value="Cachar">Cachar</option>
                  <option value="Unakoti">Unakoti</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-800 mb-1"
                >City</label
              >
              <div class="relative">
                <select
                  v-model="searchCriteria.city"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
                >
                  <option value="">All</option>
                  <option value="Baidyabati">Baidyabati</option>
                  <option value="Dharmanagar">Dharmanagar</option>
                  <option value="Silchar">Silchar</option>
                  <option value="Kadamtala">Kadamtala</option>
                  <option value="Kailashahar">Kailashahar</option>
                  <option value="Kail">Kail</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-200 font-semibold text-base shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center mt-6"
          >
            <i class="fas fa-search mr-2"></i> Search Doners
          </button>
        </form>

        <div
          v-if="filteredDoners.length > 0"
          class="results-section animate-fade-in-up"
        >
          <h2
            class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center"
          >
            <i class="fas fa-hand-holding-medical text-green-600 mr-2"></i
            >Available Doners
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="doner in filteredDoners"
              :key="doner.id"
              class="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              <p class="font-bold text-xl text-red-600 mb-1 flex items-center">
                <i class="fas fa-tint mr-2"></i>{{ doner.bloodGroup }}
              </p>
              <p class="font-semibold text-lg text-gray-900 mb-1">
                {{ doner.name }}
              </p>
              <p class="flex items-center text-gray-700 mb-1 text-sm">
                <i class="fas fa-mobile-alt mr-2 text-gray-500"></i
                >{{ doner.mobile }}
              </p>
              <p class="flex items-center text-gray-700 mb-2 text-sm">
                <i class="fas fa-map-marker-alt mr-2 text-gray-500"></i
                >{{ doner.address }}
              </p>
              <button
                @click="contactDoner(doner.mobile)"
                class="mt-3 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-semibold text-sm"
              >
                <i class="fas fa-phone mr-2"></i> Contact Doner
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-center text-base text-gray-600 p-6 rounded-lg bg-white shadow-md animate-fade-in-up"
        >
          <i class="fas fa-exclamation-circle text-red-500 text-2xl mb-3"></i>
          <p class="font-semibold">No doners found matching your criteria.</p>
          <p class="mt-1 text-sm">Try adjusting your search filters.</p>
        </div>
      </div>
    </section>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { ref, computed, onMounted } from "vue";

// Mock data (replace with actual API fetch in a real application)
const bloodDonersData = ref([
  {
    id: 1,
    name: "Rajesh Kumar",
    bloodGroup: "O+",
    mobile: "9876543210",
    address: "123 MG Road, Baidyabati",
    country: "India",
    state: "West Bengal",
    district: "Hooghly",
    city: "Baidyabati",
  },
  {
    id: 2,
    name: "Priya Sharma",
    bloodGroup: "A-",
    mobile: "9123456789",
    address: "45 Subhas Nagar, Chandannagar",
    country: "India",
    state: "West Bengal",
    district: "Hooghly",
    city: "Chandannagar",
  },
  {
    id: 3,
    name: "Amit Singh",
    bloodGroup: "B+",
    mobile: "9988776655",
    address: "78 Park Street, Kolkata",
    country: "India",
    state: "West Bengal",
    district: "Kolkata",
    city: "Kolkata",
  },
  {
    id: 4,
    name: "Sunita Devi",
    bloodGroup: "AB+",
    mobile: "9765432109",
    address: "10 Main Road, Agartala",
    country: "India",
    state: "Tripura",
    district: "West Tripura",
    city: "Agartala",
  },
  {
    id: 5,
    name: "Arjun Das",
    bloodGroup: "O-",
    mobile: "9654321098",
    address: "56 Lake View, Silchar",
    country: "India",
    state: "Assam",
    district: "Cachar",
    city: "Silchar",
  },
  {
    id: 6,
    name: "Aditi Roy",
    bloodGroup: "A+",
    mobile: "9000011111",
    address: "34 Bidhan Rd, Baidyabati",
    country: "India",
    state: "West Bengal",
    district: "Hooghly",
    city: "Baidyabati",
  },
]);

const searchCriteria = ref({
  bloodGroup: "",
  country: "",
  state: "",
  district: "",
  city: "",
});

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Computed property to filter doners based on search criteria
const filteredDoners = computed(() => {
  return bloodDonersData.value.filter((doner) => {
    const matchesBloodGroup =
      !searchCriteria.value.bloodGroup ||
      doner.bloodGroup === searchCriteria.value.bloodGroup;
    const matchesCountry =
      !searchCriteria.value.country ||
      doner.country === searchCriteria.value.country;
    const matchesState =
      !searchCriteria.value.state || doner.state === searchCriteria.value.state;
    const matchesDistrict =
      !searchCriteria.value.district ||
      doner.district === searchCriteria.value.district;
    const matchesCity =
      !searchCriteria.value.city || doner.city === searchCriteria.value.city;

    return (
      matchesBloodGroup &&
      matchesCountry &&
      matchesState &&
      matchesDistrict &&
      matchesCity
    );
  });
});

// Function to trigger search (computed property handles filtering automatically)
const searchDoners = () => {
  console.log("Searching with criteria:", searchCriteria.value);
  // In a real app, this would trigger an API call to fetch filtered data
};

// Contact doner function
const contactDoner = (mobileNumber) => {
  alert(`Please call the doner at: ${mobileNumber}`);
};

// Set default location on mount
onMounted(() => {
  searchCriteria.value.country = "India";
  searchCriteria.value.state = "West Bengal";
  searchCriteria.value.district = "Hooghly";
  searchCriteria.value.city = "Baidyabati";
});
</script>

<style scoped>
.container {
  max-width: 1152px;
}

/* Custom styles for select arrow */
select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292%22%20height%3D%22292%22%20viewBox%3D%220%200%20292%20292%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.2c-4.1%200-7.9%201.5-10.9%204.5l-14%2014c-6.1%206.1-6.1%2016.9%200%2023l128%20128c6.1%206.1%2016.9%206.1%2023%200l128-128c3.9-3.9%205.9-9.9%205.9-15.5z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.7rem 0.7rem;
}

/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* General styling */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
