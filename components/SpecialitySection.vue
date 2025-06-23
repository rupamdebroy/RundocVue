<template>
  <section class="py-12 sm:py-16 px-4 bg-blue-50">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 animate-fade-in-down"
      >
        Explore Specialties in
        <span class="text-blue-600">{{
          doctorsStore.currentLocation || "Your Area"
        }}</span>
      </h2>

      <div
        v-if="doctorsStore.isLoading"
        class="flex justify-center items-center py-8"
      >
        <p class="text-base text-gray-600 animate-pulse flex items-center">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading specialties...
        </p>
      </div>

      <div
        v-else-if="doctorsStore.error"
        class="text-center text-base text-red-600 py-6 font-semibold"
      >
        <p>
          <i class="fas fa-exclamation-triangle mr-2"></i>
          {{ doctorsStore.error }}
        </p>
        <button
          @click="openLocationSelector"
          class="mt-4 text-sm text-blue-600 font-semibold hover:underline"
        >
          Select a Location
        </button>
      </div>

      <div v-else-if="!doctorsStore.hasDoctors && !doctorsStore.isLoading">
        <div class="text-center text-base text-gray-600 py-6 font-semibold">
          <p>No specialties available for the selected location.</p>
          <button
            @click="openLocationSelector"
            class="mt-4 text-sm text-blue-600 font-semibold hover:underline"
          >
            Change Location
          </button>
        </div>
      </div>

      <div v-else>
        <transition-group
          name="fade"
          tag="div"
          class="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 animate-fade-in-up delay-200"
        >
          <div
            v-for="speciality in displayedSpecialties"
            :key="speciality"
            @click="goToDoctorList(speciality)"
            class="cursor-pointer text-center group transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-16 h-16 mx-auto rounded-full bg-white border-2 border-gray-200 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-md group-hover:shadow-lg"
            >
              <i
                :class="getSpecialtyIcon(speciality)"
                class="text-2xl transition-all duration-300 group-hover:text-white"
              ></i>
            </div>
            <p
              class="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ speciality }}
            </p>
          </div>
        </transition-group>

        <div
          v-if="uniqueSpecialties.length > 15"
          class="col-span-full text-center mt-8"
        >
          <button
            @click="toggleShowAll"
            class="text-sm text-blue-600 font-semibold hover:underline transition-all duration-200 flex items-center justify-center mx-auto"
          >
            {{ showAll ? "See Less" : "See More" }}
            <i
              :class="showAll ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
              class="ml-2"
            ></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLocationStore } from "@/stores/location";
import { useDoctorsStore } from "@/stores/doctors";

const router = useRouter();
const locationStore = useLocationStore();
const doctorsStore = useDoctorsStore();

const uniqueSpecialties = ref([]);
const showAll = ref(false);

const fetchSpecialties = async () => {
  try {
    // Initialize doctors store to ensure location is restored
    doctorsStore.initializeStore();

    // Fetch locations if not already loaded
    if (!locationStore.hasLocations) {
      await locationStore.fetchLocations();
    }

    // Fetch doctors using the current location
    await doctorsStore.fetchDoctors();

    // Process specialties
    const specialties = doctorsStore.doctors.map((d) => d.specilities);

    const cleaned = specialties.map((s) => {
      // Correct common typos or standardize names
      if (s.toLowerCase() === "orthapadic") return "Orthopedic";
      if (s.toLowerCase().includes("cardio")) return "Cardiology";
      if (s.toLowerCase().includes("pediat")) return "Pediatrics";
      if (s.toLowerCase().includes("derma")) return "Dermatology";
      if (s.toLowerCase().includes("neuro")) return "Neurology";
      if (s.toLowerCase().includes("gastro")) return "Gastroenterology";
      if (s.toLowerCase().includes("urol")) return "Urology";
      if (s.toLowerCase().includes("ent")) return "ENT";
      if (s.toLowerCase().includes("gyne")) return "Gynecology";
      if (s.toLowerCase().includes("ortho")) return "Orthopedics";
      if (s.toLowerCase().includes("psy")) return "Psychiatry";
      if (s.toLowerCase().includes("onco")) return "Oncology";
      if (s.toLowerCase().includes("diabet")) return "Diabetology";
      if (s.toLowerCase().includes("pulmo")) return "Pulmonology";
      if (s.toLowerCase().includes("radio")) return "Radiology";
      if (s.toLowerCase().includes("opthal")) return "Ophthalmology";

      return s;
    });

    uniqueSpecialties.value = [...new Set(cleaned)].sort();
  } catch (err) {
    console.error("Failed to fetch specialties:", err);
    doctorsStore.error = "Failed to fetch specialties. Please try again later.";
  }
};

const displayedSpecialties = computed(() =>
  showAll.value ? uniqueSpecialties.value : uniqueSpecialties.value.slice(0, 15)
);

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const goToDoctorList = (speciality) => {
  router.push({
    path: "/doctor-list",
    query: {
      location: doctorsStore.currentLocation,
      specialities: speciality,
    },
  });
};

const openLocationSelector = () => {
  // Trigger the location selector in the header
  // This assumes the header component listens for a global event or state change
  locationStore.openLocationSelector(); // You may need to implement this in locationStore
};

// Helper to get Font Awesome icon for specialties
const getSpecialtyIcon = (speciality) => {
  const lowerSpeciality = speciality.toLowerCase();
  if (lowerSpeciality.includes("cardiology"))
    return "fas fa-heartbeat text-red-500";
  if (lowerSpeciality.includes("pediatrics"))
    return "fas fa-child text-blue-500";
  if (lowerSpeciality.includes("dermatology"))
    return "fas fa-leaf text-green-500";
  if (lowerSpeciality.includes("orthopedic"))
    return "fas fa-bone text-yellow-600";
  if (lowerSpeciality.includes("neurology"))
    return "fas fa-brain text-purple-500";
  if (lowerSpeciality.includes("general physician"))
    return "fas fa-stethoscope text-gray-600";
  if (lowerSpeciality.includes("gynecology"))
    return "fas fa-venus text-pink-500";
  if (lowerSpeciality.includes("ent"))
    return "fas fa-ear-listen text-orange-500";
  if (lowerSpeciality.includes("psychiatry"))
    return "fas fa-brain text-indigo-500";
  if (lowerSpeciality.includes("urology")) return "fas fa-lungs text-teal-500"; // Assuming this was a typo for kidney/urinary related issues
  if (lowerSpeciality.includes("gastroenterology"))
    return "fas fa-stomach text-lime-600";
  if (lowerSpeciality.includes("oncology"))
    return "fas fa-disease text-red-700";
  if (lowerSpeciality.includes("diabetology"))
    return "fas fa-sugar text-amber-600";
  if (lowerSpeciality.includes("pulmonology"))
    return "fas fa-lungs text-light-blue-500";
  if (lowerSpeciality.includes("radiology"))
    return "fas fa-x-ray text-gray-700";
  if (lowerSpeciality.includes("ophthalmology"))
    return "fas fa-eye text-cyan-600";

  return "fas fa-hand-sparkles text-gray-600";
};

onMounted(async () => {
  await fetchSpecialties();
});
</script>

<style scoped>
/* Animations for transition-group */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* Base animations */
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

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}
</style>
