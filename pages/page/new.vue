<template>
  <UCard class="w-full">
    <template #header>
      <h1>Dein Gästebucheintrag</h1>
    </template>
    <div class="flex flex-col space-y-4">
      <UFormGroup label="Autor" name="author">
        <UInput v-model="page.author" />
      </UFormGroup>

      <UFormGroup label="Eintrag" name="content">
        <UTextarea
          v-model="page.content"
          :rows="6"
          class="w-full"
          resize
          color="primary"
          variant="outline"
          placeholder="Gib hier deinen Gästebucheintrag ein..."
        />
      </UFormGroup>

      <div class="text-gray-500">
        Zu deinem Eintrag wird nach dem Absenden ein Bild mit Hilfe von
        <a href="https://openai.com/index/dall-e-3/" target="_blank"
          >DALL·E 3</a
        >
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
          placeholder="Gib hier zusätzliche Informationen für die Bildgenerierun ein..."
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
          >Vorheriges Bild</UButton
        >
        <UButton
          :disabled="renderingImage || selectedImage >= imageStack.length - 1"
          class="disabled:bg-gray-500"
          @click="selectedImage = selectedImage + 1"
          >Nächstes Bild</UButton
        >
      </div>
      <UProgress v-if="renderingImage" animation="swing" />
      <template v-else-if="image">
        <img :src="image" />

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

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  author: z.string().optional(),
  content: z.string().min(1),
});

type Schema = z.output<typeof schema>;

const page = reactive<Schema>({
  author: undefined,
  content: "",
});

const renderingImage = ref(false);
const imageContext = ref<string>(useRuntimeConfig().public.partyContext);

const imageStack = ref<{ imageUrl: string; context: string }[]>([]);
const selectedImage = ref<number>(-1);

watch(selectedImage, () => {
  imageContext.value = imageStack.value[selectedImage.value]?.context || '';
})

const image = computed(() => {
  if (selectedImage.value < 0) {
    return undefined;
  }
  return imageStack.value[selectedImage.value].imageUrl;
});

async function generateImage() {
  try {
    renderingImage.value = true;
    const response = await $fetch("/api/image/generate", {
      method: "POST",
      body: { prompt: page.content, context: imageContext.value },
    });
    imageStack.value.push({
      imageUrl: response.url,
      context: imageContext.value,
    });
    selectedImage.value = imageStack.value.length - 1;
  } finally {
    renderingImage.value = false;
  }
}

const saving = ref(false);

async function save() {
  try {
    saving.value = true;
    const { imageUrl, context } = imageStack.value[selectedImage.value];
    await $fetch("/api/page", {
      method: "POST",
      body: { ...page, image: imageUrl, imageContext: context },
    });
    await useRouter().replace("/");
  } finally {
    saving.value = false;
  }
}
</script>
