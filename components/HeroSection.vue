<template>
  <section
    class="relative bg-gradient-to-br from-blue-50 to-white text-gray-900 py-6 sm:py-10 lg:py-10"
  >
    <div class="max-w-5xl mx-auto px-4 relative z-20">
      <div class="relative mx-auto max-w-2xl w-full mb-6 animate-zoom-in z-20">
        <input
          type="text"
          :placeholder="currentPlaceholder"
          @input="handleSearchInput"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
          v-model="searchInput"
          ref="searchInputRef"
          class="w-full py-3 px-6 text-base rounded-full border-2 border-blue-200 bg-white poppins-regular focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
        />
        <div
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-blue-500"
        >
          <MagnifyingGlassIcon class="w-6 h-6" />
        </div>

        <div
          v-if="showSuggestions"
          class="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto text-left animate-slide-down"
          @mousedown.prevent
          ref="suggestionsDropdown"
        >
          <div v-if="filteredSuggestions.length > 0">
            <h4
              v-if="!searchInput"
              class="px-4 py-2 text-gray-600 outfit-medium border-b border-gray-100 sticky top-0 bg-white z-10"
            >
              Top Suggestions
            </h4>
            <NuxtLink
              v-for="result in filteredSuggestions"
              :key="result.id"
              :to="getSearchResultLink(result)"
              class="block px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-200 outfit-medium border-b border-gray-100 last:border-b-0 z-10 text-sm"
              @click="handleSuggestionClick"
            >
              {{ result.name }}
              <span class="text-xs text-gray-500 hover:text-white ml-2"
                >({{ getResultTypeText(result.type) }})</span
              >
            </NuxtLink>
          </div>
          <div v-else class="px-4 py-2 text-gray-600 text-center">
            No results found.
          </div>
        </div>
      </div>

      <div
        class="w-full bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl shadow-lg h-32 sm:h-40 flex items-center justify-center border border-blue-300 text-blue-800 font-bold text-lg sm:text-xl animate-fade-in-up delay-400 -z-10"
      >
        <span
          >Your Health, Our Priority. <i class="fas fa-heartbeat ml-2"></i
        ></span>
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

// Refs
const searchInput = ref(""); // v-model for the input
const searchInputRef = ref(null); // Ref to the input element
const suggestionsDropdown = ref(null); // Ref to the dropdown element
const showSuggestions = ref(false);

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

// Mock Data for Search and Initial Suggestions
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

// Initial "trending" or "top" suggestions (you can customize this)
const initialSuggestions = [
  // Example of top doctors, trending specialties, etc.
  {
    id: "t1",
    name: "Top Doctors in Baidyabati",
    type: "trend_doctor_location",
  },
  {
    id: "t2",
    name: "Dermatologists near me",
    type: "trend_specialty_location",
  },
  { id: "t3", name: "Online Doctor Consultation", type: "trend_service" },
  { id: "t4", name: "Full Body Checkup", type: "lab_test" },
  { id: "t5", name: "Fever", type: "symptom" }, // Assuming you'd link to symptoms page
  { id: "t6", name: "Cold & Flu", type: "symptom" },
  { id: "t7", name: "Buy Medicines Online", type: "medicine" },
  { id: "t8", name: "Emergency Ambulance", type: "service" },
  { id: "t9", name: "Cardiologist", type: "specialty" },
  { id: "t10", name: "Pediatrician", type: "specialty" },
  // Add more as needed
];

// Combine mockData and initialSuggestions for comprehensive search
const allSearchableData = [...mockData, ...initialSuggestions];

let searchTimeout = null;

const filteredSuggestions = ref([]);

const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    if (query.length === 0) {
      filteredSuggestions.value = initialSuggestions.slice(0, 10); // Show top 10 initial suggestions
    } else {
      filteredSuggestions.value = allSearchableData
        .filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.specialty && item.specialty.toLowerCase().includes(query)) ||
            (item.location && item.location.toLowerCase().includes(query))
        )
        .slice(0, 10); // Limit results
    }
  }, 200); // Debounce search input by 200ms
};

const handleInputFocus = () => {
  showSuggestions.value = true;
  // Load initial suggestions when input is focused and nothing is typed yet
  if (!searchInput.value) {
    filteredSuggestions.value = initialSuggestions.slice(0, 10);
  } else {
    // If there's already text, re-run the search
    handleSearchInput();
  }
};

const handleInputBlur = (event) => {
  // Use a slight delay to allow click on a suggestion to register
  setTimeout(() => {
    if (
      suggestionsDropdown.value &&
      !suggestionsDropdown.value.contains(event.relatedTarget) && // Check if focus moved to inside dropdown
      event.relatedTarget !== searchInputRef.value // Check if focus moved back to input
    ) {
      showSuggestions.value = false;
    }
  }, 100);
};

const handleSuggestionClick = () => {
  showSuggestions.value = false; // Hide suggestions after clicking one
};

// Adjusted getSearchResultLink to handle new trend types and symptoms
const getSearchResultLink = (result) => {
  const currentLocation = locationStore.currentLocation || "unknown"; // Fallback for location
  switch (result.type) {
    case "doctor":
    case "specialty":
    case "trend_specialty_location":
    case "trend_doctor_location":
      // For trends, we might need more specific logic or just route to a generic search for now
      if (result.type === "trend_doctor_location") {
        return `/find-doctor?location=${currentLocation}`;
      }
      if (result.type === "trend_specialty_location") {
        const specialty = result.name.split(" ")[0]; // Basic extraction
        return `/find-doctor?location=${currentLocation}&specialities=${encodeURIComponent(
          specialty
        )}`;
      }
      return `/find-doctor?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "clinic":
    case "hospital":
      return `/find-clinic?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "lab_test":
      return `/LabTests/${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "medicine":
      return `/pharmacy?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "service":
    case "trend_service":
      if (result.name.toLowerCase().includes("ambulance")) {
        return `/find-ambulance?location=${currentLocation}`;
      } else if (result.name.toLowerCase().includes("blood")) {
        return `/blood-doner`;
      } else if (
        result.name.toLowerCase().includes("online doctor consultation")
      ) {
        return `/online-consultation`; // Example specific route
      }
      return `/services?query=${encodeURIComponent(result.name)}`;
    case "symptom": // New case for symptoms
      return `/find-doctor?location=${currentLocation}&symptom=${encodeURIComponent(
        result.name
      )}`; // Route to doctor search by symptom
    default:
      return `/search?query=${encodeURIComponent(result.name)}`;
  }
};

const getResultTypeText = (type) => {
  switch (type) {
    case "doctor":
      return "Doctor";
    case "clinic":
      return "Clinic";
    case "hospital":
      return "Hospital";
    case "specialty":
      return "Specialty";
    case "lab_test":
      return "Lab Test";
    case "medicine":
      return "Medicine";
    case "service":
      return "Service";
    case "trend_doctor_location":
      return "Top Doctors";
    case "trend_specialty_location":
      return "Trending Specialty";
    case "trend_service":
      return "Trending Service";
    case "symptom":
      return "Symptom";
    default:
      return "Result";
  }
};
</script>

<style scoped>
/* Animations (keeping as is, they are fine) */
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

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-zoom-in {
  animation: zoom-in 0.6s ease-out forwards;
  animation-delay: 0.4s;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
}

/* Ensure Font Awesome is loaded for icons to show */
</style>
