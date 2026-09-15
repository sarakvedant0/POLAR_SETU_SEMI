create table if not exists public.facts (
  id uuid primary key,
  statement text not null,
  explanation text not null default '',
  source text not null default '',
  verified boolean not null default true,
  category text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.facts enable row level security;

drop policy if exists "Facts are publicly readable" on public.facts;
create policy "Facts are publicly readable"
  on public.facts for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users manage facts" on public.facts;
create policy "Authenticated users manage facts"
  on public.facts for all
  to authenticated
  using (true)
  with check (true);