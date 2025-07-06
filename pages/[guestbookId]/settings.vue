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

      <UButton
        class="justify-center disabled:bg-gray-500"
        :loading="saving"
        @click="save"
      >
        Erstellen
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

async function save() {
  if (!guestbook.value) {
    return;
  }
  try {
    saving.value = true;
    await updateGuestbook(guestbook.value);
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
    await useRouter().replace('');
  }
  finally {
    saving.value = false;
  }
}
</script>
