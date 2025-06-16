<template>
  <header
    class="bg-white shadow-md py-2 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm"
  >
    <div class="text-2xl font-bold lowercase text-gray-900">
      <img
        class="w-24 sm:w-28"
        src="../assets/rundoclogolarge.png"
        alt="Logo"
      />
    </div>

    <div class="flex items-center justify-between relative mr-5">
      <button
        @click="openLocationSelector"
        class="flex items-center space-x-1 px-3 py-2 rounded-full border-gray-300 bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center"
        aria-haspopup="true"
        :aria-expanded="showLocationSelector.toString()"
      >
        <MapPinIcon class="w-[14px] h-[14px]" />
        <span class="text-blue-600">{{
          locationStore.currentLocation || "Select City"
        }}</span>
        <ChevronDownIcon class="w-[14px] h-[14px]" />
      </button>

      <!-- DESKTOP / WEB VERSION LOCATION POPUP-->
      <transition name="modal-fade">
        <div
          v-if="showLocationSelector && !isMobileOrTablet"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen"
        >
          <div
            class="bg-white rounded-lg shadow-xl w-11/12 max-w-lg p-6 transform transition-all"
          >
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              Select City
            </h3>
            <input
              type="text"
              v-model="locationSearchQuery"
              placeholder="Search city..."
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4"
            />
            <button
              @click="detectLocation"
              class="w-full bg-blue-50 text-blue-600 py-2 rounded-md mb-4 flex items-center justify-center hover:bg-blue-100 transition"
            >
              <TargetIcon class="w-5 h-5 mr-2" />
              Detect My Location
            </button>

            <!-- City Icons -->
            <div class="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              <button
                v-for="location in filteredLocations"
                :key="location.id"
                @click="selectLocation(location.name)"
                class="flex flex-col items-center p-3 rounded-lg border hover:bg-blue-50 transition-all duration-200"
                :class="{
                  'bg-blue-100 border-blue-400 text-blue-800 font-semibold':
                    location.name === locationStore.currentLocation,
                }"
              >
                <i class="fas fa-city text-xl text-blue-600 mb-2"></i>
                <span class="text-sm text-center">{{ location.name }}</span>
              </button>
              <p
                v-if="filteredLocations.length === 0"
                class="col-span-3 text-center text-gray-500"
              >
                No cities found matching "{{ locationSearchQuery }}"
              </p>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="closeLocationSelector"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <transition name="slide-up">
      <div
        v-if="showLocationSelector && isMobileOrTablet"
        class="fixed inset-0 bg-white z-[100px] flex flex-col"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200"
        >
          <h2 class="text-xl font-semibold text-gray-800">Select City</h2>
          <button
            @click="closeLocationSelector"
            class="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="p-4 bg-white">
          <input
            type="text"
            v-model="locationSearchQuery"
            placeholder="Search city..."
            class="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base mb-4"
          />
          <button
            @click="detectLocation"
            class="w-full bg-blue-50 text-blue-600 py-3 rounded-md mb-4 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center text-base font-medium"
          >
            <TargetIcon class="w-5 h-5 mr-2" /> Detect My Location
          </button>

          <hr class="my-4 border-gray-200" />

          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            Popular Cities
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink
              v-for="location in filteredLocations"
              :key="location.id"
              @click="selectLocation(location.name)"
              :to="`/?location=${location.name}`"
              class="block text-center px-4 py-3 rounded-lg border text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200 text-sm font-medium"
              :class="{
                'bg-blue-100 border-blue-400 text-blue-800 font-semibold':
                  location.name === locationStore.currentLocation,
              }"
            >
              {{ location.name }}
            </NuxtLink>
            <p
              v-if="filteredLocations.length === 0 && locationSearchQuery"
              class="col-span-2 text-center text-sm text-gray-500 py-4"
            >
              No cities found matching "{{ locationSearchQuery }}"
            </p>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex items-center space-x-4 -z-10">
      <div v-if="authStore.isAuthenticated" class="relative">
        <button
          @click="toggleDropdown"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-haspopup="true"
          :aria-expanded="showDropdown.toString()"
        >
          {{
            authStore.userInfo.fullName
              ? authStore.userInfo.fullName.charAt(0)
              : "U"
          }}
        </button>

        <transition name="user-dropdown-transition">
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-52 sm:w-60 bg-white border border-gray-200 rounded-lg shadow-xl py-2 origin-top-right transform-gpu"
            @click.stop=""
          >
            <div class="px-4 py-2 border-b border-gray-100 mb-1">
              <p class="font-semibold text-gray-800 text-base truncate">
                {{ authStore.userInfo.fullName || "User" }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {{ authStore.userInfo.phoneNumber || "N/A" }}
              </p>
            </div>

            <NuxtLink
              :to="profileRoute"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 rounded-md mx-2"
              @click="navigateToProfile"
            >
              <UserCircleIcon class="h-5 w-5 mr-3 text-blue-500" />
              <span>View Profile Info</span>
            </NuxtLink>
            <NuxtLink
              to="/my-bookings"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 rounded-md mx-2"
              @click="navigateToBookings"
            >
              <ClipboardDocumentListIcon class="h-5 w-5 mr-3 text-blue-500" />
              <span>View Bookings</span>
            </NuxtLink>
            <hr class="my-2 border-gray-100" />
            <button
              @click="logout"
              class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150 rounded-md mx-2"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </transition>
      </div>

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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useLocationStore } from "@/stores/location";
import {
  MapPinIcon,
  ChevronDownIcon,
  XMarkIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/solid";
import { TargetIcon } from "lucide-vue-next";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();
const locationStore = useLocationStore();

const showDropdown = ref(false);
const showLocationSelector = ref(false);
const locationSearchQuery = ref("");
const locationPopover = ref(null);
const isMobileOrTablet = ref(false);

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
const serverOtp = ref("");

// Computed property for filtering locations
const filteredLocations = computed(() => {
  if (!locationSearchQuery.value) {
    return locationStore.availableLocations;
  }
  const query = locationSearchQuery.value.toLowerCase();
  return locationStore.availableLocations.filter((location) =>
    location.name.toLowerCase().includes(query)
  );
});

// Profile route
const profileRoute = computed(() => {
  const fullName = authStore.userInfo.fullName || "Unknown";
  return `/profile/${encodeURIComponent(fullName)}`;
});

// Location selector logic
const updateScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1024;
};

const openLocationSelector = () => {
  showLocationSelector.value = true;
};

const closeLocationSelector = () => {
  showLocationSelector.value = false;
  locationSearchQuery.value = "";
};

const selectLocation = (locationName) => {
  locationStore.setLocation(locationName);
  closeLocationSelector();
};

const detectLocation = async () => {
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const geoResponse = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      const detectedCity =
        geoResponse.data.address.city ||
        geoResponse.data.address.town ||
        geoResponse.data.address.village;
      if (detectedCity) {
        const foundLocation = locationStore.availableLocations.find(
          (loc) => loc.name.toLowerCase() === detectedCity.toLowerCase()
        );
        if (foundLocation) {
          locationStore.setLocation(foundLocation.name);
          alert(`Location detected: ${foundLocation.name}`);
        } else {
          locationStore.setLocation(detectedCity);
          alert(
            `Location detected: ${detectedCity}. This city might not be in our primary service list.`
          );
        }
      } else {
        alert("Could not determine city from your coordinates.");
      }
    } catch (error) {
      console.error("Geolocation or reverse geocoding error:", error);
      alert("Error detecting location. Please select manually or try again.");
    } finally {
      closeLocationSelector();
    }
  } else {
    alert("Geolocation is not supported by your browser.");
    closeLocationSelector();
  }
};

const handleClickOutsideLocationSelector = (event) => {
  const locationButton = event.target.closest(
    ".flex.items-center.space-x-2 > button"
  );
  if (
    showLocationSelector.value &&
    !isMobileOrTablet.value &&
    locationPopover.value &&
    !locationPopover.value.contains(event.target) &&
    !locationButton?.contains(event.target)
  ) {
    closeLocationSelector();
  }
};

// User dropdown
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

// Login/Register
const restrictToDigits = (event) => {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, "");
  if (input.name === "phoneNumber") {
    phoneNumberInput.value = input.value;
  } else if (input.name === "otp") {
    authStore.otp = input.value;
  }
};

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
        serverOtp.value = response.data.otp;
      } else {
        authStore.error = response.data.msg || "Failed to send OTP.";
      }
      authStore.isLoading = false;
    } else {
      if (!authStore.otp || authStore.otp.length !== 6) {
        authStore.error = "Please enter a valid 6-digit OTP";
        return;
      }
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
        // Check for stored redirect and navigate
        const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin);
          sessionStorage.removeItem("redirectAfterLogin");
        } else {
          router.push("/");
        }
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
      // Check for stored redirect and navigate
      const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
        sessionStorage.removeItem("redirectAfterLogin");
      } else {
        router.push("/");
      }
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

// Lifecycle hooks
onMounted(() => {
  locationStore.fetchLocations();
  authStore.restoreSession();
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
  document.addEventListener("click", handleClickOutsideLocationSelector);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
  document.removeEventListener("click", handleClickOutsideLocationSelector);
});

watch(showLocationSelector, (newValue) => {
  if (newValue && isMobileOrTablet.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Header Styles */
header {
  transition: all 0.3s ease;
}

/* Custom Scrollbar for desktop popover */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Transitions for Location Selector */
/* Fade & Scale for Desktop Popover */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Ease out back */
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Slide Up for Mobile Overlay */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Existing Popup Styles */
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
