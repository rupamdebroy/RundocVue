<template>
  <section class="py-10 px-4 bg-white">
    <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
      What are you looking for?
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ServiceCard
        title="Buy Medicines & Essentials"
        description="2hrs delivery"
        bgColor="bg-green-100"
        descColor="text-green-800"
      >
        <template #icon>
          <i class="fas fa-capsules text-green-800"></i>
        </template>
      </ServiceCard>

      <ServiceCard
        title="Doctor Appointment"
        description="Book now"
        bgColor="bg-yellow-100"
        descColor="text-yellow-800"
      >
        <template #icon>
          <i class="fas fa-user-md text-yellow-800"></i>
        </template>
      </ServiceCard>

      <ServiceCard
        title="Lab Tests"
        description="At home"
        bgColor="bg-pink-100"
        descColor="text-pink-800"
      >
        <template #icon>
          <i class="fas fa-vial text-pink-800"></i>
        </template>
      </ServiceCard>

      <ServiceCard
        title="Health Insurance"
        description="Explore plans"
        bgColor="bg-orange-100"
        descColor="text-orange-800"
      >
        <template #icon>
          <i class="fas fa-notes-medical text-orange-800"></i>
        </template>
      </ServiceCard>
    </div>
  </section>
</template>

<script setup>
import ServiceCard from "./ServiceCard.vue";
</script>
