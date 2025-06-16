import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: { url: `file:${process.env.NUXT_DATABASE}` },
  schema: './server/utils/database/schema.ts',
  out: './migrations',
});
