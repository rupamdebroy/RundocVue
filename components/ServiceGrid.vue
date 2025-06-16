<template>
  <div class="z-0">
    <section class="py-2 sm:py-10 px-4 bg-gray-50">
      <h2
        class="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 animate-fade-in-down"
      >
        Our <span class="text-blue-600">Core Services</span>
      </h2>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto animate-fade-in-up delay-200"
      >
        <NuxtLink
          :to="`/find-doctor?location=${locationStore.currentLocation}`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Doctor Appointment"
            description="Book now"
            bgColor="bg-yellow-50"
            descColor="text-yellow-800"
            iconBgColor="bg-yellow-200"
          >
            <template #icon>
              <i class="fas fa-user-md text-yellow-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/labtest?location=${locationStore.currentLocation}`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Lab Tests"
            description="At home"
            bgColor="bg-pink-50"
            descColor="text-pink-800"
            iconBgColor="bg-pink-200"
          >
            <template #icon>
              <i class="fas fa-vial text-pink-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/find-clinic?location=${locationStore.currentLocation}`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Find Clinics"
            description="Find doctors by clinic"
            bgColor="bg-blue-50"
            descColor="text-blue-800"
            iconBgColor="bg-blue-200"
          >
            <template #icon>
              <i class="fas fa-clinic-medical text-blue-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>
      </div>
    </section>

    <section class="py-2 sm:py-10 px-4 bg-white mt-10">
      <h2
        class="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 animate-fade-in-down"
      >
        Other <span class="text-blue-600">Medical Services</span>
      </h2>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto animate-fade-in-up delay-400"
      >
        <NuxtLink
          :to="`/pharmacy?location=${locationStore.currentLocation}`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Buy Medicines"
            description="2hrs delivery"
            bgColor="bg-green-50"
            descColor="text-green-800"
            iconBgColor="bg-green-200"
          >
            <template #icon>
              <i class="fas fa-capsules text-green-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          to="/home-care"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Home Care"
            description="Care at home"
            bgColor="bg-purple-50"
            descColor="text-purple-800"
            iconBgColor="bg-purple-200"
          >
            <template #icon>
              <i class="fas fa-home text-purple-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/find-ambulance?location=${locationStore.currentLocation}`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Ambulance"
            description="Emergency service"
            bgColor="bg-red-50"
            descColor="text-red-800"
            iconBgColor="bg-red-200"
          >
            <template #icon>
              <i class="fas fa-ambulance text-red-800 text-2xl"></i>
            </template>
          </ServiceCard>
        </NuxtLink>

        <NuxtLink
          :to="`/blood-doner`"
          class="block transform hover:-translate-y-1 transition-transform duration-300"
        >
          <ServiceCard
            title="Blood Donor"
            description="Find or donate"
            bgColor="bg-red-50"
            descColor="text-red-800"
            iconBgColor="bg-red-200"
          >
            <template #icon>
              <i class="fas fa-tint text-red-800 text-2xl"></i>
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

<style scoped>
/* Reusing animations from SearchSection */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}

.animate-fade-in-up.delay-400 {
  animation-delay: 0.4s;
}
</style>
