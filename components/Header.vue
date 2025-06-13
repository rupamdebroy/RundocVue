<template>
  <header
    class="bg-white shadow-md py-3 px-5 sm:px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm"
  >
    <!-- Logo -->
    <div class="text-2xl font-bold lowercase text-gray-900">
      <img
        class="w-24 sm:w-28"
        src="../assets/rundoclogolarge.png"
        alt="Logo"
      />
    </div>

    <!-- Location Selector -->
    <div class="flex items-center space-x-2">
      <MapPinIcon class="w-5 h-5 text-gray-700" />
      <select
        v-model="selectedLocation"
        class="border px-2 py-1 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select Location</option>
        <option
          v-for="location in locationStore.availableLocations"
          :key="location.id"
          :value="location.name"
        >
          {{ location.name }}
        </option>
      </select>
    </div>

    <!-- User / Auth Actions -->
    <div class="flex items-center space-x-4">
      <div v-if="authStore.isAuthenticated" class="relative">
        <button
          @click="toggleDropdown"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-300 transition"
        >
          {{
            authStore.userInfo.fullName
              ? authStore.userInfo.fullName.charAt(0)
              : "U"
          }}
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-44 sm:w-48 bg-white border rounded-md shadow-lg py-2 z-50"
        >
          <NuxtLink
            :to="profileRoute"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            @click="navigateToProfile"
          >
            View Profile Info
          </NuxtLink>
          <NuxtLink
            to="/my-bookings"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            @click="navigateToBookings"
          >
            View Bookings
          </NuxtLink>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Login/Register Icon -->
      <button
        v-else
        @click="authStore.showLoginPopup = true"
        class="w-9 h-9 flex items-center justify-center border border-black text-black rounded-full hover:bg-black hover:text-white transition"
        title="Login/Register"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A11.955 11.955 0 0112 15c2.486 0 4.78.755 6.879 2.043M15 11a3 3 0 10-6 0 3 3 0 006 0z"
          />
        </svg>
      </button>
    </div>
  </header>

  <!-- Login/Register Popup -->
  <div
    v-if="authStore.showLoginPopup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
      <button
        @click="closePopup"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Login Form -->
      <div v-if="!authStore.showRegisterPopup">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ authStore.otpSent ? "Enter OTP" : "Login" }}
        </h2>
        <div v-if="authStore.error" class="text-red-500 text-sm mb-4">
          {{ authStore.error }}
        </div>
        <form @submit.prevent="handleLoginSubmit" class="space-y-4">
          <div v-if="!authStore.otpSent">
            <label class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <div class="flex items-center border rounded-md">
              <span class="px-3 text-gray-700">+91</span>
              <input
                v-model="phoneNumberInput"
                type="tel"
                maxlength="10"
                pattern="[0-9]{10}"
                class="w-full px-3 py-2 border-l rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 10-digit phone number"
                required
                @input="restrictToDigits"
              />
            </div>
            <p class="text-sm text-gray-500 mt-1">
              OTP will be sent to this number by SMS
            </p>
            <div class="flex items-center space-x-2 mt-2">
              <input
                v-model="shareOnWhatsApp"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked
              />
              <label class="text-sm text-gray-600">
                Share health tips on WhatsApp
              </label>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <input
                v-model="termsAccepted"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="text-sm text-gray-600">
                I agree to the
                <a href="#" class="text-blue-600 underline"
                  >Terms and Conditions</a
                >
              </label>
            </div>
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-700">OTP</label>
            <input
              v-model="authStore.otp"
              type="text"
              maxlength="6"
              pattern="[0-9]{6}"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
              placeholder="_ _ _ _ _ _"
              required
              @input="restrictToDigits"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            :disabled="authStore.isLoading"
          >
            <svg
              v-if="authStore.isLoading"
              class="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{
              authStore.isLoading
                ? "Processing..."
                : authStore.otpSent
                ? "Verify OTP"
                : "Send OTP"
            }}
          </button>
        </form>
      </div>

      <!-- Register Form -->
      <div v-if="authStore.showRegisterPopup">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Register</h2>
        <div v-if="authStore.error" class="text-red-500 text-sm mb-4">
          {{ authStore.error }}
        </div>
        <form @submit.prevent="handleRegisterSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >First Name</label
              >
              <input
                v-model="firstName"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Last Name</label
              >
              <input
                v-model="lastName"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last Name"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gender</label
            >
            <select
              v-model="gender"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Address</label
            >
            <input
              v-model="address.flat"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Flat/House No."
            />
            <input
              v-model="address.area"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Area"
            />
            <input
              v-model="address.landmark"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Landmark"
            />
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="address.pincode"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pincode"
              />
              <input
                v-model="address.town"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Town/City"
              />
            </div>
            <input
              v-model="address.state"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              placeholder="State"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            :disabled="authStore.isLoading"
          >
            <svg
              v-if="authStore.isLoading"
              class="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ authStore.isLoading ? "Registering..." : "Register" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import { MapPinIcon } from "@heroicons/vue/24/solid";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const showDropdown = ref(false);

// Form data
const phoneNumberInput = ref("");
const shareOnWhatsApp = ref(true);
const termsAccepted = ref(false);
const firstName = ref("");
const lastName = ref("");
const gender = ref("");
const address = ref({
  flat: "",
  area: "",
  landmark: "",
  pincode: "",
  town: "",
  state: "",
});
const serverOtp = ref(""); // Store API-provided OTP

// Location selector
const selectedLocation = computed({
  get: () => locationStore.selectedLocation,
  set: (value) => locationStore.setLocation(value),
});

// Profile route
const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

// Initialize on mount
onMounted(() => {
  locationStore.fetchLocations();
  authStore.restoreSession();
});

// Dropdown navigation
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const navigateToProfile = () => {
  showDropdown.value = false;
  router.push(profileRoute.value);
};

const navigateToBookings = () => {
  showDropdown.value = false;
  router.push("/my-bookings");
};

const logout = () => {
  authStore.logout();
  showDropdown.value = false;
  router.push("/");
};

// Restrict input to digits only
const restrictToDigits = (event) => {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, "");
  if (input.name === "phoneNumber") {
    phoneNumberInput.value = input.value;
  } else if (input.name === "otp") {
    authStore.otp = input.value;
  }
};

// Close popup and reset state
const closePopup = () => {
  authStore.showLoginPopup = false;
  authStore.showRegisterPopup = false;
  authStore.otpSent = false;
  authStore.error = null;
  authStore.phoneNumber = "";
  authStore.otp = "";
  phoneNumberInput.value = "";
  termsAccepted.value = false;
  shareOnWhatsApp.value = true;
  firstName.value = "";
  lastName.value = "";
  gender.value = "";
  address.value = {
    flat: "",
    area: "",
    landmark: "",
    pincode: "",
    town: "",
    state: "",
  };
  serverOtp.value = "";
};

// Handle login submission
const handleLoginSubmit = async () => {
  try {
    if (!authStore.otpSent) {
      if (!termsAccepted.value) {
        authStore.error = "Please agree to Terms and Conditions";
        return;
      }
      if (!phoneNumberInput.value || phoneNumberInput.value.length !== 10) {
        authStore.error = "Please enter a valid 10-digit phone number";
        return;
      }
      authStore.phoneNumber = phoneNumberInput.value;
      authStore.isLoading = true;
      const response = await axios.post(
        "https://api.rundoc.in/api/app3/Phone.php",
        { Phone: authStore.phoneNumber, request: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Rupam@98639999",
          },
        }
      );
      if (response.data.status === "otp sent") {
        authStore.error = null;
        authStore.otpSent = true;
        serverOtp.value = response.data.otp; // Store the OTP from API
      } else {
        authStore.error = response.data.msg || "Failed to send OTP.";
      }
      authStore.isLoading = false;
    } else {
      if (!authStore.otp || authStore.otp.length !== 6) {
        authStore.error = "Please enter a valid 6-digit OTP";
        return;
      }
      // Validate user-entered OTP against server OTP
      if (authStore.otp !== serverOtp.value) {
        authStore.error = "Invalid OTP. Please try again.";
        return;
      }
      authStore.isLoading = true;
      const response = await axios.post(
        "https://api.rundoc.in/api/app3/Phone.php",
        { Phone: authStore.phoneNumber, OTP: authStore.otp },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Rupam@98639999",
          },
        }
      );
      // Check if response is unexpectedly the OTP request response
      if (response.data.status === "otp sent") {
        authStore.error = "Unexpected response from server. Please try again.";
        authStore.isLoading = false;
        return;
      }
      if (response.data.sessionId && response.data.sessionId !== "0") {
        authStore.login({
          email: response.data.email || "",
          fullName: response.data.fullName || "",
          phoneNumber: response.data.phoneNumber,
          sessionId: response.data.sessionId,
        });
        closePopup();
        router.push("/");
      } else if (response.data.sessionId === "0") {
        authStore.otpSent = false;
        authStore.otp = "";
        authStore.showRegisterPopup = true;
        authStore.error = null;
      } else {
        authStore.error = response.data.msg || "Invalid OTP. Please try again.";
      }
      authStore.isLoading = false;
    }
  } catch (error) {
    authStore.error =
      error.response?.data?.msg ||
      error.response?.data?.error ||
      "An error occurred. Please try again.";
    console.error("Login error:", error);
    authStore.isLoading = false;
  }
};

// Handle registration submission
const handleRegisterSubmit = async () => {
  try {
    const fullName = `${firstName.value} ${lastName.value}`.trim();
    if (!fullName || !gender.value) {
      authStore.error = "First Name, Last Name, and Gender are required";
      return;
    }
    const addressString = [
      address.value.flat,
      address.value.area,
      address.value.landmark,
      address.value.pincode && address.value.town
        ? `${address.value.pincode} ${address.value.town}`
        : address.value.pincode || address.value.town,
      address.value.state,
    ]
      .filter(Boolean)
      .join(", ");

    authStore.isLoading = true;
    const response = await axios.post(
      "https://api.rundoc.in/api/app3/Phone.php",
      {
        Phone: authStore.phoneNumber,
        Name: fullName,
        Address: addressString,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Rupam@98639999",
        },
      }
    );
    if (response.data.sessionId && response.data.sessionId !== "0") {
      authStore.login({
        email: response.data.email || "",
        fullName: response.data.fullName || fullName,
        phoneNumber: response.data.phoneNumber,
        sessionId: response.data.sessionId,
      });
      closePopup();
      router.push("/");
    } else {
      authStore.error =
        response.data.msg || "Registration failed. Please try again.";
    }
  } catch (error) {
    authStore.error =
      error.response?.data?.msg ||
      error.response?.data?.error ||
      "An error occurred during registration. Please try again.";
    console.error("Registration error:", error);
  } finally {
    authStore.isLoading = false;
  }
};
</script>

<style scoped>
/* Header Styles */
header {
  transition: all 0.3s ease;
}

/* Popup Styles */
.max-w-md {
  max-width: 90%;
}

@media (min-width: 640px) {
  .max-w-md {
    max-width: 28rem;
  }
}

/* Form Inputs */
input,
select {
  transition: all 0.2s ease;
}

/* OTP Input */
input[pattern="[0-9]{6}"] {
  letter-spacing: 0.5rem;
  font-family: monospace;
}

/* Buttons */
.bg-blue-600 {
  transition: all 0.2s ease;
}

.bg-blue-600:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Dropdown */
.bg-white.border {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
