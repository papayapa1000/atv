create extension if not exists pgcrypto with schema extensions;

create table if not exists public.showcase_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_name text not null check (char_length(author_name) between 2 and 30),
  title text not null check (char_length(title) between 2 and 80),
  content text not null check (char_length(content) between 5 and 2000),
  link_url text check (link_url is null or char_length(link_url) <= 500),
  image_urls text[] not null default '{}',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  constraint showcase_posts_image_urls_count check (cardinality(image_urls) <= 5)
);

create index if not exists showcase_posts_created_at_idx on public.showcase_posts (created_at desc);
create index if not exists showcase_posts_published_created_idx on public.showcase_posts (is_published, created_at desc);

create or replace function public.set_showcase_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists showcase_posts_set_updated_at on public.showcase_posts;

create trigger showcase_posts_set_updated_at
before update on public.showcase_posts
for each row
execute function public.set_showcase_posts_updated_at();

alter table public.showcase_posts enable row level security;

revoke all on public.showcase_posts from anon, authenticated;
grant select, insert, update, delete on public.showcase_posts to service_role;
