<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
  >
    <div class="max-w-md w-full space-y-8">
      <h2 class="text-center text-3xl font-bold text-gray-900">
        Profile Information
      </h2>
      <div
        v-if="authStore.isAuthenticated"
        class="p-6 bg-white border rounded-md shadow-sm"
      >
        <p class="text-gray-700">
          <strong>Full Name:</strong> {{ authStore.userInfo.fullName }}
        </p>
        <p class="text-gray-700">
          <strong>Phone Number:</strong> {{ authStore.userInfo.phoneNumber }}
        </p>
        <p class="text-gray-700">
          <strong>Email:</strong>
          {{ authStore.userInfo.email || "Not provided" }}
        </p>
        <p class="text-gray-700">
          <strong>Session ID (PID):</strong> {{ authStore.userInfo.sessionId }}
        </p>
        <router-link
          to="/"
          class="mt-6 inline-block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
        >
          Back to Home
        </router-link>
      </div>
      <div v-else class="text-center text-red-500">
        <p>You are not logged in.</p>
        <router-link to="/auth" class="text-green-600 hover:underline"
          >Login here</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>
