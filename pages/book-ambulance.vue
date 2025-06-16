<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-if="debugMode"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md"
        >
          <p class="text-sm text-yellow-700">
            Debug: Location = {{ locationStore.currentLocation }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Ambulance ID = {{ ambulanceId }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Provider = {{ provider ? provider.name : "Not Found" }}
          </p>
          <p class="text-sm text-yellow-700">Error = {{ error || "None" }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
            Book <span class="text-red-600">Ambulance</span> Service
          </h1>

          <p class="text-center text-green-600 font-medium mb-6 animate-pulse">
            Urgent Care – Available 24/7!
          </p>

          <div class="bg-red-600 text-white text-center py-3 px-4 mb-8">
            <p class="text-sm sm:text-base font-medium normal-case">
              Rundoc only facilitates bookings with registered Ambulance
              Providers. Rundoc does not operate any ambulance service of its
              own.
            </p>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"
            ></div>
            <p class="text-gray-600 mt-2">Loading form...</p>
          </div>

          <div
            v-else-if="error"
            class="text-center bg-red-100 text-red-600 p-4 rounded-lg"
          >
            <p>{{ error }}</p>
          </div>

          <div
            v-else-if="provider"
            class="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              Ambulance Provider: {{ provider.name }}
            </h2>

            <form @submit.prevent="submitBooking" class="space-y-6">
              <div>
                <label
                  for="provider"
                  class="block text-sm font-medium text-gray-700"
                  >Ambulance Provider</label
                >
                <select
                  id="provider"
                  v-model="form.providerId"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                  disabled
                >
                  <option :value="provider.id">{{ provider.name }}</option>
                </select>
              </div>

              <div>
                <label
                  for="patientName"
                  class="block text-sm font-medium text-gray-700"
                  >Patient Name</label
                >
                <select
                  id="patientName"
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
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

              <div>
                <label
                  for="gender"
                  class="block text-sm font-medium text-gray-700"
                  >Gender</label
                >
                <input
                  id="gender"
                  v-model="form.gender"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                  readonly
                />
              </div>

              <div>
                <label for="age" class="block text-sm font-medium text-gray-700"
                  >Age</label
                >
                <input
                  id="age"
                  v-model="form.age"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  required
                />
              </div>

              <div>
                <label
                  for="pickupAddress"
                  class="block text-sm font-medium text-gray-700"
                  >Pickup Address</label
                >
                <input
                  id="pickupAddress"
                  v-model="form.pickupAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                  readonly
                />
                <button
                  @click="showAddAddress = true"
                  type="button"
                  class="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-all"
                >
                  Add A Different Pickup Address
                </button>
              </div>

              <div
                v-if="showAddAddress"
                class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4"
              >
                <label
                  for="newPickupAddress"
                  class="block text-sm font-medium text-gray-700"
                  >New Pickup Address</label
                >
                <input
                  id="newPickupAddress"
                  v-model="form.newPickupAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Enter new address"
                />
              </div>

              <div>
                <label
                  for="destinationAddress"
                  class="block text-sm font-medium text-gray-700"
                  >Destination Address</label
                >
                <input
                  id="destinationAddress"
                  v-model="form.destinationAddress"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  required
                />
              </div>

              <div>
                <label
                  for="note"
                  class="block text-sm font-medium text-gray-700"
                  >Note</label
                >
                <textarea
                  id="note"
                  v-model="form.note"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  rows="3"
                  placeholder="Add any additional notes for the ambulance driver..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                Book Ambulance
              </button>
            </form>
          </div>

          <div
            v-else
            class="text-center bg-red-100 text-red-600 p-4 rounded-lg"
          >
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
import { ref, watch, onMounted } from "vue";
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
const debugMode = ref(false); // Changed to false for production consistency
const showAddAddress = ref(false);

// Form data
const form = ref({
  providerId: null,
  patientName: "",
  gender: "",
  age: "",
  pickupAddress: "", // Pre-filled from patient or user info
  newPickupAddress: "", // For manually entered address
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

  console.log("Fetching data for route:", route.query);

  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  const location = locationStore.currentLocation;
  console.log("Location for Ambulance Booking Page:", location);

  if (!location || location === "Select Location") {
    error.value = "Please select a location.";
    console.log("Error: No location selected");
    router.push("/");
    return;
  }

  if (
    !ambulanceStore.providers.length ||
    ambulanceStore.selectedLocation !== location
  ) {
    console.log("Fetching ambulance providers for location:", location);
    await ambulanceStore.fetchProviders(location);
    console.log("Providers fetched:", ambulanceStore.providers.length);
  }

  provider.value = ambulanceStore.providers.find(
    (p) => p.id === parseInt(ambulanceId.value)
  );
  console.log("Ambulance provider found:", provider.value);

  if (!provider.value) {
    error.value = "Ambulance provider not found.";
    console.log("Error: Ambulance provider not found");
  } else {
    // Pre-fill provider ID
    form.value.providerId = provider.value.id;

    // Pre-fill pickup address based on authenticated user or first simulated patient
    if (authStore.isAuthenticated) {
      form.value.pickupAddress = authStore.userInfo.address?.street || "";
    }
    // If no authenticated user address or it's empty, use the first simulated patient's address as a fallback
    if (!form.value.pickupAddress && patients.value.length > 0) {
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

// Watch for patient selection to pre-fill gender and pickup address
watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    if (selectedPatient) {
      form.value.gender = selectedPatient.gender;
      // Only update pickupAddress if "Add A Different Pickup Address" is not active
      if (!showAddAddress.value) {
        form.value.pickupAddress = selectedPatient.address;
      }
    } else {
      form.value.gender = "";
      // Reset pickupAddress if no patient selected, and "Add A Different Pickup Address" is not active
      if (!showAddAddress.value) {
        form.value.pickupAddress = "";
      }
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

  const finalPickupAddress = showAddAddress.value
    ? form.value.newPickupAddress
    : form.value.pickupAddress;

  if (!finalPickupAddress) {
    alert("Please provide a pickup address.");
    return;
  }

  const orderId = `AMB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log("Ambulance booking submitted:", {
    orderId,
    provider: provider.value.name,
    patientName: form.value.patientName,
    gender: form.value.gender,
    age: form.value.age,
    pickupAddress: finalPickupAddress,
    destinationAddress: form.value.destinationAddress,
    note: form.value.note,
    userId: authStore.userInfo.sessionId,
  });

  alert(`Ambulance booked successfully! Order ID: ${orderId}`);
  // Redirect to the ambulance listing page after submission
  // Assuming 'Dharmanager' is the current city/location context for ambulance listing
  router.push("/find-ambulance?location=Dharmanager");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Ensure smooth transitions for interactive elements */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Custom focus ring for accessibility */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); /* Red focus ring */
}

/* Ensure modal is scrollable on small screens (if applicable, though no modal here) */
@media (max-height: 600px) {
  .max-h-96 {
    max-height: 60vh;
  }
}

/* Disabled input styling */
input:disabled,
select:disabled {
  background-color: #f3f4f6;
  opacity: 0.7;
}
</style>
