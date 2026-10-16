-- Brand kit: the visual identity and voice used for everything created for a project
create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source text not null check (source in ('website', 'generated', 'manual')),
  logo_url text,
  -- [{ "name": "Primary", "hex": "#7C3AED", "role": "primary" }, ...]
  colors jsonb not null default '[]'::jsonb check (jsonb_typeof(colors) = 'array'),
  heading_font text not null default 'Inter',
  body_font text not null default 'Inter',
  tone_of_voice text,
  voice_traits text[] not null default '{}',
  keywords text[] not null default '{}',
  value_proposition text,
  audience_summary text,
  -- Raw signals read from the website, kept for later regeneration
  website_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brand_kits_user_id_idx on public.brand_kits (user_id);

alter table public.brand_kits enable row level security;

create policy "Users can read their own brand kits" on public.brand_kits
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create brand kits for their own projects" on public.brand_kits
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
  );

create policy "Users can update their own brand kits" on public.brand_kits
  for update to authenticated using ((select auth.uid()) = user_id) with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.projects p where p.id = project_id and p.user_id = (select auth.uid()))
  );

create policy "Users can delete their own brand kits" on public.brand_kits
  for delete to authenticated using ((select auth.uid()) = user_id);

create trigger brand_kits_set_updated_at before update on public.brand_kits
  for each row execute function public.set_updated_at();
