<template>
  <div>
    <Header />
    <WebHeaderNav />
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
      :class="{ 'pb-[72px]': isMobile }"
    >
      <div
        class="max-w-xl w-full p-6 sm:p-8 bg-white rounded-3xl shadow-2xl space-y-6 border border-gray-200 animate-fade-in-up"
      >
        <h2
          class="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center justify-center"
        >
          <i class="fas fa-user-circle text-blue-600 mr-3"></i>
          My Profile
        </h2>

        <div v-if="authStore.isAuthenticated">
          <div
            class="p-5 bg-gray-50 rounded-xl shadow-inner border border-gray-100 space-y-3"
          >
            <p
              class="text-gray-800 text-base flex flex-col sm:flex-row sm:items-center"
            >
              <strong
                class="font-semibold text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-3 w-full sm:w-auto"
              >
                <i class="fas fa-user mr-3 text-blue-500"></i>Full Name:
              </strong>
              <span class="break-words">{{ authStore.userInfo.fullName }}</span>
            </p>
            <p
              class="text-gray-800 text-base flex flex-col sm:flex-row sm:items-center"
            >
              <strong
                class="font-semibold text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-3 w-full sm:w-auto"
              >
                <i class="fas fa-phone mr-3 text-blue-500"></i>Phone Number:
              </strong>
              <span class="break-words">{{
                authStore.userInfo.phoneNumber
              }}</span>
            </p>
            <p
              class="text-gray-800 text-base flex flex-col sm:flex-row sm:items-center"
            >
              <strong
                class="font-semibold text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-3 w-full sm:w-auto"
              >
                <i class="fas fa-envelope mr-3 text-blue-500"></i>Email:
              </strong>
              <span class="break-words">{{
                authStore.userInfo.email || "Not provided"
              }}</span>
            </p>
            <p
              class="text-gray-800 text-base flex flex-col sm:flex-row sm:items-center"
            >
              <strong
                class="font-semibold text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-3 w-full sm:w-auto"
              >
                <i class="fas fa-fingerprint mr-3 text-blue-500"></i>Session ID
                (PID):
              </strong>
              <span class="break-words">{{
                authStore.userInfo.sessionId
              }}</span>
            </p>
          </div>

          <router-link
            to="/"
            class="mt-6 block w-full py-3 px-6 rounded-full shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <i class="fas fa-home mr-3"></i> Back to Home
          </router-link>
        </div>

        <div
          v-else
          class="text-center text-red-600 p-6 rounded-xl bg-white shadow-lg border border-red-200 space-y-4"
        >
          <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-2"></i>
          <p class="mb-2 text-xl font-semibold">You are not logged in.</p>
          <router-link
            to="/auth"
            class="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold text-base flex items-center justify-center"
          >
            <i class="fas fa-sign-in-alt mr-2"></i> Login here
          </router-link>
        </div>
      </div>
    </div>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Header from "@/components/Header.vue";
import WebHeaderNav from "@/components/WebHeaderNav.vue"; // Ensure this path is correct
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const authStore = useAuthStore();
const isMobile = ref(false); // Reactive state for mobile detection

// Function to update screen size status
const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 1024; // Tailwind's `lg` breakpoint for consistency
};

// On mount, attempt to restore auth state if not already authenticated.
// This is crucial if the page is directly accessed or refreshed.
onMounted(() => {
  if (!authStore.isAuthenticated) {
    authStore.restoreSession(); // Assuming your store has restoreSession for loading from localStorage
  }
  updateScreenSize(); // Set initial value for mobile detection
  window.addEventListener("resize", updateScreenSize); // Listen for changes
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize); // Clean up
});
</script>

<style scoped>
/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

/* Add padding to the bottom of the body when BottomNav is visible */
/* This is typically handled in a global CSS file or your main layout,
   but added here for clarity on how it connects to `isMobile` state */
</style>
