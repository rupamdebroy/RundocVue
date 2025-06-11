<!-- layouts/landing.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow">
      <HeroSection />
      <ServiceGrid />
      <SpecialitySection />
      <SymptomSection />
    </main>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import HeroSection from "@/components/HeroSection.vue";
import ServiceGrid from "@/components/ServiceGrid.vue";
import SpecialitySection from "@/components/SpecialitySection.vue";
import SymptomSection from "@/components/SymptomSection.vue";
import BottomNav from "~/components/BottomNav.vue";

console.log("landing layout");
</script>
