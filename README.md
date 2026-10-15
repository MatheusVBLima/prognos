# Prognos

Trend-driven content for creators. Prognos learns what your project is about, finds what's trending in your niche, and helps you turn it into scripts, posts and carousels with AI.

See the product roadmap in the project plan. This repository currently covers:

- Accounts with Supabase Auth (email/password and Google)
- Projects: the products, brands or channels a user creates content for
- A trends dashboard (sample data for now; live per-niche sources come next)
- A script studio that writes short-form video scripts with Gemini and narrates them with OpenAI TTS

## Stack

Next.js 16 (App Router) · React 19 · shadcn/ui + Tailwind CSS 4 · Supabase (Auth + Postgres) · Drizzle ORM · AI SDK

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then copy `.env.example` to `.env.local` and fill in the values.

3. Apply the database migrations:

   ```bash
   npm run db:migrate
   ```

4. In the Supabase dashboard, under Authentication > URL Configuration, set the Site URL to your app URL and add `http://localhost:3000/auth/callback` (and your production `/auth/callback`) to the redirect URLs. To enable Google sign-in, turn on the Google provider under Authentication > Sign In / Providers.

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run typecheck` | Type-check the project |
| `npm run db:generate` | Generate a migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to `DATABASE_URL` |
| `npm run db:studio` | Browse the database with Drizzle Studio |

## Project layout

- `src/app/(auth)`: sign-in and sign-up pages and auth server actions
- `src/app/dashboard`: the signed-in app (overview, projects, trends, studio)
- `src/db`: Drizzle schema, client and queries; migrations live in `drizzle/`
- `src/lib/supabase`: Supabase clients for the browser, server and proxy
- `src/proxy.ts`: refreshes the session and protects `/dashboard`
