import { defineStore } from "pinia";
import axios from "axios";

export const useLocationStore = defineStore("location", {
  state: () => ({
    selectedLocation: "",
    availableLocations: [],
    error: "",
  }),

  actions: {
    async fetchLocations() {
      try {
        const response = await axios.get(
          "https://api.rundoc.in/api/app3/city.php",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          this.availableLocations = response.data.data;
          const savedLocation = localStorage.getItem("selectedLocation");
          if (
            savedLocation &&
            this.availableLocations.some((loc) => loc.name === savedLocation)
          ) {
            this.selectedLocation = savedLocation;
          }
        } else {
          this.error = response.data.message || "No locations found.";
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        this.error = "Error fetching locations. Please try again.";
      }
    },

    setLocation(location) {
      this.selectedLocation = location;
      localStorage.setItem("selectedLocation", location);
    },

    clearLocation() {
      this.selectedLocation = "";
      localStorage.removeItem("selectedLocation");
    },

    // New method to restore location from localStorage
    restoreLocation() {
      const savedLocation = localStorage.getItem("selectedLocation");
      if (savedLocation) {
        this.selectedLocation = savedLocation;
      }
    },
  },

  getters: {
    currentLocation: (state) => state.selectedLocation || "Select Location",
    hasLocations: (state) => state.availableLocations.length > 0,
  },
});
