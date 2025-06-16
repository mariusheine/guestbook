export default defineEventHandler(async (event) => {
  // omit id and createdAt because they are automatically filled
  const { id, createdAt, ...page } = await readBody<Page>(event);

  const [savedPage] = await useDb()
    .insert(tables.pages)
    .values(page)
    .returning();

  return savedPage;
});
