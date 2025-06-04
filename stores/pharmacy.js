import { defineStore } from "pinia";
import pharmaciesData from "~/mock/pharmacies.json";

export const usePharmacyStore = defineStore("pharmacy", {
  state: () => ({
    selectedLocation: "",
    pharmacies: [],
    error: "",
    info: "",
  }),

  actions: {
    fetchPharmacies(location) {
      console.log("fetchPharmacies called with location:", location);

      if (!location) {
        this.error = "Location is not defined. Please select a location.";
        return;
      }

      const normalizedLocation = location.toLowerCase();
      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.pharmacies.length > 0
      ) {
        console.log(
          "Skipping fetch: Pharmacies already fetched for",
          normalizedLocation
        );
        this.info = `${this.pharmacies.length} pharmacy(s) found in ${location}.`;
        return;
      }

      console.log("Loading pharmacies for location:", location);
      this.selectedLocation = location;
      this.pharmacies = [];
      this.error = "";
      this.info = "";

      try {
        // Filter pharmacies by location (case-insensitive)
        const filteredPharmacies = pharmaciesData.filter((pharmacy) =>
          pharmacy.address.toLowerCase().includes(normalizedLocation)
        );

        this.pharmacies = filteredPharmacies;
        this.info = `${filteredPharmacies.length} pharmacy(s) found in ${location}.`;
      } catch (err) {
        console.error("Error fetching pharmacies:", err);
        this.error = "Error fetching pharmacies. Please try again.";
      }
    },

    clearPharmacies() {
      this.pharmacies = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },
});
