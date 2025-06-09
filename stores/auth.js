import { defineStore } from "pinia";
import Cookies from "js-cookie";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // { email, fullName, phoneNumber, sessionId }
    isLoading: false,
    error: null,
    showLoginPopup: false,
    showRegisterPopup: false,
    otpSent: false,
    phoneNumber: "",
    otp: "",
  }),

  actions: {
    // Request OTP
    async requestOTP(phone) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/Phone.php",
          {
            Phone: phone,
            request: true,
          },
          {
            headers: {
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );
        this.otpSent = true;
        this.phoneNumber = phone;
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.msg || "Failed to send OTP";
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Verify OTP
    async verifyOTP(phone, otp) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/Phone.php",
          {
            Phone: phone,
            OTP: otp,
          },
          {
            headers: {
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );
        if (response.data.sessionId !== "0") {
          this.login(response.data);
          this.showLoginPopup = false;
          this.otpSent = false;
          return true;
        } else {
          this.showRegisterPopup = true;
          return false;
        }
      } catch (err) {
        this.error = err.response?.data?.msg || "Invalid OTP";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // Register New User
    async registerUser(phone, name, address) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/Phone.php",
          {
            Phone: phone,
            Name: name,
            Address: address,
          },
          {
            headers: {
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );
        this.login(response.data);
        this.showRegisterPopup = false;
        return true;
      } catch (err) {
        this.error = err.response?.data?.msg || "Registration failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    login(userData) {
      this.user = userData;
      Cookies.set("auth_user", JSON.stringify(userData), { expires: 7 });
    },

    logout() {
      this.user = null;
      Cookies.remove("auth_user");
    },

    restoreSession() {
      const userCookie = Cookies.get("auth_user");
      if (userCookie) {
        try {
          this.user = JSON.parse(userCookie);
        } catch (err) {
          console.error("Error parsing auth cookie:", err);
          Cookies.remove("auth_user");
        }
      }
    },

    // Function to check authentication and block access
    // Call this function in any page's setup or onMounted to restrict access without login
    // Example usage: authStore.checkAuthAndBlock() in a page's setup
    // This will show the login popup if not authenticated and block further execution
    checkAuthAndBlock() {
      if (!this.isAuthenticated) {
        this.showLoginPopup = true;
        return false; // Block further execution
      }
      return true; // Allow access if authenticated
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userInfo: (state) => state.user || {},
  },
});
