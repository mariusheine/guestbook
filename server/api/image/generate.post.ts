export default defineEventHandler(async (event) => {
  const { prompt , context} = await readBody<{ prompt: string; context?: string }>(event);
  
  if (!prompt) {
    throw new Error('No prompt provided');
  }

  const partyContext = useRuntimeConfig().public.partyContext;
  
  const response = await useOpenAi().images.generate({
    prompt: `We are filling out a page on a party guestbook. We want our entry to be enriched by a nice image based on the following information: 
    ${prompt}
    
    Here is some additional context: ${context || partyContext}.`,
    n: 1,
    size: '1792x1024',
    model: 'dall-e-3',
    response_format: 'b64_json'
  });
  const { b64_json } = response.data[0];
  if (!b64_json) {
    throw new Error('No image returned');
  }
  return {
    url: `data:image/jpeg;base64,${b64_json}`,
  };
});