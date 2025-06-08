import { defineStore } from "pinia";
import labCentersData from "~/mock/labcenters.json";
import testsData from "~/mock/tests.json";

export const useLabStore = defineStore("lab", {
  state: () => ({
    selectedLocation: "",
    labCenters: [],
    tests: testsData.tests,
    diagnostics: testsData.diagnostics,
    error: "",
    info: "",
  }),

  actions: {
    fetchLabCenters(location) {
      console.log("fetchLabCenters called with location:", location);

      if (!location) {
        this.error = "Location is not defined. Please select a location.";
        return;
      }

      const normalizedLocation = location.toLowerCase();
      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.labCenters.length > 0
      ) {
        console.log(
          "Skipping fetch: Lab centers already fetched for",
          normalizedLocation
        );
        this.info = `${this.labCenters.length} lab center(s) found in ${location}.`;
        return;
      }

      console.log("Loading lab centers for location:", location);
      this.selectedLocation = location;
      this.labCenters = [];
      this.error = "";
      this.info = "";

      try {
        // Filter lab centers by location (case-insensitive)
        const filteredLabCenters = labCentersData.filter((lab) =>
          lab.address.toLowerCase().includes(normalizedLocation)
        );

        this.labCenters = filteredLabCenters;
        this.info = `${filteredLabCenters.length} lab center(s) found in ${location}.`;
      } catch (err) {
        console.error("Error fetching lab centers:", err);
        this.error = "Error fetching lab centers. Please try again.";
      }
    },

    clearLabCenters() {
      this.labCenters = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },
});
