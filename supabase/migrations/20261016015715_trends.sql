-- Niche trends: the keywords a project tracks, the raw signals collected for them,
-- and the content opportunities the AI builds from those signals

-- True when the signed-in user owns the project; used by the policies below
create function public.owns_project(target uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from public.projects p where p.id = target and p.user_id = (select auth.uid()));
$$;

-- Keywords: the topics a project's trend research is built around
create table public.keywords (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  term text not null check (char_length(term) between 1 and 80),
  source text not null default 'user' check (source in ('ai', 'user')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index keywords_project_term_idx on public.keywords (project_id, lower(term));
create index keywords_user_id_idx on public.keywords (user_id);

-- Trend runs: one row per refresh, for "last updated", rate limits and errors
create table public.trend_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trigger text not null check (trigger in ('manual', 'schedule')),
  status text not null default 'running' check (status in ('running', 'succeeded', 'failed')),
  sources text[] not null default '{}',
  error text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index trend_runs_project_started_idx on public.trend_runs (project_id, started_at desc);
create index trend_runs_user_id_idx on public.trend_runs (user_id);

-- Trend signals: raw data from each source, kept so ideas can show their evidence
create table public.trend_signals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  run_id uuid references public.trend_runs (id) on delete set null,
  source text not null check (source in ('google_trends', 'youtube', 'web')),
  keyword text not null,
  region text,
  payload jsonb not null,
  collected_at timestamptz not null default now()
);

create index trend_signals_project_collected_idx on public.trend_signals (project_id, collected_at desc);
create index trend_signals_user_id_idx on public.trend_signals (user_id);
create index trend_signals_run_id_idx on public.trend_signals (run_id);

-- Trend ideas: content opportunities for the project, scored and explained
create table public.trend_ideas (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  run_id uuid references public.trend_runs (id) on delete set null,
  title text not null,
  summary text not null,
  why_now text not null,
  score smallint not null check (score between 0 and 100),
  momentum smallint not null check (momentum between 0 and 10),
  fit smallint not null check (fit between 0 and 10),
  competition smallint not null check (competition between 0 and 10),
  platforms text[] not null default '{}',
  keywords text[] not null default '{}',
  hooks text[] not null default '{}',
  formats text[] not null default '{}',
  -- [{ "type": "query" | "video" | "article", "label": ..., "url": ..., "metric": ... }]
  evidence jsonb not null default '[]'::jsonb,
  -- [{ "date": "2026-10-01", "value": 42 }] for the main keyword
  interest jsonb not null default '[]'::jsonb,
  status text not null default 'new' check (status in ('new', 'saved', 'dismissed', 'used')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trend_ideas_project_status_idx on public.trend_ideas (project_id, status, score desc);
create index trend_ideas_user_id_idx on public.trend_ideas (user_id);
create index trend_ideas_run_id_idx on public.trend_ideas (run_id);

create trigger trend_ideas_set_updated_at before update on public.trend_ideas
  for each row execute function public.set_updated_at();

-- Same rules on every table: users see and change only rows for their own projects
alter table public.keywords enable row level security;
alter table public.trend_runs enable row level security;
alter table public.trend_signals enable row level security;
alter table public.trend_ideas enable row level security;

create policy "Users can read their own keywords" on public.keywords
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can add keywords to their own projects" on public.keywords
  for insert to authenticated with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can update their own keywords" on public.keywords
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can delete their own keywords" on public.keywords
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can read their own trend runs" on public.trend_runs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can start trend runs for their own projects" on public.trend_runs
  for insert to authenticated with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can update their own trend runs" on public.trend_runs
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and public.owns_project(project_id));

create policy "Users can read their own trend signals" on public.trend_signals
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can store trend signals for their own projects" on public.trend_signals
  for insert to authenticated with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can delete their own trend signals" on public.trend_signals
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can read their own trend ideas" on public.trend_ideas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can store trend ideas for their own projects" on public.trend_ideas
  for insert to authenticated with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can update their own trend ideas" on public.trend_ideas
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and public.owns_project(project_id));
create policy "Users can delete their own trend ideas" on public.trend_ideas
  for delete to authenticated using ((select auth.uid()) = user_id);
