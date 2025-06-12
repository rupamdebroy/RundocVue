<template>
  <div
    :class="`flex items-center justify-between px-6 py-5 rounded-xl ${bgColor}`"
    class="w-full h-24"
  >
    <!-- Left Section: Icon + Text -->
    <div class="flex items-center gap-6">
      <!-- Icon Slot -->
      <div class="text-3xl text-black">
        <slot name="icon" />
      </div>

      <!-- Title + Description -->
      <div>
        <h3 class="text-base font-semibold text-black leading-tight">
          {{ title }}
        </h3>
        <p
          :class="`text-xs uppercase tracking-wider font-medium mt-1 ${descColor}`"
        >
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Chevron Icon -->
    <div class="text-black text-base font-semibold">
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
});
</script>
