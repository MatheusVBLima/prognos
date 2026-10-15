import { sql } from "drizzle-orm"
import { index, pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase"

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}

// One row per auth user, created by the on_auth_user_created trigger
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (table) => [
    pgPolicy("profiles_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("profiles_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
  ]
).enableRLS()

// A creator's product, brand or channel that content is made for
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    websiteUrl: text("website_url"),
    description: text("description").notNull(),
    niche: text("niche"),
    audience: text("audience"),
    goals: text("goals"),
    language: text("language").notNull().default("en"),
    country: text("country"),
    ...timestamps,
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    pgPolicy("projects_all_own", {
      for: "all",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
  ]
).enableRLS()

export type Profile = typeof profiles.$inferSelect
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
