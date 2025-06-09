<template>
  <header
    class="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm"
  >
    <div class="text-2xl font-bold lowercase text-gray-900">rundoc</div>

    <div class="flex items-center space-x-2">
      <MapPinIcon class="w-5 h-5 text-gray-700" />
      <select
        v-model="selectedLocation"
        class="border px-2 py-1 rounded text-sm text-gray-700 focus:outline-none"
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

    <div class="flex items-center space-x-4">
      <button class="text-black hover:text-blue-600 transition">
        <MagnifyingGlassIcon class="w-6 h-6" />
      </button>
      <button class="text-black hover:text-blue-600 transition">
        <ShoppingCartIcon class="w-6 h-6" />
      </button>

      <div v-if="authStore.isAuthenticated" class="relative">
        <button
          @click="toggleDropdown"
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
        >
          {{
            authStore.userInfo.fullName
              ? authStore.userInfo.fullName.charAt(0)
              : "U"
          }}
        </button>
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50"
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

      <button
        v-else
        @click="authStore.showLoginPopup = true"
        class="px-4 py-1 border border-black text-sm text-black rounded hover:bg-black hover:text-white transition"
      >
        Login/Register
      </button>
    </div>

    <div
      v-if="authStore.showLoginPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center min-h-screen justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 v-if="!authStore.otpSent" class="text-xl font-bold mb-4">
          Sign In
        </h2>
        <h2 v-else class="text-xl font-bold mb-4">Enter OTP</h2>
        <form @submit.prevent="handleLoginSubmit" class="space-y-4">
          <div v-if="!authStore.otpSent">
            <label class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <div class="flex items-center">
              <span class="px-2 bg-gray-100 border rounded-l-md">+91</span>
              <input
                v-model="authStore.phoneNumber"
                type="tel"
                placeholder="9876543210"
                class="w-full border rounded-r-md p-2 focus:outline-none"
                required
                pattern="[0-9]{10}"
              />
            </div>
            <p class="text-sm text-gray-500 mt-1">
              OTP will be sent to this number by SMS
            </p>
            <label class="flex items-center mt-2">
              <input
                v-model="shareOnWhatsApp"
                type="checkbox"
                class="mr-2"
                checked
                disabled
              />
              <span class="text-sm text-gray-700"
                >Share health tips, appointment details, and offers with me on
                WhatsApp</span
              >
            </label>
            <label class="flex items-center mt-2">
              <input
                v-model="termsAccepted"
                type="checkbox"
                class="mr-2"
                required
              />
              <span class="text-sm text-gray-700"
                >Agree to Terms and Conditions</span
              >
            </label>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {{ authStore.isLoading ? "Sending..." : "Continue" }}
            </button>
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-700"
              >Enter OTP</label
            >
            <input
              v-model="authStore.otp"
              type="text"
              placeholder="123456"
              class="w-full border rounded-md p-2 focus:outline-none"
              required
              pattern="[0-9]{6}"
            />
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {{ authStore.isLoading ? "Verifying..." : "Submit" }}
            </button>
          </div>
        </form>
        <button
          @click="
            authStore.showLoginPopup = false;
            authStore.otpSent = false;
            authStore.error = null;
          "
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
        <p v-if="authStore.error" class="mt-2 text-red-500 text-sm">
          {{ authStore.error }}
        </p>
      </div>
    </div>

    <div
      v-if="authStore.showRegisterPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center min-h-screen justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Register</h2>
        <form @submit.prevent="handleRegisterSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >First Name *</label
            >
            <input
              v-model="firstName"
              type="text"
              class="w-full border rounded-md p-2 focus:outline-none"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Last Name *</label
            >
            <input
              v-model="lastName"
              type="text"
              class="w-full border rounded-md p-2 focus:outline-none"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gender *</label
            >
            <select
              v-model="gender"
              class="w-full border rounded-md p-2 focus:outline-none"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Flat, House no., Building, Company, Apartment</label
            >
            <input
              v-model="address.flat"
              type="text"
              class="w-full border rounded-md p-2 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Area, Street, Sector, Village</label
            >
            <input
              v-model="address.area"
              type="text"
              class="w-full border rounded-md p-2 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Landmark</label
            >
            <input
              v-model="address.landmark"
              type="text"
              class="w-full border rounded-md p-2 focus:outline-none"
            />
          </div>
          <div class="flex space-x-2">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700"
                >Pincode</label
              >
              <input
                v-model="address.pincode"
                type="text"
                class="w-full border rounded-md p-2 focus:outline-none"
                pattern="[0-9]{6}"
              />
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700"
                >Town/City</label
              >
              <input
                v-model="address.town"
                type="text"
                class="w-full border rounded-md p-2 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">State</label>
            <select
              v-model="address.state"
              class="w-full border rounded-md p-2 focus:outline-none"
            >
              <option value="" disabled>Select State</option>
              <option value="Tripura">Tripura</option>
              <option value="Assam">Assam</option>
            </select>
          </div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {{ authStore.isLoading ? "Registering..." : "Register" }}
          </button>
        </form>
        <button
          @click="
            authStore.showRegisterPopup = false;
            authStore.error = null;
          "
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Close
        </button>
        <p v-if="authStore.error" class="mt-2 text-red-500 text-sm">
          {{ authStore.error }}
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  MapPinIcon,
} from "@heroicons/vue/24/solid";

const router = useRouter();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const showDropdown = ref(false);

// Bind selectedLocation to the store
const selectedLocation = computed({
  get: () => locationStore.selectedLocation,
  set: (value) => locationStore.setLocation(value),
});

const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

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

onMounted(() => {
  locationStore.fetchLocations();
  authStore.restoreSession();
});

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

const handleLoginSubmit = async () => {
  // If OTP has not been sent yet (first step of login)
  if (!authStore.otpSent) {
    if (!termsAccepted.value) {
      authStore.error = "Please agree to Terms and Conditions";
      return;
    }
    const response = await authStore.requestOTP(authStore.phoneNumber);
    if (response && response.status === "otp sent") {
      authStore.error = null; // Clear error on success
      authStore.otpSent = true; // Crucial: set otpSent to true here
    } else {
      authStore.otpSent = false; // Reset if OTP request fails
      authStore.error = response?.msg || "Failed to send OTP.";
    }
  } else {
    // If OTP has been sent (second step, verifying OTP)
    const response = await authStore.verifyOTP(
      authStore.phoneNumber,
      authStore.otp
    );

    if (response && response.sessionId && response.sessionId !== "0") {
      // Existing user: logged in successfully
      authStore.login({
        email: response.email || "",
        fullName: response.fullName || "",
        phoneNumber: response.phoneNumber,
        sessionId: response.sessionId,
      });
      authStore.showLoginPopup = false; // Close popup on successful login
      authStore.otpSent = false; // Reset OTP state
      authStore.otp = ""; // Clear OTP input
      authStore.error = null; // Clear any errors
      router.push("/"); // Redirect to home or dashboard
    } else if (response && response.sessionId === "0") {
      // New user: OTP verified, now show registration popup
      authStore.otpSent = false; // Reset OTP state for future logins
      authStore.otp = ""; // Clear OTP input
      authStore.showLoginPopup = false; // Close login popup
      authStore.showRegisterPopup = true; // Open registration popup
      authStore.error = null; // Clear any errors
    } else {
      // Failed OTP verification
      authStore.error = response?.msg || "Invalid OTP. Please try again.";
    }
  }
};

const handleRegisterSubmit = async () => {
  const fullName = `${firstName.value} ${lastName.value}`.trim();
  if (!fullName || !gender.value) {
    authStore.error = "First Name, Last Name, and Gender are required";
    return;
  }
  const addressString = [
    address.value.flat,
    address.value.area,
    address.value.landmark,
    // Ensure pincode and town are together if both exist
    address.value.pincode && address.value.town
      ? `${address.value.pincode} ${address.value.town}`
      : address.value.pincode || address.value.town,
    address.value.state,
  ]
    .filter(Boolean)
    .join(", ");

  const success = await authStore.registerUser(
    authStore.phoneNumber,
    fullName,
    addressString,
    gender.value // Pass gender to registerUser
  );

  if (success) {
    authStore.showRegisterPopup = false;
    // The `registerUser` function in your auth store should handle logging in the user
    // after successful registration and setting the authStore.isAuthenticated state.
    // If it doesn't, you might need to add authStore.login() call here based on its return.
    authStore.error = null; // Clear error on successful registration
    router.push("/"); // Redirect after registration
  }
};
</script>

<style scoped>
body {
  scroll-padding-top: 80px;
}
</style>
