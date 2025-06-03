<template>
  <footer class="text-gray-800 border-t py-6">
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center"
    >
      <div class="text-sm">
        &copy; {{ currentYear }} Rundoc. All rights reserved.
      </div>
      <div class="flex space-x-6 mt-4 md:mt-0">
        <a href="/about" class="hover:text-blue-400">About</a>
        <a href="/contact" class="hover:text-blue-400">Contact</a>
        <a href="/privacy" class="hover:text-blue-400">Privacy Policy</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
