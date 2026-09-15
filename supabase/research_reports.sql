create table if not exists public.research_reports (
  id text primary key,
  title text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.research_reports enable row level security;

drop policy if exists "Research reports are publicly readable" on public.research_reports;
create policy "Research reports are publicly readable"
  on public.research_reports for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users manage research reports" on public.research_reports;
create policy "Authenticated users manage research reports"
  on public.research_reports for all
  to authenticated
  using (true)
  with check (true);