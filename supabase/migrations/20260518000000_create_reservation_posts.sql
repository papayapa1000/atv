create extension if not exists pgcrypto with schema extensions;

create table if not exists public.reservation_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 20),
  password_hash text not null,
  phone text not null,
  people_count integer not null check (people_count between 1 and 300),
  reservation_date date not null,
  reservation_period text not null check (reservation_period in ('오전', '오후')),
  reservation_hour smallint not null check (reservation_hour between 1 and 12),
  leisure_type text check (leisure_type is null or char_length(leisure_type) <= 80),
  depositor_name text check (depositor_name is null or char_length(depositor_name) <= 30),
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  admin_note text
);

create index if not exists reservation_posts_created_at_idx on public.reservation_posts (created_at desc);
create index if not exists reservation_posts_schedule_idx on public.reservation_posts (reservation_date, reservation_period, reservation_hour);
create index if not exists reservation_posts_status_idx on public.reservation_posts (status);

create or replace function public.set_reservation_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservation_posts_set_updated_at on public.reservation_posts;

create trigger reservation_posts_set_updated_at
before update on public.reservation_posts
for each row
execute function public.set_reservation_posts_updated_at();

alter table public.reservation_posts enable row level security;

revoke all on public.reservation_posts from anon, authenticated;
grant select, insert, update, delete on public.reservation_posts to service_role;
