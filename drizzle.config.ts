import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  // Supabase owns these schemas; only manage our own tables
  schemaFilter: ["public"],
  entities: { roles: { provider: "supabase" } },
})
