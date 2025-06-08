import { defineStore } from "pinia";
import ambulanceProvidersData from "~/mock/ambulance-providers.json";

export const useAmbulanceStore = defineStore("ambulance", {
  state: () => ({
    selectedLocation: "",
    providers: [],
    error: "",
    info: "",
  }),

  actions: {
    fetchProviders(location) {
      if (!location) {
        this.error = "Location is not defined.";
        console.log("No location provided for fetchProviders");
        return;
      }

      const normalizedLocation = location.toLowerCase();
      console.log("Fetching providers for location:", normalizedLocation);

      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.providers.length > 0
      ) {
        this.info = `${this.providers.length} provider(s) found in ${location}.`;
        console.log("Providers already fetched, skipping:", this.providers);
        return;
      }

      this.selectedLocation = location;
      this.providers = [];
      this.error = "";
      this.info = "";

      try {
        const filteredProviders = ambulanceProvidersData.filter((provider) =>
          provider.address.toLowerCase().includes(normalizedLocation)
        );
        console.log(
          "Filtered providers for",
          normalizedLocation,
          ":",
          filteredProviders
        );
        this.providers = filteredProviders;
        this.info = `${filteredProviders.length} provider(s) found in ${location}.`;
        if (filteredProviders.length === 0) {
          this.error = "No ambulance providers found for this location.";
        }
      } catch (err) {
        this.error = "Error fetching ambulance providers.";
        console.log("Error in fetchProviders:", err);
      }
    },

    clearProviders() {
      this.providers = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },
});
