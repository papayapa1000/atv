create extension if not exists pgcrypto with schema extensions;

create table if not exists public.video_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 80),
  source_type text not null check (source_type in ('youtube', 'file')),
  youtube_url text,
  youtube_id text,
  video_url text,
  content text not null check (char_length(content) between 5 and 2000),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  constraint video_posts_source_check check (
    (source_type = 'youtube' and youtube_url is not null and youtube_id is not null and video_url is null)
    or
    (source_type = 'file' and video_url is not null and youtube_url is null and youtube_id is null)
  )
);

create index if not exists video_posts_created_at_idx on public.video_posts (created_at desc);
create index if not exists video_posts_published_sort_idx on public.video_posts (is_published, sort_order asc, created_at desc);

create or replace function public.set_video_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists video_posts_set_updated_at on public.video_posts;

create trigger video_posts_set_updated_at
before update on public.video_posts
for each row
execute function public.set_video_posts_updated_at();

alter table public.video_posts enable row level security;

revoke all on public.video_posts from anon, authenticated;
grant select, insert, update, delete on public.video_posts to service_role;
