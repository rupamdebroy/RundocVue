<template>
  <div
    :class="`flex items-center justify-between px-4 py-6 rounded-xl ${bgColor}`"
  >
    <div class="flex items-center gap-8">
      <div class="text-4xl">
        <slot name="icon" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-black">{{ title }}</h3>
        <p
          :class="`text-xs uppercase font-medium tracking-wider py-.5 ${descColor}`"
        >
          {{ description }}
        </p>
      </div>
    </div>
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
