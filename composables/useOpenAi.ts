import { useLocalStorage } from '@vueuse/core';
import OpenAI from 'openai';

export const openAiApiKey = useLocalStorage<string | undefined>(
  'guestbook:openAiApiKey',
  undefined,
);

export const defaultImageSize = { width: 1920, height: 1072 };
export const defaultImageQuality = 'medium' as const;

export const defaultImageSystemPrompt = `We are filling out a page on a party guestbook. We want our entry to be enriched by a nice image based on the following information:`;

// the OpenAI image API requires width and height to be multiples of 16
export function roundToMultipleOf16(value: number) {
  return Math.max(16, Math.round(value / 16) * 16);
}

export function useOpenAi() {
  if (!openAiApiKey.value) {
    throw new Error('No OpenAI Api key provided');
  }
  const openai = new OpenAI({
    apiKey: openAiApiKey.value,
    dangerouslyAllowBrowser: true,
  });
  return openai;
}

export async function requestImage(prompt: string, additionalContext: string, imageSize = defaultImageSize, systemPrompt = defaultImageSystemPrompt, quality: 'low' | 'medium' | 'high' = defaultImageQuality) {
  const width = roundToMultipleOf16(imageSize.width);
  const height = roundToMultipleOf16(imageSize.height);
  const response = await useOpenAi().images.generate({
    prompt: `${systemPrompt}

    ${prompt}

    ${additionalContext}.`,
    n: 1,
    size: `${width}x${height}`,
    model: 'gpt-image-2',
    quality,
  });
  const image = response.data?.[0];
  if (!image?.b64_json) {
    throw new Error('No image returned');
  }
  return {
    url: `data:image/jpeg;base64,${image.b64_json}`,
  };
}
