create extension if not exists pgcrypto with schema extensions;

create table if not exists public.gallery_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 80),
  image_url text not null,
  content text not null check (char_length(content) between 5 and 2000),
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists gallery_posts_created_at_idx on public.gallery_posts (created_at desc);
create index if not exists gallery_posts_published_sort_idx on public.gallery_posts (is_published, sort_order asc, created_at desc);

create or replace function public.set_gallery_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_posts_set_updated_at on public.gallery_posts;

create trigger gallery_posts_set_updated_at
before update on public.gallery_posts
for each row
execute function public.set_gallery_posts_updated_at();

alter table public.gallery_posts enable row level security;

revoke all on public.gallery_posts from anon, authenticated;
grant select, insert, update, delete on public.gallery_posts to service_role;
