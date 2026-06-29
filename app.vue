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

const route = useRoute();

let hadDarkClass = false;

onMounted(() => {
  window.addEventListener('beforeprint', () => {
    hadDarkClass = document.documentElement.classList.contains('dark');
    document.documentElement.classList.remove('dark');
  });
  window.addEventListener('afterprint', () => {
    if (hadDarkClass) {
      document.documentElement.classList.add('dark');
    }
    if (route.path.endsWith('/print')) {
      navigateTo(route.path.replace(/\/print$/, ''));
    }
  });
});
</script>
