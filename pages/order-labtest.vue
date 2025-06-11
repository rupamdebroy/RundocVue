<template>
  <div>
    <Header />
    <section class="min-h-screen py-8">
      <div class="container mx-auto p-4">
        <!-- Debug Information -->
        <div v-if="debugMode" class="text-center text-gray-500 mb-4">
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Lab Center ID = {{ labcenterId }}</p>
          <p>
            Debug: Lab Center = {{ labCenter ? labCenter.name : "Not Found" }}
          </p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <!-- Order Lab Test & Diagnostics Page -->
        <div>
          <h1 class="text-2xl font-bold mb-4 text-center">
            Place Your Test & Diagnostics Order
          </h1>
          <p class="text-center text-green-600 font-semibold mb-4">
            Enjoy Free Booking – No Extra Charges!
          </p>

          <!-- Disclaimer -->
          <p class="text-center text-gray-600 mb-6">
            RUNDOC ONLY FACILITATES BOOKINGS WITH REGISTERED PARTNER
            LABORATORIES. RUNDOC DOES NOT OPERATE ANY LAB OR DIAGNOSTIC CENTER
            OF ITS OWN.
          </p>

          <!-- Loading state -->
          <div v-if="loading" class="text-center">
            <p>Loading order form...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>

          <!-- Order Form -->
          <div v-else-if="labCenter" class="max-w-2xl mx-auto">
            <!-- Lab Center Name -->
            <h2 class="text-xl font-semibold mb-2">{{ labCenter.name }}</h2>

            <!-- Form -->
            <form @submit.prevent="submitOrder" class="space-y-4">
              <!-- Patient Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Patient Name</label
                >
                <select
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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
                    class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
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

              <!-- Available Tests Button -->
              <button
                type="button"
                @click="showPopup('tests')"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Available Tests
              </button>

              <!-- Available Diagnostics Button -->
              <button
                type="button"
                @click="showPopup('diagnostics')"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all ml-2"
              >
                Available Diagnostics
              </button>

              <!-- Home Collection -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Do you need home collection?</label
                >
                <select
                  v-model="form.homeCollection"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Notes</label
                >
                <textarea
                  v-model="form.notes"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>

              <!-- Added Tests/Diagnostics -->
              <div v-if="form.selectedTests.length > 0" class="mt-4">
                <h3 class="text-lg font-semibold">
                  Selected Tests/Diagnostics
                </h3>
                <ul class="list-disc pl-5 mt-2">
                  <li
                    v-for="(test, index) in form.selectedTests"
                    :key="test.id"
                    class="flex items-center justify-between"
                  >
                    <span>{{ test.name }} (₹{{ test.price }})</span>
                    <button
                      @click="removeTest(index)"
                      class="text-red-500 hover:text-red-700"
                      aria-label="Remove test"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-center gap-2">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  required
                />
                <label class="text-sm text-gray-700">
                  I accept the
                  <NuxtLink to="/terms" class="text-purple-600 hover:underline">
                    Terms & Conditions
                  </NuxtLink>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="form.selectedTests.length === 0"
                class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all disabled:bg-gray-400"
              >
                Submit Order
              </button>
            </form>

            <!-- Popup for Tests/Diagnostics -->
            <div
              v-if="showPopupModal"
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 class="text-lg font-semibold mb-4">
                  {{
                    popupType === "tests"
                      ? "Available Tests"
                      : "Available Diagnostics"
                  }}
                </h3>
                <div
                  v-if="popupItems.length > 0"
                  class="space-y-2 max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="item in popupItems"
                    :key="item.id"
                    class="flex items-center justify-between"
                  >
                    <span>{{ item.name }} (₹{{ item.price }})</span>
                    <button
                      @click="addTest(item)"
                      class="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500">
                  Not Available
                </div>
                <button
                  @click="showPopupModal = false"
                  class="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <!-- Fallback -->
          <div v-else class="text-center text-red-500">
            <p>Lab center not found. Please select a lab center.</p>
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
import { useLabStore } from "@/stores/lab";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const labStore = useLabStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const labcenterId = ref(route.query.labcenterId);
const labCenter = ref(null);
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
  selectedTests: [],
  homeCollection: "No",
  notes: "",
  acceptTerms: true, // Auto-tick terms
});

// Simulated patient data
const patients = ref([
  { id: 1, name: "John Doe", gender: "Male" },
  { id: 2, name: "Jane Smith", gender: "Female" },
]);

// Popup state
const showPopupModal = ref(false);
const popupType = ref("");
const popupItems = ref([]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  console.log("Fetching data for route:", route.query);

  // Restore location from localStorage
  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  const location = locationStore.currentLocation;
  console.log("Location for Order Lab Test Page:", location);

  if (!location || location === "Select Location") {
    error.value = "Please select a location.";
    console.log("Error: No location selected");
    router.push("/");
    return;
  }

  // Fetch lab centers if not already in store
  if (!labStore.labCenters.length || labStore.selectedLocation !== location) {
    console.log("Fetching lab centers for location:", location);
    await labStore.fetchLabCenters(location);
    console.log("Lab centers fetched:", labStore.labCenters.length);
  }

  // Find the lab center
  labCenter.value = labStore.labCenters.find(
    (l) => l.id === parseInt(labcenterId.value)
  );
  console.log("Lab center found:", labCenter.value);

  if (!labCenter.value) {
    error.value = "Lab center not found.";
    console.log("Error: Lab center not found");
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
  () => route.query.labcenterId,
  async (newId) => {
    labcenterId.value = newId;
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

// Popup methods
const showPopup = (type) => {
  popupType.value = type;
  popupItems.value = type === "tests" ? labStore.tests : labStore.diagnostics;
  showPopupModal.value = true;
};

const addTest = (item) => {
  if (!form.value.selectedTests.some((t) => t.id === item.id)) {
    form.value.selectedTests.push({ ...item });
  }
  showPopupModal.value = false;
};

const removeTest = (index) => {
  form.value.selectedTests.splice(index, 1);
};

// Form methods
const handlePrescriptionUpload = (event) => {
  form.value.prescription = event.target.files[0];
};

const submitOrder = () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to place an order.");
    router.push("/auth");
    return;
  }

  if (form.value.selectedTests.length === 0) {
    alert("Please add at least one test or diagnostic.");
    return;
  }

  // Generate a unique order ID (simulated)
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log("Order submitted:", {
    orderId,
    labCenter: labCenter.value.name,
    patientName: form.value.patientName,
    gender: form.value.gender,
    age: form.value.age,
    email: form.value.email,
    phone: form.value.phone,
    deliveryAddress: form.value.deliveryAddress,
    prescription: form.value.prescription,
    selectedTests: form.value.selectedTests,
    homeCollection: form.value.homeCollection,
    notes: form.value.notes,
    userId: authStore.userInfo.sessionId,
  });

  alert(`Order placed successfully! Order ID: ${orderId}`);
  router.push("/labtest");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
