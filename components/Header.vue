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

    <!-- User / Auth Actions -->
    <div class="flex items-center space-x-4">
      <div v-if="authStore.isAuthenticated" class="relative">
        <button
          @click="toggleDropdown"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import { MapPinIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const authStore = useAuthStore();
const locationStore = useLocationStore();
const showDropdown = ref(false);

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

const closePopup = () => {
  authStore.showLoginPopup = false;
  authStore.otpSent = false;
  authStore.error = null;
  authStore.phoneNumber = "";
  authStore.otp = "";
  termsAccepted.value = false;
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
};

const handleLoginSubmit = async () => {
  if (!authStore.otpSent) {
    if (!termsAccepted.value) {
      authStore.error = "Please agree to Terms and Conditions";
      return;
    }
    authStore.isLoading = true;
    const response = await authStore.requestOTP(authStore.phoneNumber);
    authStore.isLoading = false;
    if (response && response.status === "otp sent") {
      authStore.error = null;
      authStore.otpSent = true;
    } else {
      authStore.error = response?.msg || "Failed to send OTP.";
    }
  } else {
    authStore.isLoading = true;
    const response = await authStore.verifyOTP(
      authStore.phoneNumber,
      authStore.otp
    );
    authStore.isLoading = false;
    if (response && response.sessionId && response.sessionId !== "0") {
      authStore.login({
        email: response.email || "",
        fullName: response.fullName || "",
        phoneNumber: response.phoneNumber,
        sessionId: response.sessionId,
      });
      closePopup();
      router.push("/");
    } else if (response && response.sessionId === "0") {
      authStore.otpSent = false;
      authStore.otp = "";
      authStore.showRegisterPopup = true;
      authStore.error = null;
    } else {
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
    address.value.pincode && address.value.town
      ? `${address.value.pincode} ${address.value.town}`
      : address.value.pincode || address.value.town,
    address.value.state,
  ]
    .filter(Boolean)
    .join(", ");

  authStore.isLoading = true;
  const success = await authStore.registerUser(
    authStore.phoneNumber,
    fullName,
    addressString,
    gender.value
  );
  authStore.isLoading = false;
  if (success) {
    authStore.showRegisterPopup = false;
    authStore.login({ phoneNumber: authStore.phoneNumber }); // Assume login after registration
    closePopup();
    router.push("/");
  }
};
</script>

<style scoped>
body {
  scroll-padding-top: 80px;
}

@media (max-width: 640px) {
  .max-w-md {
    max-width: 90%; /* Full width on small screens */
  }
}
</style>
