<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup lang="ts">
const toast = useToast();

onErrorCaptured((error) => {
  console.error(error);
  toast.add({
    title: 'Error occurred',
    description: error.message,
    color: 'red',
  });
});
</script>
