<!-- layouts/default.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

console.log("Default layout is being used for this page");
</script>
