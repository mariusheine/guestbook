import { useLocalStorage } from '@vueuse/core';
import OpenAI from 'openai';

export const openAiApiKey = useLocalStorage<string | undefined>('guestbook:openAiApiKey', undefined);

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

export async function requestImage(prompt: string, context: string) {
  const response = await useOpenAi().images.generate({
    prompt: `We are filling out a page on a party guestbook. We want our entry to be enriched by a nice image based on the following information: 
    ${prompt}
    
    Here is some additional context: ${context}.`,
    n: 1,
    size: '1792x1024',
    model: 'dall-e-3',
    response_format: 'b64_json',
  });
  if (!response.data) {
    throw new Error('No image returned');
  }
  const { b64_json } = response.data[0];
  if (!b64_json) {
    throw new Error('No image returned');
  }
  return {
    url: `data:image/jpeg;base64,${b64_json}`,
  };
}
