<template>
  <div class="flex flex-col gap-4 w-full">
    <UCard>
      <template #header>
        OpenAI Einstellungen
      </template>
      <UFormField label="OpenAI API Key">
        <UInput v-model="newApiKey" type="password" class="w-full" />
      </UFormField>
      <template #footer>
        <div class="text-right">
          <UButton @click="saveOpenAiSettings">
            Speichern
          </UButton>
        </div>
      </template>
    </UCard>

    <UCard>
      <template #header>
        Farbmodus
      </template>
      <URadioGroup v-model="colorModelSelection" :items="colorModeItems" />
    </UCard>

    <UCard>
      <template #header>
        Speichernutzung
      </template>
      <LoadingIndicator v-if="!storageDetails" />
      <div v-else>
        <div>Genutzer Speicher: {{ storageDetails.used }} ({{ storageDetails.usedRelative }})</div>
        <div>Vorhandener Speicher: {{ storageDetails.total }}</div>
        <div>Freier Speicher: {{ storageDetails.free }}</div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui';
import LoadingIndicator from '~/components/LoadingIndicator.vue';

const toast = useToast();

const colorMode = useColorMode();
const colorModeItems = ref<RadioGroupItem[]>([{ label: 'System', value: 'system' }, { label: 'Hell', value: 'light' }, { label: 'Dunkel', value: 'dark' }]);
const colorModelSelection = computed({
  get() {
    return colorMode.preference;
  },
  set(newValue) {
    colorMode.preference = newValue;
  },
});

const newApiKey = ref(openAiApiKey.value);

function saveOpenAiSettings() {
  openAiApiKey.value = newApiKey.value;
  toast.add({
    title: 'OpenAI Api Key aktualisiert',
    color: 'success',
  });
}

const storageEstimation = ref<{ quota?: number; usage?: number }>();

onMounted(async () => {
  storageEstimation.value = await navigator.storage.estimate();
});

function inMegabyte(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return 'nicht berechenbar';
  }
  return `${Math.round(value / 1024 / 1024 * 1000) / 1000} MB`;
}

function inPercent(dividend?: number, divisor?: number) {
  if (dividend === undefined || divisor === undefined) {
    return 'nicht berechenbar';
  }
  return `${dividend / divisor}%`;
}

const storageDetails = computed(() => {
  if (!storageEstimation.value) {
    return undefined;
  }
  return {
    used: inMegabyte(storageEstimation.value.usage),
    usedRelative: inPercent(storageEstimation.value.usage, storageEstimation.value.usage),
    total: inMegabyte(storageEstimation.value.quota),
    free: inMegabyte((storageEstimation.value.quota ?? Number.NaN) - (storageEstimation.value.usage ?? Number.NaN)),
  };
});
</script>
