<template>
  <section class="relative bg-white text-gray-900 overflow-hidden">
    <div class="max-w-4xl mx-auto px-4 py-12 text-center relative z-20">
      <!-- Search Input (Now on Top) -->
      <div class="relative mx-auto max-w-2xl w-full mb-12">
        <input
          type="text"
          :placeholder="currentPlaceholder"
          @input="handleSearch"
          class="w-full py-3 px-6 text-md rounded-full border border-gray-300 bg-gray-100 poppins-regular focus:outline-none focus:ring-1 focus:ring-gray-800 transition-all duration-300 text-gray-900 placeholder-gray-500"
        />
        <div
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          <MagnifyingGlassIcon class="w-6 h-6" />
        </div>

        <div
          v-if="searchResults.length > 0"
          class="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto text-left"
        >
          <NuxtLink
            v-for="result in searchResults"
            :key="result.id"
            :to="
              result.type === 'doctor'
                ? `/find-doctor?location=${locationStore.currentLocation}`
                : `/clinics`
            "
            class="block px-4 py-3 text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-200 outfit-regular"
          >
            {{ result.name }} ({{
              result.type === "doctor" ? "Doctor" : "Clinic"
            }})
          </NuxtLink>
        </div>
      </div>

      <!-- Horizontal Banner (Now Below Search) -->
      <div
        class="w-full bg-gray-200 rounded-xl shadow-md h-36 flex items-center justify-center"
      >
        <span class="text-base text-gray-700 font-medium"
          >Horizontal Ad Banner</span
        >
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useLocationStore } from "@/stores/location";

// Location Store
const locationStore = useLocationStore();

// Animated Placeholder in Search Input
const currentPlaceholder = ref("Search Doctor");
const placeholderOptions = [
  "Search Doctor",
  "Search Clinic",
  "Search Hospital",
  "Lab Tests & Diagnostics",
  "Medicines",
  "Ambulance",
  "Home Care Service",
  "Blood Donor",
];

let placeholderIndex = 0;
let placeholderInterval = null;
const animatePlaceholder = () => {
  placeholderIndex = (placeholderIndex + 1) % placeholderOptions.length;
  currentPlaceholder.value = placeholderOptions[placeholderIndex];
};

onMounted(() => {
  placeholderInterval = setInterval(animatePlaceholder, 2000);
});

onUnmounted(() => {
  clearInterval(placeholderInterval);
});

// Search Logic (Mock)
const searchResults = ref([]);
const mockData = [
  // Doctors
  {
    id: 1,
    name: "Dr. John Doe (Cardiologist)",
    type: "doctor",
    specialty: "Cardiology",
  },
  {
    id: 2,
    name: "Dr. Jane Smith (Pediatrician)",
    type: "doctor",
    specialty: "Pediatrics",
  },
  {
    id: 3,
    name: "Dr. Alex Johnson (Dermatologist)",
    type: "doctor",
    specialty: "Dermatology",
  },
  {
    id: 4,
    name: "Dr. Emily White (General Physician)",
    type: "doctor",
    specialty: "General Medicine",
  },
  {
    id: 5,
    name: "Dr. Michael Brown (Orthopedic Surgeon)",
    type: "doctor",
    specialty: "Orthopedics",
  },
  {
    id: 6,
    name: "Dr. Sarah Davis (Gynecologist)",
    type: "doctor",
    specialty: "Gynecology",
  },
  {
    id: 7,
    name: "Dr. Robert Green (Neurologist)",
    type: "doctor",
    specialty: "Neurology",
  },
  {
    id: 8,
    name: "Dr. Olivia Wilson (Ophthalmologist)",
    type: "doctor",
    specialty: "Ophthalmology",
  },
  {
    id: 9,
    name: "Dr. David Lee (ENT Specialist)",
    type: "doctor",
    specialty: "ENT",
  },
  {
    id: 10,
    name: "Dr. Sophia Miller (Psychiatrist)",
    type: "doctor",
    specialty: "Psychiatry",
  },
  {
    id: 11,
    name: "Dr. William Taylor (Urologist)",
    type: "doctor",
    specialty: "Urology",
  },
  {
    id: 12,
    name: "Dr. Isabella Martinez (Endocrinologist)",
    type: "doctor",
    specialty: "Endocrinology",
  },

  // Clinics
  { id: 101, name: "City Care Clinic", type: "clinic", location: "Downtown" },
  {
    id: 102,
    name: "HealthFirst Medical Center",
    type: "clinic",
    location: "Northside",
  },
  {
    id: 103,
    name: "Family Health Clinic",
    type: "clinic",
    location: "South Hills",
  },
  {
    id: 104,
    name: "Precision Diagnostics Clinic",
    type: "clinic",
    location: "East End",
  },
  {
    id: 105,
    name: "Wellness Hub Clinic",
    type: "clinic",
    location: "Westwood",
  },
  {
    id: 106,
    name: "Gentle Dental Clinic",
    type: "clinic",
    location: "City Center",
  },
  {
    id: 107,
    name: "Apex Physiotherapy Clinic",
    type: "clinic",
    location: "Riverfront",
  },

  // Hospitals (example)
  {
    id: 201,
    name: "General Hospital",
    type: "hospital",
    location: "Main Street",
  },
  {
    id: 202,
    name: "Community Medical Hospital",
    type: "hospital",
    location: "Oak Street",
  },

  // Specialties (example, could link to a list of doctors for that specialty)
  { id: 301, name: "Cardiology", type: "specialty" },
  { id: 302, name: "Pediatrics", type: "specialty" },
  { id: 303, name: "Dermatology", type: "specialty" },
  { id: 304, name: "Orthopedics", type: "specialty" },
  { id: 305, name: "Neurology", type: "specialty" },

  // Lab Tests & Diagnostics (example)
  { id: 401, name: "Blood Test (CBC)", type: "lab_test" },
  { id: 402, name: "Urine Test", type: "lab_test" },
  { id: 403, name: "X-Ray Chest", type: "lab_test" },
  { id: 404, name: "MRI Scan", type: "lab_test" },
  { id: 405, name: "Diabetes Screening", type: "lab_test" },

  // Medicines (example, could link to medicine details page)
  { id: 501, name: "Paracetamol", type: "medicine" },
  { id: 502, name: "Amoxicillin", type: "medicine" },
  { id: 503, name: "Ibuprofen", type: "medicine" },
  { id: 504, name: "Omeprazole", type: "medicine" },

  // Services (example)
  { id: 601, name: "Ambulance Service", type: "service" },
  { id: 602, name: "Home Nursing Care", type: "service" },
  { id: 603, name: "Physiotherapy at Home", type: "service" },
  { id: 604, name: "Blood Donation Camps", type: "service" },
];

const handleSearch = (event) => {
  const query = event.target.value.toLowerCase();
  if (query.length < 2) {
    searchResults.value = [];
    return;
  }
  searchResults.value = mockData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.specialty && item.specialty.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query))
    )
    .slice(0, 15); // Limit results to, say, 15 for display
};
</script>
