create table if not exists public.interactions (
  id text primary key,
  user_key text not null,
  interaction_type text not null,
  target_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.interactions enable row level security;

drop policy if exists "Interactions are readable" on public.interactions;
create policy "Interactions are readable"
  on public.interactions for select
  to anon, authenticated
  using (true);

drop policy if exists "Interactions are writable" on public.interactions;
create policy "Interactions are writable"
  on public.interactions for all
  to anon, authenticated
  using (true)
  with check (true);
