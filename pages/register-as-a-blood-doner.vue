<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section
      class="md:min-h-screen bg-gradient-to-br from-red-50 to-white py-12 flex items-center justify-center"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <div class="text-center mb-8">
          <h1
            class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-down"
          >
            <i class="fas fa-hand-holding-heart text-red-600 mr-2"></i>Register
            as a Blood Donor
          </h1>
          <p
            class="text-base text-gray-700 max-w-md mx-auto animate-fade-in-up"
          >
            Join our network of lifesavers. Your registration can save lives.
          </p>
        </div>

        <form
          @submit.prevent="registerDoner"
          class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-fade-in-up"
        >
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-800 mb-1"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-600 cursor-not-allowed"
              readonly
              aria-label="Your Name"
            />
          </div>

          <div class="mb-4 relative">
            <label class="block text-sm font-semibold text-gray-800 mb-1"
              >Blood Group <span class="text-red-500">*</span></label
            >
            <select
              v-model="form.bloodGroup"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm bg-white pr-7"
              required
              aria-required="true"
              aria-label="Select Blood Group"
            >
              <option value="" disabled>Select Blood Group</option>
              <option v-for="group in bloodGroups" :key="group" :value="group">
                {{ group }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 top-8"
            >
              <svg
                class="fill-current h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                />
              </svg>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-800 mb-1"
              >Mobile</label
            >
            <input
              v-model="form.mobile"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-600 cursor-not-allowed"
              readonly
              aria-label="Your Mobile Number"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-800 mb-1"
              >Address</label
            >
            <input
              v-model="form.address"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-600 cursor-not-allowed"
              readonly
              aria-label="Your Address"
            />
          </div>

          <div class="mb-4">
            <label class="flex items-center text-gray-700 text-sm">
              <input
                type="checkbox"
                v-model="form.termsAccepted"
                class="form-checkbox h-4 w-4 text-red-600 rounded focus:ring-red-500 border-gray-300 mr-2"
                required
                aria-required="true"
              />
              <span class="text-sm text-gray-700"
                >I accept the
                <NuxtLink to="/terms" class="text-red-600 hover:underline"
                  >Terms & Conditions</NuxtLink
                >
                <span class="text-red-500">*</span></span
              >
            </label>
          </div>

          <button
            type="submit"
            class="w-full bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-200 font-semibold text-base shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center mt-4 hover:scale-105"
          >
            <i class="fas fa-heartbeat mr-2"></i> Register as Blood Donor
          </button>

          <NuxtLink
            to="/find-blood-doners"
            class="mt-4 block text-center text-red-600 hover:text-red-800 transition-colors duration-200 font-semibold text-sm"
          >
            <i class="fas fa-search mr-2"></i> Looking for a Donor? Find Blood
            Donors
          </NuxtLink>
        </form>
      </div>
    </section>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: "",
  bloodGroup: "",
  mobile: "",
  address: "",
  termsAccepted: false,
});

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

onMounted(() => {
  if (!authStore.userInfo || Object.keys(authStore.userInfo).length === 0) {
    authStore.restoreAuth();
  }

  if (authStore.isAuthenticated && authStore.userInfo) {
    form.value.name = authStore.userInfo.name || "Account Holder";
    form.value.mobile = authStore.userInfo.mobile || "N/A";
    form.value.address = authStore.userInfo.address?.street || "N/A";
  }
});

const registerDoner = async () => {
  if (!form.value.bloodGroup) {
    alert("Please select your blood group to register.");
    return;
  }
  if (!form.value.termsAccepted) {
    alert("You must accept the Terms & Conditions to register as a donor.");
    return;
  }

  const donerId = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  console.log("Donor registered:", {
    id: donerId,
    name: form.value.name,
    bloodGroup: form.value.bloodGroup,
    mobile: form.value.mobile,
    address: form.value.address,
  });

  alert(`Thank you for registering! Your Donor ID is: ${donerId}`);
  router.push("/blood-doner-confirmation");
};
</script>

<style scoped>
.container {
  max-width: 1152px;
}

/* Custom styles for select arrow */
select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292%22%20height%3D%22292%22%20viewBox%3D%220%200%20292%20292%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-6.5H18.2c-4.1%200-7.9%201.5-10.9%204.5l-14%2014c-6.1%206.1-6.1%2016.9%200%2023l128%20128c6.1%206.1%2016.9%206.1%2023%200l128-128c3.9-3.9%205.9-9.9%205.9-15.5z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.7rem 0.7rem;
}

/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* General styling */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
