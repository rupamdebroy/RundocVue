<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-50 py-8 md:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div
          v-if="debugMode"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md text-sm text-yellow-700"
        >
          <p>Debug: Location = {{ locationStore.currentLocation }}</p>
          <p>Debug: Lab Center ID = {{ labcenterId }}</p>
          <p>
            Debug: Lab Center = {{ labCenter ? labCenter.name : "Not Found" }}
          </p>
          <p>Error = {{ error || "None" }}</p>
        </div>

        <h1
          class="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2"
        >
          Book Your Lab Test
        </h1>
        <p class="text-center text-green-600 font-bold mb-6 animate-pulse">
          Free Booking – No Extra Charges!
        </p>

        <div
          class="bg-blue-600 text-white text-center py-3 px-4 mb-8 rounded-lg shadow-sm"
        >
          <p class="text-sm sm:text-base font-medium">
            <i class="fas fa-info-circle mr-2"></i> Rundoc only facilitates
            bookings with registered partner Laboratories. We do not operate our
            own labs.
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
          <p class="text-gray-600 mt-4 text-lg">Fetching lab details...</p>
        </div>

        <div
          v-else-if="error"
          class="text-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          <i class="fas fa-exclamation-circle text-2xl mb-3"></i>
          <p class="text-lg font-medium">{{ error }}</p>
          <button
            @click="router.push('/labtest')"
            class="mt-4 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back to Labs
          </button>
        </div>

        <div
          v-else-if="labCenter"
          class="bg-white p-6 sm:p-8 rounded-xl shadow-2xl"
        >
          <div
            class="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-200"
          >
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold bg-blue-100 shrink-0 overflow-hidden"
            >
              <img
                v-if="labCenter.dp"
                :src="labCenter.dp"
                alt="Lab DP"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <span v-else>{{ labCenter.name?.charAt(0) || "?" }}</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 leading-tight">
                {{ labCenter.name }}
              </h2>
              <p class="text-md text-gray-600">{{ labCenter.address }}</p>
              <span
                v-if="labCenter.discount"
                class="inline-block mt-2 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              >
                Up to {{ labCenter.discount }}% OFF
              </span>
            </div>
          </div>

          <form @submit.prevent="submitOrder" class="space-y-6">
            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                Patient Details
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="patientName"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Patient Name <span class="text-red-500">*</span></label
                  >
                  <select
                    id="patientName"
                    v-model="form.patientName"
                    class="form-select"
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
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Gender</label
                  >
                  <input
                    id="gender"
                    v-model="form.gender"
                    type="text"
                    class="form-input-disabled"
                    readonly
                  />
                </div>
                <div>
                  <label
                    for="age"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Age <span class="text-red-500">*</span></label
                  >
                  <input
                    id="age"
                    v-model="form.age"
                    type="number"
                    min="0"
                    class="form-input"
                    placeholder="Enter patient's age"
                    required
                  />
                </div>
                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Phone Number <span class="text-red-500">*</span></label
                  >
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="e.g., +91 9876543210"
                    required
                  />
                </div>
                <div class="sm:col-span-2">
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Email Address <span class="text-red-500">*</span></label
                  >
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    placeholder="e.g., patient@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                Collection Address
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label
                    for="street"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Street Address <span class="text-red-500">*</span></label
                  >
                  <input
                    id="street"
                    v-model="form.deliveryAddress.street"
                    type="text"
                    class="form-input"
                    placeholder="House No., Building, Area"
                    required
                  />
                </div>
                <div>
                  <label
                    for="state"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >State/Province <span class="text-red-500">*</span></label
                  >
                  <input
                    id="state"
                    v-model="form.deliveryAddress.state"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >City</label
                  >
                  <input
                    id="city"
                    :value="locationStore.currentLocation"
                    type="text"
                    class="form-input-disabled"
                    disabled
                  />
                </div>
                <div>
                  <label
                    for="zip"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >ZIP/Postal Code <span class="text-red-500">*</span></label
                  >
                  <input
                    id="zip"
                    v-model="form.deliveryAddress.zip"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div>
                  <label
                    for="homeCollection"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Need Home Sample Collection?</label
                  >
                  <select
                    id="homeCollection"
                    v-model="form.homeCollection"
                    class="form-select"
                  >
                    <option value="No">No (I will visit the lab)</option>
                    <option value="Yes">Yes (Collect from my address)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                Select Tests & Diagnostics
              </h3>
              <div class="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  type="button"
                  @click="showPopup('tests')"
                  class="flex-1 btn-primary-outline"
                >
                  <i class="fas fa-list-alt mr-2"></i> View Available Tests
                </button>
                <button
                  type="button"
                  @click="showPopup('diagnostics')"
                  class="flex-1 btn-primary-outline"
                >
                  <i class="fas fa-x-ray mr-2"></i> View Available Diagnostics
                </button>
              </div>

              <div v-if="form.selectedTests.length > 0" class="mt-4">
                <h4 class="text-md font-semibold text-gray-700 mb-3">
                  Your Selection:
                </h4>
                <ul class="space-y-2">
                  <li
                    v-for="(test, index) in form.selectedTests"
                    :key="test.id"
                    class="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-200"
                  >
                    <span class="text-gray-800 font-medium"
                      >{{ test.name }}
                      <span class="text-green-600"
                        >(₹{{ test.price }})</span
                      ></span
                    >
                    <button
                      @click="removeTest(index)"
                      type="button"
                      class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                      aria-label="Remove test"
                    >
                      <i class="fas fa-times text-lg"></i>
                    </button>
                  </li>
                </ul>
              </div>
              <p v-else class="text-gray-500 text-center py-4 text-sm">
                No tests or diagnostics selected yet. Please click a button
                above to choose.
              </p>
            </div>

            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                Additional Information
              </h3>
              <div>
                <label
                  for="prescription"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Upload Prescription (Optional)</label
                >
                <input
                  id="prescription"
                  type="file"
                  accept="image/*,application/pdf"
                  @change="handlePrescriptionUpload"
                  class="form-file-input"
                />
                <p v-if="form.prescription" class="text-sm text-gray-600 mt-2">
                  <i class="fas fa-file-upload mr-1"></i> Uploaded:
                  {{ form.prescription.name }}
                </p>
              </div>
              <div class="mt-4">
                <label
                  for="notes"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Notes (Optional)</label
                >
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-input resize-y"
                  rows="3"
                  placeholder="e.g., Preferred collection time, specific instructions..."
                ></textarea>
              </div>
            </div>

            <div class="flex items-start gap-3 mt-6">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 shrink-0"
                required
              />
              <label for="terms" class="text-sm text-gray-700">
                I accept the
                <NuxtLink
                  to="/terms"
                  class="text-blue-600 hover:underline font-medium"
                  target="_blank"
                >
                  Terms & Conditions
                </NuxtLink>
                and
                <NuxtLink
                  to="/privacy"
                  class="text-blue-600 hover:underline font-medium"
                  target="_blank"
                >
                  Privacy Policy </NuxtLink
                >.
              </label>
            </div>

            <button
              type="submit"
              :disabled="form.selectedTests.length === 0 || processingOrder"
              class="w-full btn-primary py-3"
            >
              <span v-if="processingOrder">
                <i class="fas fa-spinner fa-spin mr-2"></i> Processing...
              </span>
              <span v-else>
                <i class="fas fa-paper-plane mr-2"></i> Confirm Order
              </span>
            </button>
          </form>

          <Transition name="fade">
            <div
              v-if="showPopupModal"
              class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              @click.self="showPopupModal = false"
            >
              <div
                class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-transform duration-300"
              >
                <div
                  class="flex justify-between items-center mb-4 pb-3 border-b"
                >
                  <h3 class="text-xl font-semibold text-gray-900">
                    {{
                      popupType === "tests"
                        ? "Available Tests"
                        : "Available Diagnostics"
                    }}
                  </h3>
                  <button
                    @click="showPopupModal = false"
                    class="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close popup"
                  >
                    <i class="fas fa-times text-xl"></i>
                  </button>
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    v-model="searchTerm"
                    placeholder="Search tests/diagnostics..."
                    class="form-input"
                  />
                </div>
                <div
                  v-if="filteredPopupItems.length > 0"
                  class="space-y-3 max-h-96 overflow-y-auto pr-2"
                >
                  <div
                    v-for="item in filteredPopupItems"
                    :key="item.id"
                    class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <span class="text-gray-700 font-medium"
                      >{{ item.name }}
                      <span class="text-green-600"
                        >(₹{{ item.price }})</span
                      ></span
                    >
                    <button
                      @click="addTest(item)"
                      :class="{
                        'opacity-50 cursor-not-allowed': isTestSelected(item),
                      }"
                      :disabled="isTestSelected(item)"
                      class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {{ isTestSelected(item) ? "Added" : "Add" }}
                    </button>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 py-4">
                  No
                  {{ popupType === "tests" ? "tests" : "diagnostics" }} found.
                </div>
                <button
                  @click="showPopupModal = false"
                  class="mt-6 w-full btn-secondary"
                >
                  Done
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <div
          v-else
          class="text-center bg-gray-100 text-gray-600 p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          <i class="fas fa-info-circle text-2xl mb-3"></i>
          <p class="text-lg font-medium">No lab center selected or found.</p>
          <button
            @click="router.push('/labtest')"
            class="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Find Lab Centers
          </button>
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
const debugMode = ref(false); // Set to true to see debug info
const processingOrder = ref(false); // New state for submit button loading

// Form data
const form = ref({
  patientName: "",
  gender: "", // This will be automatically set based on patientName selection
  age: "",
  email: "",
  phone: "",
  deliveryAddress: {
    street: "",
    state: "",
    city: "", // This will be automatically set to currentLocation
    zip: "",
  },
  prescription: null,
  selectedTests: [],
  homeCollection: "No",
  notes: "",
  acceptTerms: true,
});

// Simulated patient data (In a real app, this would come from a user's profile)
const patients = ref([
  { id: 1, name: "John Doe", gender: "Male", age: 30 },
  { id: 2, name: "Jane Smith", gender: "Female", age: 25 },
  { id: 3, name: "Ramesh Kumar", gender: "Male", age: 45 },
  { id: 4, name: "Priya Sharma", gender: "Female", age: 38 },
]);

// Popup state and search
const showPopupModal = ref(false);
const popupType = ref("");
const searchTerm = ref(""); // New ref for search input in popup

// Computed property for filtering popup items
const filteredPopupItems = computed(() => {
  const items =
    popupType.value === "tests" ? labStore.tests : labStore.diagnostics;
  if (!searchTerm.value) {
    return items;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return items.filter((item) =>
    item.name.toLowerCase().includes(lowerCaseSearchTerm)
  );
});

// Check if a test is already selected to disable 'Add' button
const isTestSelected = (item) => {
  return form.value.selectedTests.some((t) => t.id === item.id);
};

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  console.log("Fetching data for route:", route.query);

  await locationStore.restoreLocation();
  console.log("Restored location:", locationStore.currentLocation);

  const location = locationStore.currentLocation;
  console.log("Location for Order Lab Test Page:", location);

  if (!location || location === "Select Location") {
    error.value = "Please select a location from the homepage or go back.";
    console.log("Error: No location selected");
    // router.push("/"); // Don't redirect immediately, show error
    loading.value = false;
    return;
  }

  // Ensure labCenters are loaded for the current location
  if (!labStore.labCenters.length || labStore.selectedLocation !== location) {
    console.log("Fetching lab centers for location:", location);
    try {
      await labStore.fetchLabCenters(location);
      console.log("Lab centers fetched:", labStore.labCenters.length);
    } catch (err) {
      error.value = `Failed to load lab centers for ${location}. Please try again later.`;
      console.error("Error fetching lab centers:", err);
      loading.value = false;
      return;
    }
  }

  // Find the specific lab center
  labCenter.value = labStore.labCenters.find(
    (l) => l.id === parseInt(labcenterId.value)
  );
  console.log("Lab center found:", labCenter.value);

  if (!labCenter.value) {
    error.value =
      "Selected lab center not found. It might not be available in this location.";
    console.log("Error: Lab center not found");
  } else {
    // Pre-fill city from location store once labCenter is confirmed
    form.value.deliveryAddress.city = locationStore.currentLocation;
  }

  // Pre-fill user info if authenticated
  if (authStore.isAuthenticated && authStore.userInfo) {
    form.value.email = authStore.userInfo.email || "";
    form.value.phone = authStore.userInfo.phone || "";
    if (authStore.userInfo.address) {
      form.value.deliveryAddress.street =
        authStore.userInfo.address.street || "";
      form.value.deliveryAddress.state = authStore.userInfo.address.state || "";
      form.value.deliveryAddress.zip = authStore.userInfo.address.zip || "";
    }
  }

  loading.value = false;
};

onMounted(async () => {
  // Restore location and fetch initial data
  await fetchData();
});

watch(
  () => route.query.labcenterId,
  async (newId) => {
    // Only refetch if the ID actually changes
    if (newId && newId !== labcenterId.value) {
      labcenterId.value = newId;
      await fetchData();
    }
  }
);

watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    form.value.gender = selectedPatient ? selectedPatient.gender : "";
    form.value.age = selectedPatient ? selectedPatient.age : ""; // Auto-fill age too
  }
);

const showPopup = (type) => {
  popupType.value = type;
  searchTerm.value = ""; // Reset search term
  showPopupModal.value = true;
};

const addTest = (item) => {
  if (!form.value.selectedTests.some((t) => t.id === item.id)) {
    form.value.selectedTests.push({ ...item });
  }
  // Optionally close the modal after adding, or let the user add multiple
  // showPopupModal.value = false;
};

const removeTest = (index) => {
  form.value.selectedTests.splice(index, 1);
};

const handlePrescriptionUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Basic file size validation (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller file.");
      form.value.prescription = null;
      event.target.value = ""; // Clear the input
      return;
    }
    form.value.prescription = file;
  } else {
    form.value.prescription = null;
  }
};

const submitOrder = async () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to place an order.");
    router.push("/auth");
    return;
  }

  if (form.value.selectedTests.length === 0) {
    alert("Please add at least one test or diagnostic before submitting.");
    return;
  }

  if (!form.value.acceptTerms) {
    alert("Please accept the Terms & Conditions.");
    return;
  }

  processingOrder.value = true; // Start loading state for button

  try {
    // Simulate API call for submission
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log("Order submitted:", {
      orderId,
      labCenterId: labCenter.value.id,
      labCenterName: labCenter.value.name,
      patientName: form.value.patientName,
      gender: form.value.gender,
      age: form.value.age,
      email: form.value.email,
      phone: form.value.phone,
      deliveryAddress: form.value.deliveryAddress,
      prescription: form.value.prescription
        ? form.value.prescription.name
        : "N/A",
      selectedTests: form.value.selectedTests.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
      })),
      homeCollection: form.value.homeCollection,
      notes: form.value.notes,
      userId: authStore.userInfo.sessionId, // Or authStore.userId depending on your store structure
    });

    alert(
      `Order placed successfully! Your Order ID is: ${orderId}. We will contact you shortly.`
    );
    router.push("/order-success?orderId=" + orderId); // Redirect to a success page
  } catch (err) {
    console.error("Order submission failed:", err);
    alert("Failed to place order. Please try again.");
  } finally {
    processingOrder.value = false; // End loading state
  }
};

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/80?text=Lab"; // Larger placeholder for bigger DP
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom form input styling */
.form-input,
.form-select {
  @apply mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm;
}

.form-input-disabled {
  @apply mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm;
}

.form-file-input {
  @apply mt-1 block w-full border border-gray-300 rounded-lg p-3
    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
    file:bg-blue-50 file:text-blue-700
    hover:file:bg-blue-100 transition-all cursor-pointer;
}

/* Primary Button */
.btn-primary {
  @apply bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Primary Outline Button */
.btn-primary-outline {
  @apply bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Secondary Button (for modal close) */
.btn-secondary {
  @apply bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2;
}

/* Transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Ensure modal max-height and overflow for scrollability */
.max-h-96 {
  /* This class is already present */
  max-height: 24rem; /* 96 * 0.25rem = 24rem */
}

/* Override default browser focus outline */
*:focus {
  outline: none;
}
</style>
