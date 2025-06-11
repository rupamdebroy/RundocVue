<template>
  <div>
    <Header />
    <section class="min-h-screen py-8 bg-red-50">
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-red-600">
          Register as a Blood Donor
        </h1>
        <form class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              readonly
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Blood Group</label
            >
            <select
              v-model="form.bloodGroup"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="" disabled>Select Blood Group</option>
              <option v-for="group in bloodGroups" :key="group" :value="group">
                {{ group }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Mobile</label
            >
            <input
              v-model="form.mobile"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              readonly
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700"
              >Address</label
            >
            <input
              v-model="form.address"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              readonly
            />
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.termsAccepted"
                class="mr-2"
                checked
                disabled
              />
              <span class="text-sm text-gray-700"
                >I accept Terms & Conditions</span
              >
            </label>
          </div>
          <button
            @click.prevent="registerDonor"
            class="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
          >
            Register me as Blood Donor
          </button>
          <NuxtLink
            to="/find-blood-doners"
            class="mt-4 block text-center text-blue-600 hover:text-blue-800"
          >
            Find Blood Donors
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
  termsAccepted: true,
});

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

onMounted(() => {
  if (authStore.isAuthenticated) {
    form.value.name = authStore.userInfo.name || "Account Holder";
    form.value.mobile = authStore.userInfo.mobile || "1234567890";
    form.value.address =
      authStore.userInfo.address?.street || "Default Address";
  }
});

const registerDonor = () => {
  if (!form.value.bloodGroup) {
    alert("Please select a blood group.");
    return;
  }
  const donorId = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log("Donor registered:", {
    id: donorId,
    name: form.value.name,
    bloodGroup: form.value.bloodGroup,
    mobile: form.value.mobile,
    address: form.value.address,
  });
  alert(`Registered as a donor! Donor ID: ${donorId}`);
  router.push("/blood-doner");
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
