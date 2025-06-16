import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  return await useDb().select({ id: tables.pages.id }).from(tables.pages).orderBy(desc(tables.pages.createdAt));
})