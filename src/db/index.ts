import "server-only"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const globalForDb = globalThis as unknown as { db?: PostgresJsDatabase<typeof schema> }

// Created on first use so builds don't need DATABASE_URL
export function getDb() {
  if (!globalForDb.db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    // prepare: false is required by Supabase's transaction pooler
    globalForDb.db = drizzle({ client: postgres(url, { prepare: false }), schema })
  }
  return globalForDb.db
}
