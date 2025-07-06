<template>
  <UProgress v-if="variant === 'linear'" class="w-full" />
  <div class="mx-auto flex justify-center">
    <div class="border-5 rounded-full border-t-5 animate-spin border-transparent" :style="{ width: `${size}px`, height: `${size}px` }" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'linear' | 'circle';
    size?: number;
  }>(),
  {
    variant: 'circle',
    size: 64,
  },
);
</script>
