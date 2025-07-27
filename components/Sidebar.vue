<template>
  <div
    class="fixed top-0 left-0 h-screen bg-white shadow-lg z-[1000] transition-all duration-300"
    :class="[
      isMobileOrTablet ? 'w-full' : 'w-1/5',
      showSidebar ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800">Menu</h2>
      <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div class="p-4">
      <div class="px-4 py-2 border-b border-gray-100">
        <p class="font-semibold text-gray-800 text-sm truncate">
          {{ authStore.userInfo.fullName || "User" }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          UHID: {{ authStore.userInfo.phoneNumber || "N/A" }}
        </p>
      </div>
      <a
        href="#"
        @click.prevent="navigateToProfile"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" clip-rule="evenodd" />
        </svg>
        <span>Manage Family Members</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToAppointments"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V6H6a1 1 0 110-2h1V3a1 1 0 011-1zm5 5a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h9zm-1 2H6v4h7V9z" />
        </svg>
        <span>My Appointments</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToAddressBook"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fill-rule="evenodd" d="M2 5a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm11 1a1 1 0 00-1-1H6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6z" clip-rule="evenodd" />
        </svg>
        <span>Address Book</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToMemberships"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
        <span>My Memberships</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToOrders"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        <span>My Orders</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToTransactions"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
        </svg>
        <span>Transactions and Payments</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToHealthRecords"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
        <span>All Health Records</span>
      </a>
      <a
        href="#"
        @click.prevent="navigateToHelp"
        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 100 12 6 6 0 000-12z" clip-rule="evenodd" />
        </svg>
        <span>Need Help</span>
      </a>
      <hr class="my-2 border-gray-100" />
      <a
        href="#"
        @click.prevent="logout"
        class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
      >
        <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
        </svg>
        <span>Logout</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "#app";

defineProps({
  showSidebar: Boolean,
});

const emit = defineEmits(["update:showSidebar"]);

const authStore = useAuthStore();
const router = useRouter();

const toggleSidebar = () => {
  emit("update:showSidebar", !showSidebar);
};

const navigateToProfile = () => {
  emit("update:showSidebar", false);
  router.push(`/profile/${encodeURIComponent(authStore.userInfo.fullName || "Unknown")}`);
};

const navigateToAppointments = () => {
  emit("update:showSidebar", false);
  router.push("/my-appointments");
};

const navigateToAddressBook = () => {
  emit("update:showSidebar", false);
  router.push("/address-book");
};

const navigateToMemberships = () => {
  emit("update:showSidebar", false);
  router.push("/my-memberships");
};

const navigateToOrders = () => {
  emit("update:showSidebar", false);
  router.push("/my-orders");
};

const navigateToTransactions = () => {
  emit("update:showSidebar", false);
  router.push("/transactions");
};

const navigateToHealthRecords = () => {
  emit("update:showSidebar", false);
  router.push("/health-records");
};

const navigateToHelp = () => {
  emit("update:showSidebar", false);
  router.push("/help");
};

const logout = () => {
  authStore.logout();
  emit("update:showSidebar", false);
  router.push("/");
};
</script>

<style scoped>
/* No additional styles needed; styling is handled in the template class bindings */
</style>