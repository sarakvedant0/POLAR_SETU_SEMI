create table if not exists public.reports (
  id text primary key,
  target_id text not null,
  target_type text not null,
  target_title text not null,
  reported_by_username text not null,
  reason text not null,
  details text not null,
  timestamp text not null,
  status text not null,
  ai_audit jsonb not null,
  admin_notes text,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

drop policy if exists "Reports are readable by authenticated users" on public.reports;
create policy "Reports are readable by authenticated users"
  on public.reports for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users manage reports" on public.reports;
create policy "Authenticated users manage reports"
  on public.reports for all
  to authenticated
  using (true)
  with check (true);