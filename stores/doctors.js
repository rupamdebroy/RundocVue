import { defineStore } from "pinia";
import axios from "axios";

export const useDoctorsStore = defineStore("doctors", {
  state: () => ({
    selectedLocation: "",
    doctors: [],
    error: "",
    info: "",
  }),

  actions: {
    // async fetchDoctors(location) {
    //   console.log("fetchDoctors called with location:", location);
    //   // Normalize location to lowercase for comparison
    //   const normalizedLocation = location.toLowerCase();
    //   if (
    //     this.selectedLocation.toLowerCase() === normalizedLocation &&
    //     this.doctors.length > 0
    //   ) {
    //     console.log(
    //       "Skipping API call: Doctors already fetched for",
    //       normalizedLocation
    //     );
    //     this.info = `${this.doctors.length} doctor(s) found in ${location}.`;
    //     return;
    //   }

    async fetchDoctors(location) {
      console.log("fetchDoctors called with location:", location);

      if (!location) {
        this.error = "Location is not defined. Please select a location.";
        console.warn("fetchDoctors aborted: No location provided");
        return;
      }

      const normalizedLocation = location.toLowerCase();
      if (
        this.selectedLocation.toLowerCase() === normalizedLocation &&
        this.doctors.length > 0
      ) {
        console.log(
          "Skipping API call: Doctors already fetched for",
          normalizedLocation
        );
        this.info = `${this.doctors.length} doctor(s) found in ${location}.`;
        return;
      }

      // rest of the API logic...

      console.log("Making API call for location:", location);
      this.selectedLocation = location; // Keep original case for display
      this.doctors = [];
      this.error = "";
      this.info = "";

      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/doctor_list.php",
          JSON.stringify({ Location: location }),
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
          this.info = `${this.doctors.length} doctor(s) found in ${location}.`;
        } else {
          this.error = response.data.message || "No doctors found.";
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        this.error = "Error fetching doctors. Please try again.";
      }
    },

    clearDoctors() {
      console.log("Clearing doctors store");
      this.doctors = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },
});
