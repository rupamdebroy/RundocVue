import { defineStore } from "pinia";
import clinicsData from "~/mock/clinics.json"; // Import mock data

export const useClinicsStore = defineStore("clinics", {
  state: () => ({
    selectedLocation: "",
    clinics: [],
    error: "",
    info: "",
  }),

  actions: {
    fetchClinics(location) {
      console.log("fetchClinics called with location:", location);

      if (!location) {
        this.error = "Location is not defined. Please select a location.";
        console.warn("fetchClinics aborted: No location provided");
        return;
      }

      const normalizedLocation = location.toLowerCase();
      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.clinics.length > 0
      ) {
        console.log(
          "Skipping fetch: Clinics already fetched for",
          normalizedLocation
        );
        this.info = `${this.clinics.length} clinic(s) found in ${location}.`;
        return;
      }

      console.log("Loading clinics for location:", location);
      this.selectedLocation = location;
      this.clinics = [];
      this.error = "";
      this.info = "";

      try {
        // Filter clinics by location (case-insensitive)
        const filteredClinics = clinicsData.filter((clinic) =>
          clinic.address.toLowerCase().includes(normalizedLocation)
        );

        this.clinics = filteredClinics;
        this.info = `${filteredClinics.length} clinic(s) found in ${location}.`;
      } catch (err) {
        console.error("Error fetching clinics:", err);
        this.error = "Error fetching clinics. Please try again.";
      }
    },

    clearClinics() {
      console.log("Clearing clinics store");
      this.clinics = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },
});
