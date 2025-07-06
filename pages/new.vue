<template>
  <UCard class="w-full">
    <template #header>
      <h1>Dein neues Gästebuch</h1>
    </template>
    <div class="flex flex-col space-y-4">
      <UFormField label="Titel" name="title" required>
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
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod';

const { createGuestbook } = useGuestbook();

const schema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const guestbook = ref<Schema>({
  title: '',
});

const saving = ref(false);

async function save() {
  if (!schema.safeParse(guestbook.value).success) {
    useToast().add({ title: 'Fehlende Eingaben', color: 'error' });
    return;
  }
  try {
    saving.value = true;
    const createdGuestbook = await createGuestbook(guestbook.value);
    await useRouter().replace(`/${createdGuestbook.id}`);
  }
  finally {
    saving.value = false;
  }
}
</script>
