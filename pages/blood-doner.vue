<template>
  <div>
    <Header />
    <section class="min-h-screen py-8 bg-red-100">
      <div class="container mx-auto p-4">
        <!-- Hero Section -->
        <div class="bg-red-600 text-white p-6 rounded-lg mb-8 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            🩸 **Saving Lives Starts with a Click**
          </h1>
          <p class="text-lg md:text-xl mb-4">
            Find trusted and verified blood donors quickly. Whether it’s an
            emergency or planned medical need, RUNDOC helps connect you with
            lifesavers across India.
          </p>
          <div class="flex justify-center gap-4">
            <NuxtLink
              to="/register-as-a-blood-doner"
              class="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
            >
              ✅ **Register as Blood Donor**
            </NuxtLink>
            <NuxtLink
              to="/find-blood-doners"
              class="bg-red-700 px-6 py-3 rounded-lg hover:bg-red-800"
            >
              🔍 **Find Blood Donor**
            </NuxtLink>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 class="text-xl font-semibold text-red-600 mb-2">
            🩷 Why Choose RUNDOC for Blood Donation?
          </h2>
          <ul class="list-disc pl-6 text-gray-700">
            <li>Verified and updated donor database</li>
            <li>
              Location-based filtering: Blood Group, State, District, City
            </li>
            <li>No hidden charges – 100% free service</li>
            <li>Privacy-focused: Your data stays secure</li>
            <li>Quick connections in times of need</li>
          </ul>
        </div>

        <!-- How It Works -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-center mb-4 text-red-600">
            ❤️ How It Works
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <h3 class="font-semibold">Step 1: Browse Donors</h3>
              <p class="text-gray-600">
                Choose from blood group, state, district, and city to view
                potential donors.
              </p>
            </div>
            <div class="text-center">
              <h3 class="font-semibold">Step 2: Connect</h3>
              <p class="text-gray-600">
                Access contact details and reach out for urgent or scheduled
                donations.
              </p>
            </div>
            <div class="text-center">
              <h3 class="font-semibold">Step 3: Donate/Receive Blood</h3>
              <p class="text-gray-600">
                Coordinate with the donor and meet at an approved healthcare
                facility.
              </p>
            </div>
          </div>
          <p class="text-center text-gray-600 mt-2 italic">
            *RUNDOC is committed to saving lives through secure and ethical
            blood donor connections. We do not sell, misuse, or share your data.
            All information is voluntarily provided.*
          </p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
