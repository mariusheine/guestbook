<template>
  <LoadingIndicator v-if="!guestbook" />
  <UCard v-else class="w-full">
    <template #header>
      <h1>{{ guestbook.title }}</h1>
    </template>
    <div class="flex flex-col space-y-4">
      <UFormField label="Titel" name="title">
        <UInput v-model="guestbook.title" class="w-full" />
      </UFormField>

      <UFormField label="Beschreibe den Anlass des Gästebuches" name="description">
        <UTextarea
          v-model="guestbook.description"
          :rows="6"
          class="w-full"
          resize
          color="primary"
          variant="outline"
          placeholder="Beschreibe den Anlass des Gästebuchs und gib dem Gästebuch dadurch einen passenden Rahmen..."
        />
      </UFormField>

      <UFormField label="System-Prompt für Bildgenerierung" name="imageSystemPrompt">
        <UTextarea
          v-model="guestbook.imageSystemPrompt"
          :rows="6"
          class="w-full"
          resize
          placeholder="System-Prompt für die Bildgenerierung..."
        />
      </UFormField>

      <UFormField label="Bildqualität" name="imageQuality">
        <URadioGroup
          v-model="guestbook.imageQuality"
          :items="[
            { label: 'Niedrig (schnell)', value: 'low' },
            { label: 'Mittel', value: 'medium' },
            { label: 'Hoch (langsam)', value: 'high' },
          ]"
        />
      </UFormField>

      <UFormField label="Bildgröße (Breite × Höhe, Vielfaches von 16)" name="imageSize">
        <div class="flex items-center gap-2">
          <UInput v-model="imageWidth" type="number" :step="16" min="16" class="w-32" />
          <span>×</span>
          <UInput v-model="imageHeight" type="number" :step="16" min="16" class="w-32" />
        </div>
      </UFormField>

      <UButton
        class="justify-center disabled:bg-gray-500"
        :loading="saving"
        @click="save"
      >
        Speichern
      </UButton>
      <UButton
        class="justify-center disabled:bg-gray-500"
        :loading="saving"
        @click="remove"
      >
        Löschen
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { guestbook, updateGuestbook, deleteGuestbook } = useGuestbook();

const saving = ref(false);

const imageWidth = ref(defaultImageSize.width);
const imageHeight = ref(defaultImageSize.height);
watch(guestbook, () => {
  imageWidth.value = guestbook.value?.imageSize?.width ?? defaultImageSize.width;
  imageHeight.value = guestbook.value?.imageSize?.height ?? defaultImageSize.height;
  if (guestbook.value && !guestbook.value.imageSystemPrompt) {
    guestbook.value.imageSystemPrompt = defaultImageSystemPrompt;
  }
  if (guestbook.value && !guestbook.value.imageQuality) {
    guestbook.value.imageQuality = defaultImageQuality;
  }
}, { immediate: true });

async function save() {
  if (!guestbook.value) {
    return;
  }
  try {
    saving.value = true;
    guestbook.value.imageSize = {
      width: roundToMultipleOf16(imageWidth.value),
      height: roundToMultipleOf16(imageHeight.value),
    };
    await updateGuestbook(guestbook.value);
    useToast().add({ title: 'Gästebuch aktualisiert', color: 'success' });
    await useRouter().replace(`/${guestbook.value.id}`);
  }
  finally {
    saving.value = false;
  }
}

async function remove() {
  if (!guestbook.value) {
    return;
  }
  // eslint-disable-next-line no-alert
  if (!confirm('Bist du dir sicher, dass du das Gästebuch mit allen Inhalten löschen möchtest?')) {
    return;
  }
  saving.value = true;
  try {
    await deleteGuestbook(guestbook.value);
    useToast().add({ title: 'Gästebuch gelöscht', color: 'success' });
    await useRouter().replace('/');
  }
  finally {
    saving.value = false;
  }
}
</script>
