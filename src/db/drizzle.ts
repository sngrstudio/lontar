import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { user } from './schema/users'

const client = createClient({ url: import.meta.env.DATABASE });

export const db = drizzle(client, { schema: { user } });