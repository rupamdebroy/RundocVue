<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Pharmacy ID = {{ pharmacyId }}</p>
          <p>Debug: Pharmacy = {{ pharmacy ? pharmacy.name : "Not Found" }}</p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Order Medicine Page -->
        <div>
          <h1 class="text-2xl font-bold mb-4 text-center">
            Place Your Medicine Order
          </h1>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading order form...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Order Form -->
          <div v-else-if="pharmacy" class="max-w-2xl mx-auto">
            <!-- Pharmacy Name -->
            <h2 class="text-xl font-semibold mb-2">{{ pharmacy.name }}</h2>

            <!-- Form -->
            <form @submit.prevent="submitOrder" class="space-y-4">
              <!-- Patient Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Patient Name</label
                >
                <select
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Email Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Email Address</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Phone Number</label
                >
                <input
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Delivery Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Delivery Address</label
                >
                <input
                  v-model="form.deliveryAddress.street"
                  type="text"
                  placeholder="Street Address"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- State/Province -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >State/Province</label
                  >
                  <input
                    v-model="form.deliveryAddress.state"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <!-- City (Disabled, pre-filled) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >City</label
                  >
                  <input
                    :value="locationStore.currentLocation"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                    disabled
                  />
                </div>

                <!-- ZIP/Postal Code -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ZIP/Postal Code</label
                  >
                  <input
                    v-model="form.deliveryAddress.zip"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <!-- Upload Prescription -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Upload Prescription</label
                >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  @change="handlePrescriptionUpload"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <p v-if="form.prescription" class="text-sm text-gray-600">
                  Uploaded: {{ form.prescription.name }}
                </p>
              </div>

              <!-- Medicine Fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Medicines</label
                >
                <div
                  v-for="(medicine, index) in form.medicines"
                  :key="index"
                  class="flex items-center gap-4 mt-2"
                >
                  <input
                    v-model="medicine.name"
                    type="text"
                    placeholder="Medicine Name"
                    class="block w-1/2 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    v-model="medicine.quantity"
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    class="block w-1/4 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    v-if="form.medicines.length > 1"
                    @click="removeMedicine(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700"
                    aria-label="Remove medicine"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button
                  @click="addMedicine"
                  type="button"
                  class="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <i class="fas fa-plus mr-1"></i> Add More Medicine
                </button>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-center gap-2">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label class="text-sm text-gray-700">
                  I accept the
                  <NuxtLink to="/terms" class="text-blue-600 hover:underline">
                    Terms & Conditions
                  </NuxtLink>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
              >
                Submit Order
              </button>
            </form>
          </div>

          <!-- Fallback -->
          <div v-else class="text-center text-red-500">
            <p>Pharmacy not found. Please select a pharmacy.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePharmacyStore } from "@/stores/pharmacy";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const pharmacyStore = usePharmacyStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const pharmacyId = ref(route.query.pharmacyId);
const pharmacy = ref(null);
const loading = ref(false);
const error = ref("");
const debugMode = ref(true);

// Form data
const form = ref({
  patientName: "",
  gender: "",
  age: "",
  email: "",
  phone: "",
  deliveryAddress: {
    street: "",
    state: "",
    city: "",
    zip: "",
  },
  prescription: null,
  medicines: [{ name: "", quantity: "" }],
  acceptTerms: true, // Auto-tick terms
});

// Simulated patient data (fetched from database)
const patients = ref([
  { id: 1, name: "John Doe", gender: "Male" },
  { id: 2, name: "Jane Smith", gender: "Female" },
]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  console.log("Fetching data for route:", route.query);

  // Restore location from localStorage
  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  const location = locationStore.currentLocation;
  console.log("Location for Order Medicine Page:", location);

  if (!location || location === "Select Location") {
    error.value = "Please select a location.";
    console.log("Error: No location selected");
    router.push("/");
    return;
  }

  // Fetch pharmacies if not already in store
  if (
    !pharmacyStore.pharmacies.length ||
    pharmacyStore.selectedLocation !== location
  ) {
    console.log("Fetching pharmacies for location:", location);
    await pharmacyStore.fetchPharmacies(location);
    console.log("Pharmacies fetched:", pharmacyStore.pharmacies.length);
  }

  // Find the pharmacy
  pharmacy.value = pharmacyStore.pharmacies.find(
    (p) => p.id === parseInt(pharmacyId.value)
  );
  console.log("Pharmacy found:", pharmacy.value);

  if (!pharmacy.value) {
    error.value = "Pharmacy not found.";
    console.log("Error: Pharmacy not found");
  }

  // Pre-fill form data if user is authenticated
  if (authStore.isAuthenticated) {
    form.value.email = authStore.userInfo.email || "";
    form.value.phone = authStore.userInfo.phone || "";
    form.value.deliveryAddress.street =
      authStore.userInfo.address?.street || "";
    form.value.deliveryAddress.state = authStore.userInfo.address?.state || "";
    form.value.deliveryAddress.zip = authStore.userInfo.address?.zip || "";
  }

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
});

// Watch for route changes
watch(
  () => route.query.pharmacyId,
  async (newId) => {
    pharmacyId.value = newId;
    await fetchData();
  }
);

// Watch for patient selection to pre-fill gender
watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    form.value.gender = selectedPatient ? selectedPatient.gender : "";
  }
);

// Form methods
const handlePrescriptionUpload = (event) => {
  form.value.prescription = event.target.files[0];
};

const addMedicine = () => {
  form.value.medicines.push({ name: "", quantity: "" });
};

const removeMedicine = (index) => {
  form.value.medicines.splice(index, 1);
};

const submitOrder = () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to place an order.");
    router.push("/auth");
    return;
  }

  console.log("Order submitted:", {
    pharmacy: pharmacy.value.name,
    patientName: form.value.patientName,
    gender: form.value.gender,
    age: form.value.age,
    email: form.value.email,
    phone: form.value.phone,
    deliveryAddress: form.value.deliveryAddress,
    prescription: form.value.prescription,
    medicines: form.value.medicines,
    userId: authStore.userInfo.sessionId,
  });

  alert("Order placed successfully! (Placeholder action)");
  router.push("/pharmacy");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
