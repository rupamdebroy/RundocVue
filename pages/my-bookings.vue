<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section
      class="min-h-screen bg-gray-100 py-8 sm:py-12 lg:py-10"
      :class="{ 'pb-[72px]': isMobile }"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-8 sm:mb-10">
          <h1
            class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in-down"
          >
            <i class="fas fa-clipboard-list text-blue-600 mr-3"></i>My Bookings
          </h1>
          <p
            class="text-base text-gray-700 max-w-2xl mx-auto animate-fade-in-up"
          >
            Track and manage all your Rundoc service bookings in one place.
          </p>
        </div>

        <div
          class="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-in-up delay-200 p-2 bg-white rounded-xl shadow-sm"
        >
          <button
            v-for="status in statuses"
            :key="status.value"
            @click="filterStatus = status.value"
            :class="[
              'px-5 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center',
              filterStatus === status.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            <i :class="[status.icon, 'mr-2']"></i> {{ status.label }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="booking in filteredBookings"
            :key="booking.bookingId"
            class="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col"
          >
            <div class="flex items-center space-x-3 mb-4">
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full text-xl"
                :class="getBookingTypeIconClass(booking.bookingType)"
              >
                <i :class="getBookingTypeIcon(booking.bookingType)"></i>
              </div>
              <div>
                <p class="font-bold text-base text-blue-700">
                  <i class="fas fa-receipt mr-2 text-blue-500"></i>
                  #{{ booking.bookingId }}
                </p>
                <p class="text-gray-800 text-sm flex items-center mt-1">
                  <i class="fas fa-tag mr-2 text-gray-500"></i>
                  {{ booking.bookingType }}
                </p>
              </div>
            </div>

            <p class="text-gray-600 text-sm flex items-center mb-2">
              <i class="fas fa-calendar-alt mr-2 text-gray-500"></i>
              {{ formatDateTime(booking.dateTime) }}
            </p>

            <span
              :class="getBookingStatusClass(booking.status)"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 self-start"
            >
              <i :class="getBookingStatusIcon(booking.status)" class="mr-1"></i>
              {{ booking.status }}
            </span>

            <button
              @click="showPopup(booking)"
              class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out font-semibold text-sm flex items-center justify-center self-end w-full sm:w-auto"
            >
              <i class="fas fa-info-circle mr-2"></i> View Details
            </button>
          </div>

          <p
            v-if="filteredBookings.length === 0"
            class="text-center text-xl text-gray-600 p-8 rounded-xl bg-white shadow-md mt-10 md:col-span-2 lg:col-span-3"
          >
            <i class="fas fa-calendar-times text-gray-500 text-4xl mb-4"></i>
            <br />
            No bookings found for the selected status.
          </p>
        </div>
      </div>

      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative animate-scale-in"
        >
          <button
            @click="showModal = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl focus:outline-none"
            aria-label="Close modal"
          >
            <i class="fas fa-times"></i>
          </button>

          <h2
            class="text-xl sm:text-2xl font-bold text-gray-900 mb-5 flex items-center"
          >
            <i class="fas fa-clipboard-check text-blue-600 mr-3"></i>Booking
            Details
          </h2>

          <div class="space-y-2 text-gray-800 text-sm">
            <p class="flex flex-col sm:flex-row sm:items-center">
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i class="fas fa-id-badge mr-2 text-blue-500"></i>BOOKING ID:
              </strong>
              <span class="font-semibold break-words">{{
                selectedBooking.bookingId
              }}</span>
            </p>
            <p class="flex flex-col sm:flex-row sm:items-center">
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>DATE:
              </strong>
              <span class="break-words">{{
                formatDate(selectedBooking.dateTime)
              }}</span>
            </p>
            <p class="flex flex-col sm:flex-row sm:items-center">
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i class="fas fa-clock mr-2 text-blue-500"></i>TIME:
              </strong>
              <span class="break-words">{{
                formatTime(selectedBooking.dateTime)
              }}</span>
            </p>
            <p class="flex flex-col sm:flex-row sm:items-center">
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i class="fas fa-tag mr-2 text-blue-500"></i>TYPE:
              </strong>
              <span class="break-words">{{ selectedBooking.bookingType }}</span>
            </p>
            <p class="flex flex-col sm:flex-row sm:items-center">
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i
                  :class="getBookingStatusIcon(selectedBooking.status)"
                  class="mr-2 text-blue-500"
                ></i
                >STATUS:
              </strong>
              <span
                :class="getBookingStatusClass(selectedBooking.status)"
                class="break-words"
              >
                {{ selectedBooking.status }}
              </span>
            </p>
            <p
              class="flex flex-col sm:flex-row sm:items-center"
              v-if="selectedBooking.remark"
            >
              <strong
                class="flex-shrink-0 w-28 sm:w-32 text-gray-600 flex items-center mb-1 sm:mb-0 sm:mr-2"
              >
                <i class="fas fa-comment-alt mr-2 text-blue-500"></i>REMARK:
              </strong>
              <span class="break-words">{{ selectedBooking.remark }}</span>
            </p>
          </div>

          <div class="flex justify-center mt-6">
            <button
              @click="showModal = false"
              class="px-8 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 font-semibold"
            >
              Close
            </button>
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
import WebHeaderNav from "@/components/WebHeaderNav.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";

// Mock data (replace with actual API fetch)
const bookingsData = [
  {
    bookingId: "RNDOC-AMB-001",
    bookingType: "Ambulance Service",
    dateTime: "2025-06-15T10:00:00Z",
    status: "Successful",
    remark: "Patient safely transported to City Hospital.",
  },
  {
    bookingId: "RNDOC-DOC-002",
    bookingType: "Doctor Appointment",
    dateTime: "2025-06-20T14:30:00Z",
    status: "Upcoming",
    remark: null,
  },
  {
    bookingId: "RNDOC-BLO-003",
    bookingType: "Blood Donation",
    dateTime: "2025-06-10T11:00:00Z",
    status: "Failed",
    remark: "Donor was unable to meet eligibility criteria on the day.",
  },
  {
    bookingId: "RNDOC-AMB-004",
    bookingType: "Ambulance Service",
    dateTime: "2025-05-25T08:15:00Z",
    status: "Canceled",
    remark: "Service no longer required as patient recovered unexpectedly.",
  },
  {
    bookingId: "RNDOC-DOC-005",
    bookingType: "Doctor Appointment",
    dateTime: "2025-07-01T09:00:00Z",
    status: "Upcoming",
    remark: "Follow-up check-up with Dr. Sharma for general health review.",
  },
];

const filterStatus = ref("All");
const showModal = ref(false);
const selectedBooking = ref(null);
const isMobile = ref(false); // Reactive state for mobile detection

const statuses = [
  { label: "All", value: "All", icon: "fas fa-list-alt" },
  { label: "Successful", value: "Successful", icon: "fas fa-check-circle" },
  { label: "Upcoming", value: "Upcoming", icon: "fas fa-clock" },
  { label: "Failed", value: "Failed", icon: "fas fa-times-circle" },
  { label: "Canceled", value: "Canceled", icon: "fas fa-ban" },
];

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

// Helper function to get status badge classes
const getBookingStatusClass = (status) => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-800";
    case "Upcoming":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    case "Canceled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get status icon
const getBookingStatusIcon = (status) => {
  switch (status) {
    case "Successful":
      return "fas fa-check-circle";
    case "Upcoming":
      return "fas fa-clock";
    case "Failed":
      return "fas fa-times-circle";
    case "Canceled":
      return "fas fa-ban";
    default:
      return "fas fa-info-circle";
  }
};

// Helper function to get booking type icon
const getBookingTypeIcon = (type) => {
  switch (type) {
    case "Ambulance Service":
      return "fas fa-ambulance";
    case "Doctor Appointment":
      return "fas fa-user-md";
    case "Blood Donation":
      return "fas fa-tint";
    default:
      return "fas fa-medkit";
  }
};

// Helper function to get booking type icon background/text color
const getBookingTypeIconClass = (type) => {
  switch (type) {
    case "Ambulance Service":
      return "bg-red-100 text-red-600";
    case "Doctor Appointment":
      return "bg-blue-100 text-blue-600";
    case "Blood Donation":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Function to update screen size status for mobile check
const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 1024; // Consistency with other components
};

onMounted(() => {
  // In a real application, you would fetch bookings data here
  // e.g., bookings.value = await fetchBookingsApi();
  updateScreenSize(); // Set initial value
  window.addEventListener("resize", updateScreenSize); // Listen for changes
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize); // Clean up
});
</script>

<style scoped>
/* No changes needed here, Tailwind handles most. */
/* Just ensure the `container` max-width is still desired */
.container {
  max-width: 1200px;
}

/* Animations (already good, no changes needed) */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}

.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
