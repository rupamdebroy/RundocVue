<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Request OTP -->
      <div v-if="!otpSent">
        <h2 class="text-center text-3xl font-bold text-gray-900">
          Login / Register
        </h2>
        <form @submit.prevent="requestOtp" class="mt-8 space-y-6">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <input
              id="phone"
              v-model="phone"
              type="tel"
              maxlength="10"
              pattern="[0-9]{10}"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="9876543210"
            />
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="loading"
          >
            {{ loading ? "Sending OTP..." : "Send OTP" }}
          </button>
        </form>
      </div>

      <!-- Verify OTP -->
      <div v-else-if="otpSent && !otpVerified">
        <h2 class="text-center text-3xl font-bold text-gray-900">Verify OTP</h2>
        <form @submit.prevent="verifyOtp" class="mt-8 space-y-6">
          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700"
              >Enter OTP</label
            >
            <input
              id="otp"
              v-model="otp"
              type="text"
              maxlength="6"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="123456"
            />
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="loading"
          >
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>
        </form>
      </div>

      <!-- Register New User -->
      <div v-else-if="otpVerified && isNewUser">
        <h2 class="text-center text-3xl font-bold text-gray-900">
          Complete Registration
        </h2>
        <form @submit.prevent="registerUser" class="mt-8 space-y-6">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <input
              id="phone"
              v-model="phone"
              type="tel"
              disabled
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700"
              >Address</label
            >
            <input
              id="address"
              v-model="address"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="123 Main St"
            />
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :disabled="loading"
          >
            {{ loading ? "Registering..." : "Register" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();

const phone = ref("");
const otp = ref("");
const serverOtp = ref(""); // Store OTP from API response
const name = ref("");
const address = ref("");
const otpSent = ref(false);
const otpVerified = ref(false);
const isNewUser = ref(false);
const loading = ref(false);
const error = ref("");

// Request OTP
const requestOtp = async () => {
  if (!/^\d{10}$/.test(phone.value)) {
    error.value = "Please enter a valid 10-digit phone number";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await axios.post(
      "https://api.rundoc.in/api/app3/Phone.php",
      { Phone: phone.value, request: true },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Rupam@98639999",
        },
      }
    );

    console.log("Request OTP response:", response.data);
    if (response.data.status === "otp sent") {
      otpSent.value = true;
      isNewUser.value = response.data.type === "NEW";
      serverOtp.value = response.data.otp; // Store OTP from response
    } else {
      error.value = response.data.msg || "Failed to send OTP";
    }
  } catch (err) {
    console.error("Error requesting OTP:", err);
    error.value = "Error requesting OTP. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Verify OTP
const verifyOtp = async () => {
  if (!/^\d{6}$/.test(otp.value)) {
    error.value = "Please enter a valid 6-digit OTP";
    return;
  }

  // Check if entered OTP matches server OTP
  if (otp.value !== serverOtp.value) {
    error.value = "Wrong OTP. Type the correct OTP.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const response = await axios.post(
      "https://api.rundoc.in/api/app3/Phone.php",
      { Phone: phone.value, OTP: otp.value },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Rupam@98639999",
        },
      }
    );

    console.log("Verify OTP response:", response.data);
    if (response.data.sessionId && response.data.sessionId !== "0") {
      // Success: Existing user logged in
      authStore.login({
        email: response.data.email || "",
        fullName: response.data.fullName || "",
        phoneNumber: response.data.phoneNumber,
        sessionId: response.data.sessionId,
      });
      router.push("/");
    } else if (response.data.sessionId === "0") {
      // New user: OTP verified, show registration form
      otpVerified.value = true;
    } else {
      error.value = "Invalid OTP";
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    error.value = "Error verifying OTP. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Register New User
const registerUser = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await axios.post(
      "https://api.rundoc.in/api/app3/Phone.php",
      {
        Phone: phone.value,
        Name: name.value,
        Address: address.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Rupam@98639999",
        },
      }
    );

    console.log("Register response:", response.data);
    if (response.data.sessionId && response.data.sessionId !== "0") {
      authStore.login({
        email: response.data.email || "",
        fullName: response.data.fullName,
        phoneNumber: response.data.phoneNumber,
        sessionId: response.data.sessionId,
      });
      router.push("/");
    } else {
      error.value = "Registration failed";
    }
  } catch (err) {
    console.error("Error registering user:", err);
    error.value = "Error registering user. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
