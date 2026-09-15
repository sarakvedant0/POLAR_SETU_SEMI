create table if not exists public.expeditions (
  id text primary key,
  name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.expeditions enable row level security;

drop policy if exists "Expeditions are publicly readable" on public.expeditions;
create policy "Expeditions are publicly readable"
  on public.expeditions for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users manage expeditions" on public.expeditions;
create policy "Authenticated users manage expeditions"
  on public.expeditions for all
  to authenticated
  using (true)
  with check (true);