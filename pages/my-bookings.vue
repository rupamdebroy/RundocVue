<template>
  <div>
    <Header />
    <section class="min-h-screen py-8 bg-gray-50">
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">My Bookings</h1>

        <!-- Status Tabs -->
        <div class="flex space-x-4 mb-6">
          <button
            v-for="status in statuses"
            :key="status"
            @click="filterStatus = status"
            :class="[
              'px-4 py-2 rounded-md',
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700',
            ]"
          >
            {{ status }}
          </button>
        </div>

        <!-- Booking Cards -->
        <div class="space-y-6">
          <div
            v-for="booking in filteredBookings"
            :key="booking.bookingId"
            class="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <p class="font-semibold">BookingID: {{ booking.bookingId }}</p>
                <p>Booking Type: {{ booking.bookingType }}</p>
                <p>Date & Time: {{ formatDateTime(booking.dateTime) }}</p>
              </div>
            </div>
            <button
              @click="showPopup(booking)"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
          <p
            v-if="filteredBookings.length === 0"
            class="text-center text-gray-500"
          >
            No bookings found for this status.
          </p>
        </div>
      </div>

      <!-- Popup -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Booking Details</h2>
          <p><strong>BOOKING ID:</strong> {{ selectedBooking.bookingId }}</p>
          <p>
            <strong>BOOKING DATE:</strong>
            {{ formatDate(selectedBooking.dateTime) }}
          </p>
          <p>
            <strong>BOOKING TIME:</strong>
            {{ formatTime(selectedBooking.dateTime) }}
          </p>
          <p>
            <strong>BOOKING TYPE:</strong> {{ selectedBooking.bookingType }}
          </p>
          <p><strong>BOOKING STATUS:</strong> {{ selectedBooking.status }}</p>
          <p><strong>REMARK:</strong> {{ selectedBooking.remark || "N/A" }}</p>
          <button
            @click="showModal = false"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref, computed, onMounted } from "vue";
import bookingsData from "~/mock/bookings.json";

const filterStatus = ref("All");
const showModal = ref(false);
const selectedBooking = ref(null);

const statuses = ["All", "Successful", "Upcoming", "Failed", "Canceled"];

const bookings = ref(bookingsData);

const filteredBookings = computed(() => {
  if (filterStatus.value === "All") return bookings.value;
  return bookings.value.filter(
    (booking) => booking.status === filterStatus.value
  );
});

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleDateString("en-IN");
};

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString("en-IN", { timeStyle: "short" });
};

const showPopup = (booking) => {
  selectedBooking.value = booking;
  showModal.value = true;
};

onMounted(() => {
  // Simulate API fetch
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
