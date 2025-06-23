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
          class="bg-white p-4 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl relative animate-scale-in mx-auto overflow-y-auto"
          style="max-height: 90vh"
        >
          <button
            @click="showModal = false"
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl focus:outline-none p-1"
            aria-label="Close modal"
          >
            <i class="fas fa-times"></i>
          </button>
          <h2
            class="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center justify-center sm:justify-start text-center sm:text-left"
          >
            <i class="fas fa-clipboard-check text-blue-600 mr-2"></i>Booking
            Details
          </h2>
          <div class="space-y-2 text-gray-700 text-xs sm:text-sm">
            <template
              v-if="selectedBooking.bookingType === 'Doctor Appointment'"
            >
              <div class="grid grid-cols-1 gap-1">
                <p>
                  <strong>Doctor Name:</strong>
                  {{ selectedBooking.doctorDetails.doctorName }}
                </p>
                <p>
                  <strong>Consultancy Fee:</strong> ₹{{
                    selectedBooking.doctorDetails.consultancyFee
                  }}
                </p>
                <p>
                  <strong>Payment Status:</strong>
                  {{ selectedBooking.doctorDetails.paymentStatus }}
                </p>
                <p>
                  <strong>Date:</strong>
                  {{ selectedBooking.appointmentDetails.appointmentDate }}
                </p>
                <p>
                  <strong>Time:</strong>
                  {{ selectedBooking.appointmentDetails.appointmentTime }}
                </p>
                <p>
                  <strong>Serial Number:</strong>
                  {{ selectedBooking.appointmentDetails.serialNumber }}
                </p>
                <p>
                  <strong>Clinic Name:</strong>
                  {{ selectedBooking.clinicDetails.clinicName }}
                </p>
                <p>
                  <strong>Address:</strong>
                  {{ selectedBooking.clinicDetails.clinicAddress }}
                  <i class="fas fa-map-marker-alt ml-1 text-blue-500"></i>
                </p>
                <p>
                  <strong>Patient Name:</strong>
                  {{ selectedBooking.patientDetails.patientName }}
                </p>
                <p>
                  <strong>Gender:</strong>
                  {{ selectedBooking.patientDetails.gender }}
                </p>
                <p>
                  <strong>Age:</strong> {{ selectedBooking.patientDetails.age }}
                </p>
                <p>
                  <strong>Platform Fee:</strong> ₹{{
                    selectedBooking.charges.platformFee
                  }}
                </p>
                <p>
                  <strong>Payment Status:</strong>
                  {{ selectedBooking.charges.paymentStatus }}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{{
                    selectedBooking.paymentDetails.totalPaid
                  }}
                </p>
                <p>
                  <strong>Download Receipt:</strong>
                  <a
                    :href="selectedBooking.paymentDetails.receiptUrl"
                    class="text-blue-500 hover:underline"
                    >Download</a
                  >
                </p>
              </div>
            </template>

            <template
              v-if="selectedBooking.bookingType === 'Lab Test & Diagnostics'"
            >
              <div class="grid grid-cols-1 gap-1">
                <p>
                  <strong>Patient Name:</strong>
                  {{ selectedBooking.patientDetails.patientName }}
                </p>
                <p>
                  <strong>Gender:</strong>
                  {{ selectedBooking.patientDetails.gender }}
                </p>
                <p>
                  <strong>Age:</strong> {{ selectedBooking.patientDetails.age }}
                </p>
                <p v-if="selectedBooking.patientDetails.homeCollectionAddress">
                  <strong>Home Collection Address:</strong>
                  {{ selectedBooking.patientDetails.homeCollectionAddress }}
                </p>
                <p>
                  <strong>Uploaded Copy:</strong>
                  <a
                    :href="selectedBooking.patientDetails.uploadedCopy"
                    class="text-blue-500 hover:underline"
                    >View</a
                  >
                </p>
                <p v-if="selectedBooking.patientDetails.note">
                  <strong>Note:</strong>
                  {{ selectedBooking.patientDetails.note }}
                </p>
                <p>
                  <strong>Report:</strong>
                  <a
                    v-if="selectedBooking.testDetails.reportAvailable"
                    :href="selectedBooking.testDetails.reportUrl"
                    class="text-blue-500 hover:underline"
                    >Download</a
                  ><span v-else class="text-gray-500"
                    >Report not generated</span
                  >
                </p>
                <p>
                  <strong>Clinic Name:</strong>
                  {{ selectedBooking.labDetails.clinicName }}
                </p>
                <p>
                  <strong>Address:</strong>
                  {{ selectedBooking.labDetails.clinicAddress }}
                  <i class="fas fa-map-marker-alt ml-1 text-blue-500"></i>
                </p>
                <p>
                  <strong>Date:</strong>
                  {{ selectedBooking.appointmentDetails.appointmentDate }}
                </p>
                <p>
                  <strong>Time:</strong>
                  {{ selectedBooking.appointmentDetails.appointmentTime }}
                </p>
                <p>
                  <strong>Home Collection:</strong>
                  {{ selectedBooking.appointmentDetails.homeCollection }}
                </p>
                <p
                  v-if="
                    selectedBooking.appointmentDetails.homeCollection === 'Yes'
                  "
                >
                  <strong>Sample Collector:</strong>
                  {{ selectedBooking.appointmentDetails.sampleCollector }}
                </p>
                <p>
                  <strong>Platform Fee:</strong> ₹{{
                    selectedBooking.charges.platformFee
                  }}
                </p>
                <p>
                  <strong>Test Charges:</strong> ₹{{
                    selectedBooking.charges.testCharges
                  }}
                </p>
                <p>
                  <strong>Diagnostic Charges:</strong> ₹{{
                    selectedBooking.charges.diagnosticCharges
                  }}
                </p>
                <p>
                  <strong>Home Collection Charges:</strong>
                  {{ selectedBooking.charges.homeCollectionCharges }}
                </p>
                <p>
                  <strong>Total Charges:</strong> ₹{{
                    selectedBooking.charges.totalCharges
                  }}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{{
                    selectedBooking.paymentDetails.totalPaid
                  }}
                </p>
                <p>
                  <strong>Download Receipt:</strong>
                  <a
                    :href="selectedBooking.paymentDetails.receiptUrl"
                    class="text-blue-500 hover:underline"
                    >Download</a
                  >
                </p>
              </div>
            </template>

            <template v-if="selectedBooking.bookingType === 'Medicine'">
              <div class="grid grid-cols-1 gap-1">
                <p>
                  <strong>Patient Name:</strong>
                  {{ selectedBooking.patientDetails.patientName }}
                </p>
                <p>
                  <strong>Gender:</strong>
                  {{ selectedBooking.patientDetails.gender }}
                </p>
                <p>
                  <strong>Age:</strong> {{ selectedBooking.patientDetails.age }}
                </p>
                <p>
                  <strong>Delivery Address:</strong>
                  {{ selectedBooking.patientDetails.deliveryAddress }}
                </p>
                <p>
                  <strong>Uploaded Copy:</strong>
                  <a
                    :href="selectedBooking.patientDetails.uploadedCopy"
                    class="text-blue-500 hover:underline"
                    >View</a
                  >
                </p>
                <p v-if="selectedBooking.patientDetails.note">
                  <strong>Note:</strong>
                  {{ selectedBooking.patientDetails.note }}
                </p>
                <p>
                  <strong>Chemist Name:</strong>
                  {{ selectedBooking.chemistDetails.chemistName }}
                </p>
                <p>
                  <strong>Address:</strong>
                  {{ selectedBooking.chemistDetails.chemistAddress }}
                  <i class="fas fa-map-marker-alt ml-1 text-blue-500"></i>
                </p>
                <p>
                  <strong>Order Type:</strong>
                  {{ selectedBooking.orderDetails.orderType }}
                </p>
                <p>
                  <strong>Order Date:</strong>
                  {{ selectedBooking.orderDetails.orderDate }}
                </p>
                <p>
                  <strong>Order Time:</strong>
                  {{ selectedBooking.orderDetails.orderTime }}
                </p>
                <p>
                  <strong>Status:</strong>
                  {{ selectedBooking.orderDetails.status }}
                </p>
                <p>
                  <strong>Delivery Agent:</strong>
                  {{ selectedBooking.orderDetails.deliveryAgent }}
                </p>
                <p>
                  <strong>Agent Contact:</strong>
                  {{ selectedBooking.orderDetails.deliveryAgentContact }}
                </p>
                <p>
                  <strong>Platform Fee:</strong> ₹{{
                    selectedBooking.charges.platformFee
                  }}
                </p>
                <p>
                  <strong>Delivery Charges:</strong> ₹{{
                    selectedBooking.charges.deliveryCharges
                  }}
                </p>
                <p>
                  <strong>Total Item Value:</strong> ₹{{
                    selectedBooking.charges.totalItemValue
                  }}
                </p>
                <p>
                  <strong>Total Charges:</strong> ₹{{
                    selectedBooking.charges.totalCharges
                  }}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{{
                    selectedBooking.paymentDetails.totalPaid
                  }}
                </p>
                <p>
                  <strong>Download Receipt:</strong>
                  <a
                    :href="selectedBooking.paymentDetails.receiptUrl"
                    class="text-blue-500 hover:underline"
                    >Download</a
                  >
                </p>
              </div>
            </template>

            <template v-if="selectedBooking.bookingType === 'Ambulance'">
              <div class="grid grid-cols-1 gap-1">
                <p>
                  <strong>Patient Name:</strong>
                  {{ selectedBooking.patientDetails.patientName }}
                </p>
                <p>
                  <strong>Gender:</strong>
                  {{ selectedBooking.patientDetails.gender }}
                </p>
                <p>
                  <strong>Age:</strong> {{ selectedBooking.patientDetails.age }}
                </p>
                <p>
                  <strong>Pickup Address:</strong>
                  {{ selectedBooking.patientDetails.pickupAddress }}
                </p>
                <p>
                  <strong>Destination Address:</strong>
                  {{ selectedBooking.patientDetails.destinationAddress }}
                </p>
                <p v-if="selectedBooking.patientDetails.note">
                  <strong>Note:</strong>
                  {{ selectedBooking.patientDetails.note }}
                </p>
                <p>
                  <strong>Booking Date:</strong>
                  {{ selectedBooking.bookingDetails.bookingDate }}
                </p>
                <p>
                  <strong>Booking Time:</strong>
                  {{ selectedBooking.bookingDetails.bookingTime }}
                </p>
                <p>
                  <strong>Vehicle Number:</strong>
                  {{ selectedBooking.ambulanceDetails.vehicleNumber }}
                </p>
                <p>
                  <strong>Driver Name:</strong>
                  {{ selectedBooking.ambulanceDetails.driverName }}
                </p>
                <p>
                  <strong>Contact Number:</strong>
                  {{ selectedBooking.ambulanceDetails.contactNumber }}
                </p>
                <p>
                  <strong>Platform Fee:</strong> ₹{{
                    selectedBooking.charges.platformFee
                  }}
                </p>
                <p>
                  <strong>Ambulance Charges:</strong> ₹{{
                    selectedBooking.charges.ambulanceCharges
                  }}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{{
                    selectedBooking.paymentDetails.totalPaid
                  }}
                </p>
                <p>
                  <strong>Download Receipt:</strong>
                  <a
                    :href="selectedBooking.paymentDetails.receiptUrl"
                    class="text-blue-500 hover:underline"
                    >Download</a
                  >
                </p>
              </div>
            </template>
          </div>
          <div class="flex justify-center mt-4">
            <button
              @click="showModal = false"
              class="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300 font-semibold text-sm"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import Header from "@/components/Header.vue";
import WebHeaderNav from "@/components/WebHeaderNav.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { bookingsData } from "@/mock/bookingsData"; // Import the mock data

const filterStatus = ref("All");
const showModal = ref(false);
const selectedBooking = ref(null);
const isMobile = ref(false);

const statuses = [
  { label: "All", value: "All", icon: "fas fa-list-alt" },
  { label: "Successful", value: "Successful", icon: "fas fa-check-circle" },
  { label: "Upcoming", value: "Upcoming", icon: "fas fa-clock" },
  { label: "Dispatched", value: "Dispatched", icon: "fas fa-truck" },
  { label: "Delivered", value: "Delivered", icon: "fas fa-check" },
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

const getBookingStatusClass = (status) => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-800";
    case "Upcoming":
      return "bg-yellow-100 text-yellow-800";
    case "Dispatched":
      return "bg-blue-100 text-blue-600";
    case "Delivered":
      return "bg-blue-200 text-blue-600";
    case "Failed":
      return "bg-red-100 text-red-800";
    case "Canceled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getBookingStatusIcon = (status) => {
  switch (status) {
    case "Successful":
      return "fas fa-check-circle";
    case "Upcoming":
      return "fas fa-clock";
    case "Dispatched":
      return "fas fa-truck";
    case "Delivered":
      return "fas fa-check";
    case "Failed":
      return "fas fa-times-circle";
    case "Canceled":
      return "fas fa-ban";
    default:
      return "fas fa-info-circle";
  }
};

const getBookingTypeIcon = (bookingType) => {
  switch (bookingType) {
    case "Doctor Appointment":
      return "fas fa-user-md";
    case "Medicine":
      return "fas fa-prescription-bottle-alt";
    case "Lab Test & Diagnostics":
      return "fas fa-vial";
    case "Ambulance":
      return "fas fa-ambulance";
    default:
      return "fas fa-medkit";
  }
};

const getBookingTypeIconClass = (bookingType) => {
  switch (bookingType) {
    case "Doctor Appointment":
      return "bg-blue-100 text-blue-600";
    case "Medicine":
      return "bg-green-100 text-green-600";
    case "Lab Test & Diagnostics":
      return "bg-yellow-100 text-yellow-600";
    case "Ambulance":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 1024;
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
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
