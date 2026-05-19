create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  username text not null unique check (char_length(username) between 3 and 40),
  password text not null
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null
);

create index if not exists admin_sessions_token_hash_idx on public.admin_sessions (token_hash);
create index if not exists admin_sessions_expires_at_idx on public.admin_sessions (expires_at);

create or replace function public.set_admin_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;

create trigger admin_users_set_updated_at
before update on public.admin_users
for each row
execute function public.set_admin_users_updated_at();

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.admin_sessions from anon, authenticated;

grant select, insert, update, delete on public.admin_users to service_role;
grant select, insert, update, delete on public.admin_sessions to service_role;
