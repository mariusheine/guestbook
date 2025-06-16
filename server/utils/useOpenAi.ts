import OpenAI from 'openai';

export default function useOpenAi() {
  const openai = new OpenAI({
    apiKey: useRuntimeConfig().openaiApiKey,
  });
  return openai;
}