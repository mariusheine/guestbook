<template>
  <LoadingIndicator v-if="!guestbook" />
  <template v-else>
    <h1>{{ guestbook.title }}</h1>
    <UCard class="w-full">
      <template #header>
        <h2>Dein Gästebucheintrag</h2>
      </template>
      <div class="flex flex-col space-y-4">
        <UFormField label="Autor" name="author">
          <UInput v-model="page.author" class="w-full" />
        </UFormField>

        <UFormField label="Eintrag" name="content">
          <UTextarea
            v-model="page.content"
            :rows="6"
            class="w-full"
            resize
            color="primary"
            variant="outline"
            placeholder="Gib hier deinen Gästebucheintrag ein..."
          />
        </UFormField>

        <div class="text-gray-500">
          Zu deinem Eintrag wird nach dem Absenden ein Bild mit Hilfe von
          <a href="https://openai.com/index/dall-e-3/" target="_blank">DALL·E 3</a>
          ein Bild erstellt. Du kannst unabhängig von deinem Gästebucheintrag für
          die Bildgenerierung zusätzlichen Kontext angeben. Sei bitte vorsichtig
          mit Namen und sehr persönlichen Informationen!
        </div>
        <details>
          <summary>Zusätzlicher Kontext für Bildgenerierung</summary>
          <UTextarea
            v-model="imageContext"
            :rows="5"
            class="w-full"
            resize
            color="primary"
            variant="outline"
            placeholder="Gib hier zusätzliche Informationen für die Bildgenerierung ein..."
          />
        </details>

        <UButton
          class="justify-center disabled:bg-gray-500"
          :loading="renderingImage || saving"
          @click="generateImage"
        >
          {{ image ? "Nochmal versuchen" : "Absenden" }}
        </UButton>
      </div>
    </UCard>
    <UCard class="w-full">
      <template #header>
        <h1>Das Bild zu deinem Gästebucheintrag</h1>
      </template>
      <div class="flex flex-col space-y-4">
        <div class="flex gap-4 justify-center">
          <UButton
            :disabled="renderingImage || selectedImage <= 0"
            class="disabled:bg-gray-500"
            @click="selectedImage = selectedImage - 1"
          >
            Vorheriges Bild
          </UButton>
          <UButton
            :disabled="renderingImage || selectedImage >= imageStack.length - 1"
            class="disabled:bg-gray-500"
            @click="selectedImage = selectedImage + 1"
          >
            Nächstes Bild
          </UButton>
        </div>
        <UProgress v-if="renderingImage" animation="swing" />
        <template v-else-if="image">
          <img :src="image">

          <UButton
            class="justify-center disabled:bg-gray-500"
            :loading="saving"
            @click="save"
          >
            Eintragen
          </UButton>
        </template>
      </div>
    </UCard>
  </template>
</template>

<script setup lang="ts">
import { z } from 'zod';

const { guestbook, addPage } = useGuestbook();

const schema = z.object({
  author: z.string().optional(),
  content: z.string().min(1),
});

type Schema = z.output<typeof schema>;

const page = ref<Schema>({
  author: undefined,
  content: '',
});

const renderingImage = ref(false);
const imageContext = ref<string>('');
watch(guestbook, () => {
  if (guestbook.value && guestbook.value.description) {
    imageContext.value = guestbook.value.description;
  }
}, { immediate: true });

const imageStack = ref<{ imageUrl: string; context: string }[]>([]);
const selectedImage = ref<number>(-1);

watch(selectedImage, () => {
  imageContext.value = imageStack.value[selectedImage.value]?.context || '';
});

const image = computed(() => {
  if (selectedImage.value < 0) {
    return undefined;
  }
  return imageStack.value[selectedImage.value].imageUrl;
});

async function generateImage() {
  try {
    renderingImage.value = true;
    const response = await requestImage(page.value.content, imageContext.value);
    imageStack.value.push({
      imageUrl: response.url,
      context: imageContext.value,
    });
    selectedImage.value = imageStack.value.length - 1;
  }
  finally {
    renderingImage.value = false;
  }
}

const saving = ref(false);

async function save() {
  if (!guestbook.value || !schema.safeParse(page.value)) {
    return;
  }
  try {
    saving.value = true;
    const { imageUrl, context } = imageStack.value[selectedImage.value];
    await addPage({ ...page.value, image: imageUrl, imageContext: context });
    await useRouter().replace(`/${guestbook.value.id}`);
  }
  finally {
    saving.value = false;
  }
}
</script>
