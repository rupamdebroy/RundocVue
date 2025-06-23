<template>
  <div
    :class="`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg border ${bgColor} w-full h-auto text-center sm:flex-row sm:h-28 sm:text-left sm:justify-between sm:px-5 sm:py-4`"
  >
    <div class="flex flex-col items-center sm:flex-row sm:gap-4 w-full">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full text-2xl sm:text-3xl mb-2 sm:mb-0 flex-shrink-0"
        :class="iconBgColor"
      >
        <slot name="icon" />
      </div>

      <div class="flex flex-col items-center sm:items-start flex-1 min-w-0">
        <h3
          v-if="mobileTitle"
          class="text-sm font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap w-full sm:hidden"
        >
          {{ mobileTitle }}
        </h3>
        <h3
          :class="{ 'sm:block': mobileTitle, block: !mobileTitle }"
          class="text-sm sm:text-base font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap w-full"
        >
          {{ title }}
        </h3>
        <p
          :class="`hidden sm:block text-xs uppercase tracking-wider font-medium mt-1 ${descColor} overflow-hidden text-ellipsis whitespace-nowrap w-full`"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <div
      class="hidden sm:block text-gray-400 text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300 flex-shrink-0 ml-2"
    >
      <i class="fas fa-chevron-right"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  bgColor: String,
  descColor: String,
  iconBgColor: {
    type: String,
    default: "bg-white", // Default white background for icon circle
  },
  mobileTitle: {
    // New prop for mobile-specific title
    type: String,
    default: null,
  },
});
</script>

<style scoped>
/* No specific styles needed here, Tailwind handles it */
</style>
