<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Ambulance ID = {{ ambulanceId }}</p>
          <p>Debug: Provider = {{ provider ? provider.name : "Not Found" }}</p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Book Ambulance Form -->
        <div>
          <h1 class="text-2xl font-bold mb-4 text-center">Book Ambulance</h1>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading form...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Form -->
          <div v-else-if="provider" class="max-w-2xl mx-auto">
            <form @submit.prevent="submitBooking" class="space-y-4">
              <!-- Ambulance Provider -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Ambulance Provider</label
                >
                <select
                  v-model="form.providerId"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 focus:ring-red-500 focus:border-red-500"
                  disabled
                >
                  <option :value="provider.id">{{ provider.name }}</option>
                </select>
              </div>

              <!-- Patient Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Patient Name</label
                >
                <select
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="" disabled>Select a patient</option>
                  <option
                    v-for="patient in patients"
                    :key="patient.id"
                    :value="patient.name"
                  >
                    {{ patient.name }}
                  </option>
                </select>
              </div>

              <!-- Gender -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Gender</label
                >
                <input
                  v-model="form.gender"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                  readonly
                />
              </div>

              <!-- Age -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Age</label
                >
                <input
                  v-model="form.age"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <!-- Pickup Address (Prefilled) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Pickup Address</label
                >
                <input
                  v-model="form.pickupAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                  readonly
                />
                <button
                  @click="showAddAddress = true"
                  type="button"
                  class="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add Address
                </button>
              </div>

              <!-- Add Address (Conditional) -->
              <div
                v-if="showAddAddress"
                class="mt-4 p-4 border rounded-lg bg-gray-50"
              >
                <label class="block text-sm font-medium text-gray-700"
                  >New Pickup Address</label
                >
                <input
                  v-model="form.newPickupAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter new address"
                />
              </div>

              <!-- Destination Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Destination Address</label
                >
                <input
                  v-model="form.destinationAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <!-- Note -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Note</label
                >
                <textarea
                  v-model="form.note"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
              >
                Submit
              </button>
            </form>
          </div>

          <!-- Fallback -->
          <div v-else class="text-center text-red-500">
            <p>Ambulance provider not found. Please try again.</p>
          </div>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAmbulanceStore } from "@/stores/ambulance";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const ambulanceStore = useAmbulanceStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const ambulanceId = ref(route.query.ambulanceID);
const provider = ref(null);
const loading = ref(false);
const error = ref("");
const debugMode = ref(true);
const showAddAddress = ref(false);

// Form data
const form = ref({
  providerId: null,
  patientName: "",
  gender: "",
  age: "",
  pickupAddress: "",
  newPickupAddress: "",
  destinationAddress: "",
  note: "",
});

// Simulated patient data
const patients = ref([
  {
    id: 1,
    name: "John Doe",
    gender: "Male",
    address: "123 Main St, Dharmanager",
  },
  {
    id: 2,
    name: "Jane Smith",
    gender: "Female",
    address: "456 Side St, Dharmanager",
  },
]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  await locationStore.restoreLocation();
  const location = locationStore.currentLocation;

  if (!location || location === "Select Location") {
    error.value = "Please select a location.";
    router.push("/");
    return;
  }

  if (
    !ambulanceStore.providers.length ||
    ambulanceStore.selectedLocation !== location
  ) {
    await ambulanceStore.fetchProviders(location);
  }

  provider.value = ambulanceStore.providers.find(
    (p) => p.id === parseInt(ambulanceId.value)
  );
  if (!provider.value) {
    error.value = "Ambulance provider not found.";
  } else {
    if (authStore.isAuthenticated) {
      form.value.pickupAddress =
        authStore.userInfo.address?.street || patients.value[0].address;
    } else {
      form.value.pickupAddress = patients.value[0].address;
    }
  }

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
});

watch(
  () => route.query.ambulanceID,
  async (newId) => {
    ambulanceId.value = newId;
    await fetchData();
  }
);

watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    if (selectedPatient) {
      form.value.gender = selectedPatient.gender;
      form.value.pickupAddress = selectedPatient.address;
    }
  }
);

const submitBooking = () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to book an ambulance.");
    router.push("/auth");
    return;
  }

  const orderId = `AMB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log("Ambulance booking submitted:", {
    orderId,
    provider: provider.value.name,
    patientName: form.value.patientName,
    gender: form.value.gender,
    age: form.value.age,
    pickupAddress: form.value.newPickupAddress || form.value.pickupAddress,
    destinationAddress: form.value.destinationAddress,
    note: form.value.note,
    userId: authStore.userInfo.sessionId,
  });

  alert(`Ambulance booked successfully! Order ID: ${orderId}`);
  router.push("/find-ambulance?location=Dharmanager");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
