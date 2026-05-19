create table if not exists public.reservation_replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reservation_id uuid not null references public.reservation_posts(id) on delete cascade,
  author_type text not null check (author_type in ('customer', 'admin')),
  message text not null check (char_length(message) between 1 and 1000)
);

create index if not exists reservation_replies_reservation_created_idx
on public.reservation_replies (reservation_id, created_at asc);

create table if not exists public.reservation_view_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reservation_id uuid not null references public.reservation_posts(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null
);

create unique index if not exists reservation_view_sessions_token_hash_idx
on public.reservation_view_sessions (token_hash);

create index if not exists reservation_view_sessions_reservation_idx
on public.reservation_view_sessions (reservation_id);

create index if not exists reservation_view_sessions_expires_at_idx
on public.reservation_view_sessions (expires_at);

alter table public.reservation_replies enable row level security;
alter table public.reservation_view_sessions enable row level security;

revoke all on public.reservation_replies from anon, authenticated;
revoke all on public.reservation_view_sessions from anon, authenticated;

grant select, insert, update, delete on public.reservation_replies to service_role;
grant select, insert, update, delete on public.reservation_view_sessions to service_role;
