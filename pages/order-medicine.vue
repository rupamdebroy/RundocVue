<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          v-if="debugMode"
          class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md shadow-sm"
        >
          <p class="text-sm text-yellow-700">
            Debug: Location = {{ locationStore.currentLocation }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Pharmacy ID = {{ pharmacyId }}
          </p>
          <p class="text-sm text-yellow-700">
            Debug: Pharmacy = {{ pharmacy ? pharmacy.name : "Not Found" }}
          </p>
          <p class="text-sm text-yellow-700">Error = {{ error || "None" }}</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-800 mb-2 leading-tight"
          >
            Book Your <span class="text-blue-600">Medicine</span> Order
          </h1>

          <p
            class="text-center text-green-600 font-semibold mb-6 animate-pulse text-base sm:text-lg"
          >
            Free Delivery – No Extra Charges! Get your medicines delivered fast.
          </p>

          <div
            class="bg-blue-700 text-white text-center py-2.5 px-3 sm:py-3 sm:px-4 mb-8 rounded-lg shadow-md"
          >
            <p class="text-xs sm:text-sm font-medium normal-case opacity-90">
              Rundoc only facilitates bookings with registered partner
              Pharmacies. Rundoc does not operate any pharmacy or medicine
              delivery service of its own.
            </p>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div
              class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
            ></div>
            <p class="text-gray-600 mt-3 text-lg font-medium">
              Preparing your order form...
            </p>
          </div>

          <div
            v-else-if="error"
            class="text-center bg-red-100 text-red-700 p-6 rounded-lg border border-red-200 shadow-md"
          >
            <p class="text-lg font-semibold mb-2">
              <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
              Error: {{ error }}
            </p>
            <p class="text-sm text-gray-700">
              Please go back to the
              <NuxtLink to="/pharmacy" class="text-blue-600 hover:underline"
                >pharmacy list</NuxtLink
              >
              and select a valid pharmacy.
            </p>
          </div>

          <div
            v-else-if="pharmacy"
            class="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100"
          >
            <div class="flex items-center mb-6 border-b pb-4">
              <div
                class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4 shrink-0 overflow-hidden shadow-inner"
              >
                <img
                  v-if="pharmacy.dp"
                  :src="pharmacy.dp"
                  :alt="`${pharmacy.name} DP`"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <span v-else>{{ pharmacy.name?.charAt(0) || "?" }}</span>
              </div>
              <div>
                <h2
                  class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
                >
                  Order from {{ pharmacy.name }}
                </h2>
                <p class="text-sm text-gray-600">
                  <i class="fas fa-map-marker-alt text-blue-500 mr-1"></i>
                  {{ pharmacy.address }}, {{ pharmacy.city }}
                </p>
              </div>
            </div>

            <form @submit.prevent="submitOrder" class="space-y-6">
              <div>
                <label
                  for="patientName"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Select Patient</label
                >
                <select
                  id="patientName"
                  v-model="form.patientName"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                >
                  <option value="" disabled selected>
                    Choose from your profiles
                  </option>
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
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Gender</label
                >
                <input
                  id="gender"
                  v-model="form.gender"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm"
                  readonly
                />
              </div>

              <div>
                <label
                  for="age"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Age</label
                >
                <input
                  id="age"
                  v-model="form.age"
                  type="number"
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Email Address</label
                >
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Phone Number</label
                >
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label
                  for="street"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Delivery Address</label
                >
                <input
                  id="street"
                  v-model="form.deliveryAddress.street"
                  type="text"
                  placeholder="Street Address, Apt, etc."
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    for="state"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >State/Province</label
                  >
                  <input
                    id="state"
                    v-model="form.deliveryAddress.state"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    for="city"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >City</label
                  >
                  <input
                    id="city"
                    :value="locationStore.currentLocation"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm"
                    disabled
                  />
                </div>

                <div>
                  <label
                    for="zip"
                    class="block text-sm font-semibold text-gray-700 mb-1"
                    >ZIP/Postal Code</label
                  >
                  <input
                    id="zip"
                    v-model="form.deliveryAddress.zip"
                    type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  for="prescription"
                  class="block text-sm font-semibold text-gray-700 mb-1"
                  >Upload Prescription (Optional, but recommended)</label
                >
                <input
                  id="prescription"
                  type="file"
                  accept="image/*,application/pdf"
                  @change="handlePrescriptionUpload"
                  class="mt-1 block w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer shadow-sm"
                />
                <p v-if="form.prescription" class="text-sm text-gray-600 mt-2">
                  <i class="fas fa-file-alt mr-1"></i> Uploaded:
                  <span class="font-medium">{{ form.prescription.name }}</span>
                  <button
                    type="button"
                    @click="removePrescription"
                    class="text-red-500 hover:text-red-700 ml-3"
                    title="Remove prescription"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                </p>
                <p v-else class="text-sm text-gray-500 mt-2">
                  Accepted formats: images (JPG, PNG), PDF. Max file size: 5MB.
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                  >Medicines Needed</label
                >
                <div
                  v-for="(medicine, index) in form.medicines"
                  :key="index"
                  class="flex flex-col sm:flex-row items-center gap-3 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm"
                >
                  <input
                    v-model="medicine.name"
                    type="text"
                    placeholder="Medicine Name (e.g., Paracetamol 500mg)"
                    class="block w-full sm:w-2/3 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <input
                    v-model="medicine.quantity"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    class="block w-full sm:w-1/4 border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center"
                    required
                  />
                  <button
                    v-if="form.medicines.length > 1"
                    @click="removeMedicine(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700 transition-all p-2 rounded-full hover:bg-red-50"
                    aria-label="Remove medicine"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
                <button
                  @click="addMedicine"
                  type="button"
                  class="mt-4 bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-200 transition-all flex items-center font-semibold text-sm shadow-sm"
                >
                  <i class="fas fa-plus mr-2"></i> Add Another Medicine
                </button>
              </div>

              <div class="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
                  required
                />
                <label for="terms" class="text-sm text-gray-700 leading-snug">
                  I accept the
                  <NuxtLink
                    to="/terms"
                    class="text-blue-600 hover:underline font-medium"
                    target="_blank"
                  >
                    Terms & Conditions</NuxtLink
                  >
                  and
                  <NuxtLink
                    to="/privacy"
                    class="text-blue-600 hover:underline font-medium"
                    target="_blank"
                  >
                    Privacy Policy</NuxtLink
                  >.
                </label>
              </div>

              <button
                type="submit"
                :disabled="
                  loading ||
                  form.medicines.length === 0 ||
                  form.medicines.some((m) => !m.name || !m.quantity) ||
                  !form.acceptTerms
                "
                class="w-full bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-all font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                {{ loading ? "Submitting..." : "Place Your Order" }}
                <i class="fas fa-paper-plane ml-2"></i>
              </button>
            </form>
          </div>

          <div
            v-else
            class="text-center bg-red-100 text-red-700 p-6 rounded-lg border border-red-200 shadow-md"
          >
            <p class="text-lg font-semibold mb-2">
              <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
              Pharmacy Not Found
            </p>
            <p class="text-sm text-gray-700">
              The selected pharmacy could not be found. Please return to the
              <NuxtLink to="/pharmacy" class="text-blue-600 hover:underline"
                >pharmacy list</NuxtLink
              >
              to choose another.
            </p>
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
import { usePharmacyStore } from "@/stores/pharmacy";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth"; // Assuming this store exists for user info

const route = useRoute();
const router = useRouter();
const pharmacyStore = usePharmacyStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();

const pharmacyId = ref(route.query.pharmacyId);
const pharmacy = ref(null);
const loading = ref(false);
const error = ref("");
const debugMode = ref(false); // Set to true for debugging, false for production

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
  medicines: [{ name: "", quantity: "" }], // Ensure at least one medicine field exists
  acceptTerms: false, // Changed default to false for explicit user action
});

// Simulated patient data (you'd likely fetch this from a user profile API)
const patients = ref([
  { id: 1, name: "John Doe", gender: "Male", age: 35 },
  { id: 2, name: "Jane Smith", gender: "Female", age: 28 },
  { id: 3, name: "Baby Alex", gender: "Male", age: 1 },
]);

const fetchData = async () => {
  loading.value = true;
  error.value = "";

  // console.log("Fetching data for route:", route.query);

  // Restore location from localStorage
  await locationStore.restoreLocation();
  // console.log("Restored location:", locationStore.currentLocation);

  const location = locationStore.currentLocation;
  // console.log("Location for Order Medicine Page:", location);

  if (!location || location === "Select Location") {
    error.value = "Your location is not set.";
    // console.log("Error: No location selected");
    // router.push("/"); // Consider if auto-redirect is desired or just show error
    loading.value = false;
    return;
  }

  // Fetch pharmacies if not already in store or if location has changed
  if (
    !pharmacyStore.pharmacies.length ||
    pharmacyStore.selectedLocation !== location
  ) {
    // console.log("Fetching pharmacies for location:", location);
    await pharmacyStore.fetchPharmacies(location);
    // console.log("Pharmacies fetched:", pharmacyStore.pharmacies.length);
  }

  // Find the pharmacy by ID
  pharmacy.value = pharmacyStore.pharmacies.find(
    (p) => p.id === parseInt(pharmacyId.value)
  );
  // console.log("Pharmacy found:", pharmacy.value);

  if (!pharmacy.value) {
    error.value = "Selected pharmacy not found in your area.";
    // console.log("Error: Pharmacy not found");
  }

  // Pre-fill form data if user is authenticated
  if (authStore.isAuthenticated && authStore.userInfo) {
    form.value.email = authStore.userInfo.email || "";
    form.value.phone = authStore.userInfo.phone || "";
    form.value.deliveryAddress.street =
      authStore.userInfo.address?.street || "";
    form.value.deliveryAddress.state = authStore.userInfo.address?.state || "";
    form.value.deliveryAddress.zip = authStore.userInfo.address?.zip || "";

    // If there's a default patient or if user info contains patient details
    // For now, assuming the first patient in the simulated list is default if authenticated
    if (patients.value.length > 0) {
      form.value.patientName = patients.value[0].name;
      form.value.gender = patients.value[0].gender;
      form.value.age = patients.value[0].age;
    }
  }

  loading.value = false;
};

onMounted(async () => {
  await fetchData();
});

// Watch for route changes (e.g., if user navigates to a different pharmacy ID)
watch(
  () => route.query.pharmacyId,
  async (newId) => {
    pharmacyId.value = newId;
    await fetchData();
  }
);

// Watch for patient selection to pre-fill gender and age
watch(
  () => form.value.patientName,
  (newPatientName) => {
    const selectedPatient = patients.value.find(
      (p) => p.name === newPatientName
    );
    if (selectedPatient) {
      form.value.gender = selectedPatient.gender;
      form.value.age = selectedPatient.age;
    } else {
      form.value.gender = "";
      form.value.age = "";
    }
  }
);

// Form methods
const handlePrescriptionUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Basic file size and type validation (optional)
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("File size exceeds 5MB. Please upload a smaller file.");
      event.target.value = null; // Clear the input
      form.value.prescription = null;
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      event.target.value = null;
      form.value.prescription = null;
      return;
    }
    form.value.prescription = file;
  }
};

const removePrescription = () => {
  form.value.prescription = null;
  const fileInput = document.getElementById("prescription");
  if (fileInput) {
    fileInput.value = null; // Clear the file input visually
  }
};

const addMedicine = () => {
  form.value.medicines.push({ name: "", quantity: "" });
};

const removeMedicine = (index) => {
  form.value.medicines.splice(index, 1);
};

const submitOrder = async () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem("redirectAfterLogin", route.fullPath);
    alert("Please log in to place an order.");
    router.push("/auth");
    return;
  }

  // Client-side validation for medicines
  if (
    form.value.medicines.length === 0 ||
    form.value.medicines.some((m) => !m.name.trim() || !m.quantity)
  ) {
    alert("Please add at least one medicine with a name and quantity.");
    return;
  }

  // Basic form validation (ensure required fields are filled) - HTML5 `required` handles most
  if (
    !form.value.patientName ||
    !form.value.age ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.deliveryAddress.street ||
    !form.value.deliveryAddress.state ||
    !form.value.deliveryAddress.zip
  ) {
    alert("Please fill in all required patient and delivery details.");
    return;
  }

  if (!form.value.acceptTerms) {
    alert("Please accept the Terms & Conditions to proceed.");
    return;
  }

  // Simulate API call
  loading.value = true;
  try {
    const orderId = `MED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // In a real application, you would send this data to your backend
    console.log("Order payload:", {
      pharmacyId: pharmacyId.value,
      pharmacyName: pharmacy.value.name,
      patientName: form.value.patientName,
      gender: form.value.gender,
      age: form.value.age,
      email: form.value.email,
      phone: form.value.phone,
      deliveryAddress: form.value.deliveryAddress,
      prescriptionFileName: form.value.prescription
        ? form.value.prescription.name
        : "N/A", // Only send file name, actual file needs separate upload
      medicines: form.value.medicines,
      userId: authStore.userInfo.sessionId,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(
      `Medicine order placed successfully! Order ID: ${orderId}. You will receive a confirmation shortly.`
    );
    router.push(`/order-success?orderId=${orderId}`); // Redirect to a success page
  } catch (err) {
    error.value = "Failed to place order. Please try again later.";
    console.error("Order submission error:", err);
    alert("There was an issue placing your order. Please try again.");
  } finally {
    loading.value = false;
  }
};

// Fallback image for pharmacy DP if the URL fails
const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/64?text=Pharmacy";
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

/* File input custom styling (TailwindCSS handles most) */
input[type="file"] {
  cursor: pointer;
}

/* Disabled input styling */
input:disabled,
select:disabled {
  background-color: #e5e7eb; /* Brighter disabled background */
  color: #6b7280;
  cursor: not-allowed;
}
</style>
