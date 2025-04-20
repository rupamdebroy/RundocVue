import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // { email, fullName, phoneNumber, sessionId }
  }),

  actions: {
    // Login: Set user data and store in cookies
    login(userData) {
      this.user = userData;
      Cookies.set("auth_user", JSON.stringify(userData), { expires: 7 }); // 7-day cookie
    },

    // Logout: Clear user data and cookies
    logout() {
      this.user = null;
      Cookies.remove("auth_user");
    },

    // Restore session from cookies
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
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userInfo: (state) => state.user || {},
  },
});
