<template>
  <section class="py-4 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12"
      >
        <div
          v-for="(info, index) in infoboxes"
          :key="index"
          class="relative w-full h-48 sm:h-52 group perspective"
          :class="{
            'flip-on-desktop': isDesktop,
            'static-on-mobile': !isDesktop,
          }"
        >
          <div
            class="relative w-full h-full transition-transform duration-500 rounded-2xl shadow-lg"
            :class="{ 'transform-style group-hover:rotate-y-180': isDesktop }"
          >
            <div
              class="absolute w-full h-full rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center backface-hidden border-2"
              :class="[
                index % 3 === 0
                  ? 'bg-blue-50 border-blue-200'
                  : index % 3 === 1
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200',
              ]"
            >
              <div class="text-blue-600 text-3xl sm:text-4xl mb-2">
                <i :class="info.icon"></i>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-800">
                {{ info.title }}
              </h3>
            </div>

            <div
              v-if="isDesktop"
              class="absolute w-full h-full rounded-2xl p-4 sm:p-6 bg-white border-2 border-gray-200 shadow-md text-sm text-gray-700 backface-hidden rotate-y-180 flex items-center justify-center"
            >
              <p
                class="whitespace-pre-line leading-relaxed text-sm sm:text-base"
              >
                {{ info.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLocationStore } from "@/stores/location";

const locationStore = useLocationStore();
const currentLocale = computed(
  () => locationStore.currentLocation || "your area"
);

const isDesktop = ref(true);

const updateIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 768; // Tailwind's 'md' breakpoint
};

onMounted(() => {
  updateIsDesktop();
  window.addEventListener("resize", updateIsDesktop);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateIsDesktop);
});

const infoboxes = computed(() => [
  {
    title: "Easy Ordering",
    shortDescription: `Order online, simple and fast.`,
    description: `Order your medicines online in just a few clicks from pharmacies in ${currentLocale.value}.\n\nSay goodbye to queues — it's simple, fast, and hassle-free.`,
    icon: "fas fa-shopping-cart",
  },
  {
    title: "Verified Medicines",
    shortDescription: `100% genuine and doctor-approved.`,
    description:
      "100% genuine and doctor-approved medicines.\n\nWe ensure quality and safety in every single order.",
    icon: "fas fa-check-double",
  },
  {
    title: "Home Delivery",
    shortDescription: `Fast, reliable doorstep delivery.`,
    description:
      "Fast, reliable doorstep delivery.\n\nYour medicines delivered safely and securely to your home.",
    icon: "fas fa-truck-moving",
  },
  {
    title: "Upload Prescription",
    shortDescription: `Upload prescription, quick processing.`,
    description:
      "Upload your prescription to get started.\n\nOur team verifies and processes your order quickly.",
    icon: "fas fa-file-upload",
  },
  {
    title: "Exclusive Discounts",
    shortDescription: `Save more with special offers.`,
    description:
      "Save more with every order through special offers.\n\nEnjoy regular deals on a wide range of health products.",
    icon: "fas fa-tags",
  },
  {
    title: "Local & Out-of-City Delivery",
    shortDescription: `Order locally or from outside.`,
    description: `Order medicines locally in ${currentLocale.value} or from trusted pharmacies outside your city.\n\nWe ensure prompt delivery, no matter your location.`,
    icon: "fas fa-globe-asia",
  },
]);
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.perspective {
  perspective: 1000px;
}

.transform-style {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.group:hover .group-hover\:rotate-y-180 {
  transform: rotateY(180deg);
}

@media (max-width: 767px) {
  .static-on-mobile .transform-style,
  .static-on-mobile .group-hover\:rotate-y-180 {
    transform-style: flat;
    transform: none !important;
    transition: none !important;
  }

  .static-on-mobile .backface-hidden.rotate-y-180 {
    display: none;
  }

  .static-on-mobile .backface-hidden:not(.rotate-y-180) {
    display: flex;
    position: relative;
  }

  /* This line is now effectively unused if you remove the <p> tag from the template */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
