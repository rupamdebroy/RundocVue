import { defineStore } from "pinia";
import axios from "axios";

export const useLocationStore = defineStore("location", {
  state: () => ({
    selectedLocation: "", // Currently selected location
    availableLocations: [], // List of locations from API
    error: "",
  }),

  actions: {
    // Fetch available cities/locations from the API
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
          this.availableLocations = response.data.data; // Store the list of locations
          // If there's a previously selected location in localStorage, restore it
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

    // Set the selected location and persist it
    setLocation(location) {
      this.selectedLocation = location;
      localStorage.setItem("selectedLocation", location); // Persist in localStorage
    },

    // Clear the selected location
    clearLocation() {
      this.selectedLocation = "";
      localStorage.removeItem("selectedLocation");
    },
  },

  getters: {
    currentLocation: (state) => state.selectedLocation || "Select Location",
    hasLocations: (state) => state.availableLocations.length > 0,
  },
});
