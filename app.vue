<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const toast = useToast();

onErrorCaptured((error) => {
  console.error(error);
  toast.add({
    title: 'Error occurred',
    description: error.message,
    color: 'error',
  });
});
</script>
