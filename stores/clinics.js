import { defineStore } from "pinia";
import axios from "axios";

export const useClinicsStore = defineStore("clinics", {
  state: () => ({
    selectedLocation: "",
    clinics: [],
    currentClinic: null,
    error: "",
    info: "",
    isLoading: false,
    doctors: [], // Store doctors separately
  }),

  actions: {
    async fetchClinics(location) {
      console.log("fetchClinics called with location:", location);

      if (!location) {
        this.error = "Location is not defined. Please select a location.";
        console.warn("fetchClinics aborted: No location provided");
        return;
      }

      const normalizedLocation = location.toLowerCase();
      
      if (this.selectedLocation.toLowerCase() === normalizedLocation && this.clinics.length > 0) {
        console.log("Using cached clinics for", normalizedLocation);
        this.info = `${this.clinics.length} clinic(s) found in ${location}.`;
        return;
      }

      console.log("Fetching clinics for location:", location);
      this.selectedLocation = location;
      this.clinics = [];
      this.error = "";
      this.info = "";
      this.isLoading = true;

      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/ClinicList.php",
          { city: location },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer Rupam@98639999",
            },
          }
        );

        if (response.data.success) {
          this.clinics = response.data.data.map(clinic => ({
            id: clinic.Cilinic_id,
            name: clinic.Cilinic_name,
            address: clinic.Cilinic_address,
            city: clinic.city
          }));
          
          this.info = `${this.clinics.length} clinic(s) found in ${location}.`;
        } else {
          throw new Error(response.data.message || "No clinics found for this location");
        }
      } catch (err) {
        console.error("API Error fetching clinics:", err);
        this.error = err.message || "Error fetching clinics. Please try again.";
        this.clinics = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchClinicDetails(clinicId) {
  this.isLoading = true;
  this.error = null;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.rundoc.in/api/app3/ClinicDetails.php',
      data: { Cilinic_id: clinicId },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Rupam@98639999'
      },
      // Important for CORS
      withCredentials: false
    });

    if (response.data.success) {
      const clinicData = response.data.data;
      
      if (clinicData.length > 0) {
        return {
          clinic: {
            id: clinicId,
            name: clinicData[0].Cilinic_name,
            address: clinicData[0].Cilinic_address,
            city: clinicData[0].city
          },
          doctors: clinicData.map(item => ({
            id: item.docid,
            name: item.docname,
            fullName: item.docfname,
            specialty: item.specialties,
            scheduleId: item.scheduleid
          }))
        };
      }
      throw new Error("Clinic details not found");
    } else {
      throw new Error(response.data.message || "Failed to fetch clinic details");
    }
  } catch (error) {
    console.error("Error fetching clinic details:", error);
    
    // Handle CORS-specific errors
    if (error.message.includes('CORS') || error.message.includes('Network Error')) {
      this.error = "Could not connect to the server. Please try again later.";
    } else {
      this.error = error.message || "An unexpected error occurred";
    }
    
    return null;
  } finally {
    this.isLoading = false;
  }
},

    clearClinics() {
      console.log("Clearing clinics store");
      this.clinics = [];
      this.currentClinic = null;
      this.doctors = [];
      this.selectedLocation = "";
      this.error = "";
      this.info = "";
    },
  },

  getters: {
    hasClinics: (state) => state.clinics.length > 0,
    clinicsByLocation: (state) => (location) => 
      state.clinics.filter(c => c.city.toLowerCase() === location.toLowerCase()),
    hasDoctors: (state) => state.doctors.length > 0,
  },
});