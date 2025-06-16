import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const pages = sqliteTable('pages', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  author: text('author'),
  content: text('content').notNull(),
  image: text('image').notNull(),
  imageContext: text('imageContext').default(''),
  createdAt: text('createdAt').notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Page = typeof pages.$inferSelect
