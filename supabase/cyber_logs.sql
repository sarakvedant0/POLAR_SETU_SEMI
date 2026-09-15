create table if not exists public.cyber_logs (
  id text primary key,
  username text not null,
  reason text not null,
  severity text not null check (severity in ('MEDIUM', 'HIGH', 'CRITICAL')),
  blocked_text_snippet text not null,
  timestamp text not null,
  action_taken text not null,
  created_at timestamptz not null default now()
);

alter table public.cyber_logs enable row level security;

drop policy if exists "Authenticated users can read cyber logs" on public.cyber_logs;
create policy "Authenticated users can read cyber logs"
  on public.cyber_logs for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can write cyber logs" on public.cyber_logs;
create policy "Authenticated users can write cyber logs"
  on public.cyber_logs for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update cyber logs" on public.cyber_logs;
create policy "Authenticated users can update cyber logs"
  on public.cyber_logs for update
  to authenticated
  using (true)
  with check (true);