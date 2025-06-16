import { defineStore } from "pinia";
import axios from "axios";
import { useLocationStore } from "./location"; // Import location store

export const useDoctorsStore = defineStore("doctors", {
  state: () => ({
    selectedLocation: "",
    doctors: [],
    error: "",
    info: "",
    isLoading: false, // Track loading state
  }),

  actions: {
    // Initialize store with persisted location from locationStore
    initializeStore() {
      const locationStore = useLocationStore();
      locationStore.restoreLocation(); // Ensure location is restored from localStorage
      if (locationStore.selectedLocation && !this.selectedLocation) {
        this.selectedLocation = locationStore.selectedLocation;
      }
    },

    async fetchDoctors(location = null) {
      console.log("fetchDoctors called with location:", location);

      const locationStore = useLocationStore();
      // Use provided location, or fall back to locationStore.selectedLocation, or default to empty
      const targetLocation =
        location || locationStore.selectedLocation || "Select Location";

      // Validate location
      if (targetLocation === "Select Location" || !targetLocation) {
        this.error = "Please select a valid location.";
        console.warn("fetchDoctors aborted: Invalid or no location provided");
        return;
      }

      // Normalize location for comparison
      const normalizedLocation = targetLocation.toLowerCase();
      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.doctors.length > 0
      ) {
        console.log(
          "Skipping API call: Doctors already fetched for",
          normalizedLocation
        );
        this.info = `${this.doctors.length} doctor(s) found in ${targetLocation}.`;
        this.error = "";
        return;
      }

      // Proceed with API call
      console.log("Making API call for location:", targetLocation);
      this.selectedLocation = targetLocation; // Keep original case for display
      this.doctors = [];
      this.error = "";
      this.info = "";
      this.isLoading = true;

      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/doctor_list.php",
          JSON.stringify({ Location: targetLocation }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );

        console.log("API response:", response.data);
        if (response.data.status === "success") {
          this.doctors = response.data.data;
          this.info = `${this.doctors.length} doctor(s) found in ${targetLocation}.`;
        } else {
          this.error = response.data.message || "No doctors found.";
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        this.error = "Error fetching doctors. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },

    clearDoctors() {
      console.log("Clearing doctors store");
      this.doctors = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
      this.isLoading = false;
    },
  },

  getters: {
    hasDoctors: (state) => state.doctors.length > 0,
    currentLocation: (state) => state.selectedLocation || "Select Location",
  },
});
