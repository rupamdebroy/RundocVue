<template>
  <div class="-z-10">
    <!-- Primary Services: Doctor Appointment, Lab Test, Clinics -->
    <section class="py-0 px-4">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Our <span class="text-blue-600">Services</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <NuxtLink
          :to="`/find-doctor?location=${locationStore.currentLocation}`"
          class="block"
        >
          <ServiceCard
            title="Doctor Appointment"
            description="Book now"
            bgColor="bg-yellow-100"
            descColor="text-yellow-800"
          >
            <template #icon>
              <i class="fas fa-user-md text-yellow-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/labtest?location=${locationStore.currentLocation}`"
          class="block"
        >
          <ServiceCard
            title="Lab Tests"
            description="At home"
            bgColor="bg-pink-100"
            descColor="text-pink-800"
          >
            <template #icon>
              <i class="fas fa-vial text-pink-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/find-clinic?location=${locationStore.currentLocation}`"
          class="block"
        >
          <ServiceCard
            title="Find Clinics"
            description="Find doctors by clinic"
            bgColor="bg-blue-100"
            descColor="text-blue-800"
          >
            <template #icon>
              <i class="fas fa-clinic-medical text-blue-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>
      </div>
    </section>

    <!-- Other Services -->
    <section class="py-10 px-4 bg-white mt-4">
      <h2 class="text-center text-3xl font-semibold text-gray-800 mb-10">
        Other <span class="text-blue-600">Services</span>
      </h2>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        <NuxtLink
          :to="`/pharmacy?location=${locationStore.currentLocation}`"
          class="block"
        >
          <ServiceCard
            title="Buy Medicines"
            description="2hrs delivery"
            bgColor="bg-green-100"
            descColor="text-green-800"
          >
            <template #icon>
              <i class="fas fa-capsules text-green-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <ServiceCard
          title="Home Care"
          description="Care at home"
          bgColor="bg-purple-100"
          descColor="text-purple-800"
        >
          <template #icon>
            <i class="fas fa-home text-purple-800 text-3xl"></i>
          </template>
        </ServiceCard>

        <NuxtLink
          :to="`/find-ambulance?location=${locationStore.currentLocation}`"
          class="block"
        >
          <ServiceCard
            title="Ambulance"
            description="Emergency service"
            bgColor="bg-red-100"
            descColor="text-red-800"
          >
            <template #icon>
              <i class="fas fa-ambulance text-red-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink :to="`/blood-doner`" class="block">
          <ServiceCard
            title="Blood Donor"
            description="Find or donate"
            bgColor="bg-red-100"
            descColor="text-red-800"
          >
            <template #icon>
              <i class="fas fa-tint text-red-800 text-3xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import ServiceCard from "./ServiceCard.vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
</script>
