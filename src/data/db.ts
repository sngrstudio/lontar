import { drizzle } from "drizzle-orm/bun-sqlite";
import {Database} from "bun:sqlite"

const sqliteDb = new Database(":memory:")
export const db = drizzle(sqliteDb)
