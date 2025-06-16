<template>
  <div
    :class="`flex items-center justify-between px-5 py-4 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg border ${bgColor}`"
    class="w-full h-24 sm:h-28"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full text-2xl sm:text-3xl"
        :class="iconBgColor"
      >
        <slot name="icon" />
      </div>

      <div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <p
          :class="`text-xs uppercase tracking-wider font-medium mt-1 ${descColor}`"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <div
      class="text-gray-400 text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300"
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
});
</script>

<style scoped>
/* No specific styles needed here, Tailwind handles it */
</style>
