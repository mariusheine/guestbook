import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

export const tables = schema;

const config = useRuntimeConfig();

export function useDb() {
  const client = new Database(config.database);
  return drizzle(client, { schema });
}
