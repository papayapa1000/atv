create extension if not exists pgcrypto with schema extensions;

create table if not exists public.stay_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 80),
  price text not null check (char_length(price) between 1 and 80),
  content text not null check (char_length(content) between 5 and 4000),
  image_urls text[] not null default '{}',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  constraint stay_posts_image_urls_count check (cardinality(image_urls) between 1 and 10)
);

create index if not exists stay_posts_created_at_idx on public.stay_posts (created_at desc);
create index if not exists stay_posts_published_sort_idx on public.stay_posts (is_published, sort_order asc, created_at desc);

create or replace function public.set_stay_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stay_posts_set_updated_at on public.stay_posts;

create trigger stay_posts_set_updated_at
before update on public.stay_posts
for each row
execute function public.set_stay_posts_updated_at();

alter table public.stay_posts enable row level security;

revoke all on public.stay_posts from anon, authenticated;
grant select, insert, update, delete on public.stay_posts to service_role;
