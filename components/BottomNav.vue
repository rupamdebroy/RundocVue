<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white shadow-md py-4 px-6 md:static md:bg-transparent md:shadow-none"
  >
    <div class="flex justify-around md:justify-center md:space-x-8">
      <NuxtLink
        to="/"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-home text-xl"></i>
        <span class="text-xs mt-1">Home</span>
      </NuxtLink>
      <NuxtLink
        to="/find-doctor"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-user-md text-xl"></i>
        <span class="text-xs mt-1">Doctor</span>
      </NuxtLink>
      <NuxtLink
        to="/clinics"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-clinic-medical text-xl"></i>
        <span class="text-xs mt-1">Clinic</span>
      </NuxtLink>
      <NuxtLink
        to="/lab-tests"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-vial text-xl"></i>
        <span class="text-xs mt-1">Test</span>
      </NuxtLink>
      <NuxtLink
        to="/more"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-ellipsis-h text-xl"></i>
        <span class="text-xs mt-1">More</span>
      </NuxtLink>
      <NuxtLink
        to="/help"
        class="flex flex-col items-center text-gray-700 hover:text-green-600"
      >
        <i class="fas fa-question-circle text-xl"></i>
        <span class="text-xs mt-1">Help</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
/* Ensure content isn't hidden behind fixed nav on mobile */
@media (max-width: 768px) {
  body {
    padding-bottom: 80px; /* Height of bottom nav */
  }
}
</style>
