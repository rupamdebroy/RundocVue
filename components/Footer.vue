<template>
  <footer
    v-if="!isMobileOrTablet"
    class="bg-gray-100 text-gray-700 border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8"
    >
      <div class="md:col-span-2 lg:col-span-2 text-center md:text-left">
        <NuxtLink
          to="/"
          class="flex items-center justify-center md:justify-start mb-2"
        >
          <span
            class="text-blue-600 font-extrabold text-xl sm:text-2xl tracking-tight"
            >Rundoc</span
          >
        </NuxtLink>
        <p class="text-sm leading-relaxed mb-4">
          RUNDOC is a registered healthcare startup company dedicated to
          providing quality healthcare services in India.
        </p>
        <p class="text-xs opacity-80">
          &copy; {{ currentYear }} MRINJOU INNOVATIONS. All rights reserved.
        </p>
      </div>

      <div class="text-center md:text-left">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Important</h3>
        <ul class="space-y-2 text-sm">
          <li>
            <NuxtLink
              to="/find-doctor"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Find Doctors</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/find-clinic"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Find Clinics</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/register-user"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Register with us</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/login/patient"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Patient Login</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/login/clinic"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Clinic Login</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/login/doctor"
              class="hover:text-blue-600 transition-colors duration-200 block"
              >Doctor Login</NuxtLink
            >
          </li>
        </ul>
      </div>

      <div class="text-center md:text-left">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center justify-center md:justify-start">
            <i class="fas fa-phone mr-3 text-gray-500"></i>
            <a
              href="tel:+911169269800"
              class="hover:text-blue-600 transition-colors duration-200"
              >011 6926 9800</a
            >
          </li>
          <li class="flex items-center justify-center md:justify-start">
            <i class="fas fa-phone mr-3 text-gray-500"></i>
            <a
              href="tel:+911169269800"
              class="hover:text-blue-600 transition-colors duration-200"
              >011 6926 9800</a
            >
          </li>
          <li class="flex items-center justify-center md:justify-start">
            <i class="fas fa-envelope mr-3 text-gray-500"></i>
            <a
              href="mailto:contact@rundoc.in"
              class="hover:text-blue-600 transition-colors duration-200"
              >contact@rundoc.in</a
            >
          </li>
        </ul>
      </div>

      <div class="text-center md:text-left">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Community</h3>
        <div
          class="flex justify-center md:justify-start space-x-4 text-gray-500 text-xl"
        >
          <a
            href="#"
            class="hover:text-blue-600 transition-colors duration-200"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            class="hover:text-blue-600 transition-colors duration-200"
            aria-label="Instagram"
          >
            <i class="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            class="hover:text-blue-600 transition-colors duration-200"
            aria-label="YouTube"
          >
            <i class="fab fa-youtube"></i>
          </a>
          <a
            href="#"
            class="hover:text-blue-600 transition-colors duration-200"
            aria-label="WhatsApp"
          >
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </div>

    <div
      class="border-t border-gray-300 mt-10 pt-6 text-sm text-center md:text-left opacity-90"
    >
      <div
        class="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-6"
      >
        <NuxtLink
          to="/about"
          class="hover:text-blue-600 transition-colors duration-200"
          >About</NuxtLink
        >
        <NuxtLink
          to="/contact"
          class="hover:text-blue-600 transition-colors duration-200"
          >Contact Us</NuxtLink
        >
        <NuxtLink
          to="/terms"
          class="hover:text-blue-600 transition-colors duration-200"
          >Terms and Conditions</NuxtLink
        >
        <NuxtLink
          to="/refund-cancellation"
          class="hover:text-blue-600 transition-colors duration-200"
          >Refund and Cancellation Policy</NuxtLink
        >
        <NuxtLink
          to="/privacy"
          class="hover:text-blue-600 transition-colors duration-200"
          >Privacy Policy</NuxtLink
        >
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentYear = new Date().getFullYear();
const isMobileOrTablet = ref(false); // Default to false for initial render on server if SSR

const updateScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth <= 1024;
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<style scoped>
/* No specific styles needed here, Tailwind handles it */
</style>
