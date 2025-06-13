<template>
  <div>
    <Header />
    <section class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Debug Information (Hidden by default, toggleable for devs) -->
        <div
          v-if="debugMode"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md"
        >
          <p class="text-sm text-yellow-700">
            Debug: Location = {{ locationStore.currentLocation }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Lab Center ID = {{ labcenterId }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Lab Center = {{ labCenter ? labCenter.name : "Not Found" }}
          </p>
          <p class="text-sm text-yellow-700">Error = {{ error || "None" }}</p>
        </div>

        <!-- Order Lab Test & Diagnostics Page -->
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-semibold text-center text-gray-800 mb-2">
            Book Lab Test
            <span class="text-blue-600">Lab Test</span> &
            <span class="text-blue-600">Diagnostics</span>
          </h1>

          <p class="text-center text-green-600 font-medium mb-6 animate-pulse">
            Free Booking – No Extra Charges!
          </p>

          <!-- Horizontal Banner -->
          <div class="bg-blue-600 text-white text-center py-3 px-4 mb-8">
            <p class="text-sm sm:text-base font-medium normal-case">
              Rundoc only facilitates bookings with registered partner
              Laboratories. Rundoc does not operate any lab or diagnostic center
              Of its own.
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
            ></div>
            <p class="text-gray-600 mt-2">Loading order form...</p>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="text-center bg-red-100 text-red-600 p-4 rounded-lg"
          >
            <p>{{ error }}</p>
          </div>

          <!-- Order Form -->
          <div
            v-else-if="labCenter"
            class="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <!-- Lab Center Name -->
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              {{ labCenter.name }}
            </h2>

            <!-- Form -->
            <form @submit.prevent="submitOrder" class="space-y-6">
              <!-- Patient Name -->
              <div>
                <label
                  for="patientName"
                  class="block text-sm font-medium text-gray-700"
                  >Patient Name</label
                >
                <select
                  id="patientName"
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

              <!-- Age -->
              <div>
                <label for="age" class="block text-sm font-medium text-gray-700"
                  >Age</label
                >
                <input
                  id="age"
                  v-model="form.age"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <!-- Email Address -->
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email Address</label
                >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <!-- Phone Number -->
              <div>
                <label
                  for="phone"
                  class="block text-sm font-medium text-gray-700"
                  >Phone Number</label
                >
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <!-- Delivery Address -->
              <div>
                <label
                  for="street"
                  class="block text-sm font-medium text-gray-700"
                  >Delivery Address</label
                >
                <input
                  id="street"
                  v-model="form.deliveryAddress.street"
                  type="text"
                  placeholder="Street Address"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- State/Province -->
                <div>
                  <label
                    for="state"
                    class="block text-sm font-medium text-gray-700"
                    >State/Province</label
                  >
                  <input
                    id="state"
                    v-model="form.deliveryAddress.state"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <!-- City (Disabled, pre-filled) -->
                <div>
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700"
                    >City</label
                  >
                  <input
                    id="city"
                    :value="locationStore.currentLocation"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                    disabled
                  />
                </div>

                <!-- ZIP/Postal Code -->
                <div>
                  <label
                    for="zip"
                    class="block text-sm font-medium text-gray-700"
                    >ZIP/Postal Code</label
                  >
                  <input
                    id="zip"
                    v-model="form.deliveryAddress.zip"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <!-- Upload Prescription -->
              <div>
                <label
                  for="prescription"
                  class="block text-sm font-medium text-gray-700"
                  >Upload Prescription</label
                >
                <input
                  id="prescription"
                  type="file"
                  accept="image/*,application/pdf"
                  @change="handlePrescriptionUpload"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                />
                <p v-if="form.prescription" class="text-sm text-gray-600 mt-2">
                  Uploaded: {{ form.prescription.name }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  @click="showPopup('tests')"
                  class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Available Tests
                </button>
                <button
                  type="button"
                  @click="showPopup('diagnostics')"
                  class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Available Diagnostics
                </button>
              </div>

              <!-- Home Collection -->
              <div>
                <label
                  for="homeCollection"
                  class="block text-sm font-medium text-gray-700"
                  >Do you need home collection?</label
                >
                <select
                  id="homeCollection"
                  v-model="form.homeCollection"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label
                  for="notes"
                  class="block text-sm font-medium text-gray-700"
                  >Notes</label
                >
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  rows="4"
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>

              <!-- Added Tests/Diagnostics -->
              <div v-if="form.selectedTests.length > 0" class="mt-6">
                <h3 class="text-lg font-semibold text-gray-900">
                  Selected Tests/Diagnostics
                </h3>
                <ul class="mt-3 space-y-3">
                  <li
                    v-for="(test, index) in form.selectedTests"
                    :key="test.id"
                    class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span class="text-gray-700"
                      >{{ test.name }} (₹{{ test.price }})</span
                    >
                    <button
                      @click="removeTest(index)"
                      class="text-red-500 hover:text-red-700 transition-all"
                      aria-label="Remove test"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-center gap-3">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label for="terms" class="text-sm text-gray-700">
                  I accept the
                  <NuxtLink
                    to="/terms"
                    class="text-blue-600 hover:underline font-medium"
                  >
                    Terms & Conditions
                  </NuxtLink>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="form.selectedTests.length === 0"
                class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Order
              </button>
            </form>

            <!-- Popup for Tests/Diagnostics -->
            <div
              v-if="showPopupModal"
              class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            >
              <div
                class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
              >
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                  {{
                    popupType === "tests"
                      ? "Available Tests"
                      : "Available Diagnostics"
                  }}
                </h3>
                <div
                  v-if="popupItems.length > 0"
                  class="space-y-3 max-h-96 overflow-y-auto"
                >
                  <div
                    v-for="item in popupItems"
                    :key="item.id"
                    class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span class="text-gray-700"
                      >{{ item.name }} (₹{{ item.price }})</span
                    >
                    <button
                      @click="addTest(item)"
                      class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-4">
                  Not Available
                </div>
                <button
                  @click="showPopupModal = false"
                  class="mt-6 w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <!-- Fallback -->
          <div
            v-else
            class="text-center bg-red-100 text-red-600 p-4 rounded-lg"
          >
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
const debugMode = ref(false); // Changed to false for production

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
  acceptTerms: true,
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

  if (!labStore.labCenters.length || labStore.selectedLocation !== location) {
    console.log("Fetching lab centers for location:", location);
    await labStore.fetchLabCenters(location);
    console.log("Lab centers fetched:", labStore.labCenters.length);
  }

  labCenter.value = labStore.labCenters.find(
    (l) => l.id === parseInt(labcenterId.value)
  );
  console.log("Lab center found:", labCenter.value);

  if (!labCenter.value) {
    error.value = "Lab center not found.";
    console.log("Error: Lab center not found");
  }

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

watch(
  () => route.query.labcenterId,
  async (newId) => {
    labcenterId.value = newId;
    await fetchData();
  }
);

watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    form.value.gender = selectedPatient ? selectedPatient.gender : "";
  }
);

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

/* Ensure smooth transitions for interactive elements */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Custom focus ring for accessibility */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Ensure modal is scrollable on small screens */
@media (max-height: 600px) {
  .max-h-96 {
    max-height: 60vh;
  }
}

/* File input custom styling */
input[type="file"] {
  cursor: pointer;
}

/* Disabled input styling */
input:disabled,
select:disabled {
  background-color: #f3f4f6;
  opacity: 0.7;
}
</style>
