<template>
  <section class="min-h-screen py-12 px-4 bg-white">
    <div v-if="loading" class="text-center text-gray-600">
      Loading doctor details...
    </div>

    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else-if="doctor" class="max-w-3xl mx-auto">
      <!-- Doctor Info -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-4">
        Booking Page for {{ doctor.name }}
      </h1>
      <p class="text-center text-gray-600 mb-8">Location: {{ location }}</p>

      <div class="p-6 border rounded shadow bg-gray-50 mb-8">
        <div class="flex items-center gap-4 mb-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Doctor Avatar"
            class="w-20 h-20 rounded-full border"
          />
          <div>
            <p class="text-xl font-semibold">{{ doctor.name }}</p>
            <p class="text-gray-600 text-sm">
              {{ doctor.degree }} • {{ doctor.specilities }}
            </p>
            <p class="text-gray-500 text-sm">
              Experience: {{ doctor.experience }} years
            </p>
          </div>
        </div>
        <p class="mb-2 text-gray-700">
          Dr. {{ doctor.name }} is an experienced senior doctor who practices in
          one of the medical specialties such as medicine. The primary goal of a
          consultant physician is to use adequate expert knowledge and skill to
          diagnose and treat patients while retaining clinical responsibility
          for their care.
        </p>
      </div>

      <!-- Schedule Section -->
      <div v-if="scheduleLoading" class="text-center text-gray-600">
        Loading schedule...
      </div>
      <div v-else-if="scheduleError" class="text-center text-red-500">
        {{ scheduleError }}
      </div>
      <div
        v-else-if="availableDates.length === 0"
        class="text-center text-gray-600"
      >
        No available slots for this doctor.
      </div>
      <div v-else>
        <!-- Available Dates -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Available Dates
        </h2>
        <div class="flex flex-wrap gap-4 mb-8">
          <button
            v-for="date in availableDates"
            :key="date"
            @click="selectDate(date)"
            :class="[
              'px-4 py-2 rounded-lg border',
              selectedDate === date
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100',
            ]"
          >
            {{ formatDate(date) }}
          </button>
        </div>

        <!-- Time Slots (Shown when a date is selected) -->
        <div v-if="selectedDate && availableSlots.length > 0">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            Available Time Slots
          </h3>
          <div class="flex flex-wrap gap-4 mb-8">
            <button
              v-for="slot in availableSlots"
              :key="slot.scheduleid"
              @click="selectSlot(slot)"
              :class="[
                'px-4 py-2 rounded-lg border',
                selectedSlot?.scheduleid === slot.scheduleid
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100',
              ]"
            >
              {{ slot.scheduletime }} ({{ slot.ticket || "Unlimited" }} tickets)
            </button>
          </div>
        </div>

        <!-- Booking Details (Shown when a slot is selected) -->
        <div v-if="selectedSlot" class="p-6 border rounded shadow bg-gray-50">
          <p class="text-xl font-semibold text-gray-800">
            {{ selectedSlot.clinicname }}
          </p>
          <p class="text-gray-700 mt-2">
            You have selected
            {{
              formatSelectedDateTime(
                selectedSlot.scheduledate,
                selectedSlot.scheduletime
              )
            }}
            click on submit button to continue.
          </p>
          <p class="text-gray-700 mt-2">Doctor Name: {{ doctor.name }}</p>
          <p class="text-gray-700 mt-2">
            Clinic address: {{ selectedSlot.ClinicA }}
          </p>
          <p class="text-gray-700 mt-2">
            Doctor Fee: ₹ {{ selectedSlot.docfee }}, Rundoc Charges: ₹
            {{ selectedSlot.pfee }}
          </p>
          <button
            @click="submitBooking"
            class="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useDoctorsStore } from "@/stores/doctors";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Route and Store
const route = useRoute();
const doctorsStore = useDoctorsStore();
const authStore = useAuthStore();
const doctorSlug = route.params.doc;
const location = route.params.location;

// Doctor State
const loading = ref(true);
const error = ref("");
const doctor = ref(null);

// Schedule State
const scheduleLoading = ref(true);
const scheduleError = ref("");
const schedule = ref({});
const selectedDate = ref("");
const selectedSlot = ref(null);

// Fetch Doctor and Schedule
onMounted(async () => {
  try {
    // Fetch Doctor from Store
    console.log(
      "[doc].vue mounted - Location:",
      location,
      "Store location:",
      doctorsStore.selectedLocation
    );
    if (
      doctorsStore.selectedLocation.toLowerCase() !== location.toLowerCase() ||
      doctorsStore.doctors.length === 0
    ) {
      console.log("Fetching doctors in [doc].vue for location:", location);
      await doctorsStore.fetchDoctors(location);
    } else {
      console.log("Using cached doctors in [doc].vue");
    }

    doctor.value = doctorsStore.doctors.find((doc) => doc.doc === doctorSlug);
    if (!doctor.value) {
      error.value = "Doctor not found in the selected location.";
      loading.value = false;
      return;
    }

    // Fetch Schedule
    try {
      const response = await axios.post(
        "https://api.rundoc.in/api/app3/doctor.php",
        JSON.stringify({ doc: doctorSlug }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Rupam@98639999",
          },
        }
      );

      console.log("Schedule API response:", response.data);
      if (Object.keys(response.data).length === 0) {
        scheduleError.value = "No schedule found for this doctor.";
      } else {
        schedule.value = response.data;
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      scheduleError.value = "Error fetching schedule. Please try again.";
    } finally {
      scheduleLoading.value = false;
    }
  } catch (err) {
    error.value = "Error fetching doctor info.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Filter Available Dates (Exclude Past Dates)
const availableDates = computed(() => {
  const today = new Date("2025-04-20"); // Current date (hardcoded as per your context)
  return Object.keys(schedule.value)
    .filter((date) => {
      const scheduleDate = new Date(date);
      return scheduleDate >= today;
    })
    .sort(); // Sort dates chronologically
});

// Available Slots for Selected Date
const availableSlots = computed(() => {
  return selectedDate.value ? schedule.value[selectedDate.value] || [] : [];
});

// Date Formatting
const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleString("en-US", { weekday: "short" });
  return `${dayName}, ${parseInt(day)} ${dateObj.toLocaleString("en-US", {
    month: "short",
  })}`;
};

// Format Selected Date and Time
const formatSelectedDateTime = (date, time) => {
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleString("en-US", { weekday: "long" });
  const day = parseInt(date.split("-")[2]);
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  return `${dayName} ${day}${getOrdinalSuffix(day)} ${month} - ${time}`;
};

// Get Ordinal Suffix (e.g., 1st, 2nd, 3rd)
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Select Date
const selectDate = (date) => {
  selectedDate.value = date;
  selectedSlot.value = null; // Reset slot when date changes
};

// Select Slot
const selectSlot = (slot) => {
  selectedSlot.value = slot;
};

// Submit Booking (Placeholder)
const submitBooking = () => {
  if (!authStore.isAuthenticated) {
    alert("Please log in to book an appointment.");
    router.push("/auth");
    return;
  }

  console.log("Booking submitted:", {
    doctor: doctor.value.name,
    scheduleid: selectedSlot.value.scheduleid,
    date: selectedSlot.value.scheduledate,
    time: selectedSlot.value.scheduletime,
    clinic: selectedSlot.value.clinicname,
    address: selectedSlot.value.ClinicA,
    docfee: selectedSlot.value.docfee,
    pfee: selectedSlot.value.pfee,
    sessionId: authStore.userInfo.sessionId, // Add PID
  });
  alert("Booking submitted! (Placeholder action)");
};
</script>

<style scoped>
/* Optional: Add Tailwind or custom styles for better UI */
button {
  transition: all 0.2s ease;
}
</style>
