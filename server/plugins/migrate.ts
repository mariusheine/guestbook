import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

export default defineNitroPlugin(async () => {
  console.log('Migrating database ...');

  const db = useDb();
  await migrate(db, { migrationsFolder: './migrations' });

  console.log('Database migrated.');
});
