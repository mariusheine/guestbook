import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const pageNumber = Math.max(1, Number(params.pageNumber)); // Math.max(1, Number(params.pageNumber) || 1);

  const [page] = await useDb().select().from(tables.pages).offset(pageNumber - 1).limit(1).orderBy(desc(tables.pages.createdAt));

  return page;
})