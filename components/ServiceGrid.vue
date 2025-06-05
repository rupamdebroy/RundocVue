<template>
  <div>
    <!-- Doctor Appointment & Lab Test -->
    <section class="py-10 px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
              <i class="fas fa-user-md text-yellow-800 text-4xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>
        <div>
          <ServiceCard
            title="Lab Tests"
            description="At home"
            bgColor="bg-pink-100"
            descColor="text-pink-800"
          >
            <template #icon>
              <i class="fas fa-vial text-pink-800 text-4xl"></i>
            </template>
          </ServiceCard>
        </div>
      </div>
    </section>

    <!-- Find Doctor Clinic Wise -->
    <section class="py-10 px-4 bg-white">
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">Clinics</h2>
      <div class="max-w-5xl mx-auto">
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
              <i class="fas fa-clinic-medical text-blue-800 text-4xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>
      </div>
    </section>

    <!-- Medicine, Home Care, Ambulance -->
    <section class="py-10 px-4">
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
        Other Services
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div>
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
                <i class="fas fa-capsules text-green-800 text-4xl"></i>
              </template>
            </ServiceCard>
          </NuxtLink>
        </div>
        <div>
          <ServiceCard
            title="Home Care"
            description="Care at home"
            bgColor="bg-purple-100"
            descColor="text-purple-800"
          >
            <template #icon>
              <i class="fas fa-home text-purple-800 text-4xl"></i>
            </template>
          </ServiceCard>
        </div>
        <div>
          <ServiceCard
            title="Ambulance"
            description="Emergency service"
            bgColor="bg-red-100"
            descColor="text-red-800"
          >
            <template #icon>
              <i class="fas fa-ambulance text-red-800 text-4xl"></i>
            </template>
          </ServiceCard>
        </div>
      </div>
    </section>

    <!-- Blood Donor -->
    <section class="py-10 px-4 bg-white">
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">
        Blood Donor
      </h2>
      <div class="max-w-5xl mx-auto">
        <ServiceCard
          title="Find Blood Donor"
          description="Help someone in need"
          bgColor="bg-red-100"
          descColor="text-red-800"
        >
          <template #icon>
            <i class="fas fa-tint text-red-800 text-4xl"></i>
          </template>
        </ServiceCard>
      </div>
    </section>
  </div>
</template>

<script setup>
import ServiceCard from "./ServiceCard.vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
</script>
