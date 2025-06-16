<template>
  <section
    class="relative bg-gradient-to-br from-blue-50 to-white text-gray-900 overflow-hidden py-16 sm:py-20 lg:py-24"
  >
    <div class="max-w-5xl mx-auto px-4 relative z-20">
      <h1
        class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 leading-tight mb-6 animate-fade-in-down"
      >
        Your Health Journey Starts <span class="text-blue-600">Here.</span>
      </h1>
      <p
        class="text-base sm:text-lg text-gray-700 text-center max-w-2xl mx-auto mb-10 animate-fade-in-up"
      >
        Find the right doctors, clinics, and health services with ease.
      </p>

      <div class="relative mx-auto max-w-2xl w-full mb-12 animate-zoom-in z-20">
        <input
          type="text"
          :placeholder="currentPlaceholder"
          @input="handleSearch"
          class="w-full py-3 px-6 text-base rounded-full border-2 border-blue-200 bg-white poppins-regular focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
        />
        <div
          class="absolute right-5 top-1/2 transform -translate-y-1/2 text-blue-500"
        >
          <MagnifyingGlassIcon class="w-6 h-6" />
        </div>

        <div
          v-if="searchResults.length > 0"
          class="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto text-left animate-slide-down"
        >
          <NuxtLink
            v-for="result in searchResults"
            :key="result.id"
            :to="getSearchResultLink(result)"
            class="block px-4 py-2 text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-200 outfit-medium border-b border-gray-100 last:border-b-0 z-10 text-sm"
          >
            {{ result.name }}
            <span class="text-xs text-gray-500 hover:text-white ml-2"
              >({{ getResultTypeText(result.type) }})</span
            >
          </NuxtLink>
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

// Search Logic (Mock Data)
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
    .slice(0, 10); // Reduced limit for a more compact dropdown
};

const getSearchResultLink = (result) => {
  const currentLocation = locationStore.currentLocation || "unknown"; // Fallback for location
  switch (result.type) {
    case "doctor":
    case "specialty": // Assuming specialties lead to doctor search as well
      return `/find-doctor?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "clinic":
    case "hospital":
      return `/find-clinic?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "lab_test":
      return `/labtest?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "medicine":
      return `/pharmacy?location=${currentLocation}&query=${encodeURIComponent(
        result.name
      )}`;
    case "service":
      // More specific routing for services like ambulance/blood donor if applicable
      if (result.name.toLowerCase().includes("ambulance")) {
        return `/find-ambulance?location=${currentLocation}`;
      } else if (result.name.toLowerCase().includes("blood")) {
        return `/blood-doner`;
      }
      return `/services?query=${encodeURIComponent(result.name)}`; // Generic services page
    default:
      return `/search?query=${encodeURIComponent(result.name)}`; // Fallback generic search
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
