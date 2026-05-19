alter table public.showcase_posts
add column if not exists image_urls text[] not null default '{}';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'showcase_posts'
      and column_name = 'image_url'
  ) then
    execute 'update public.showcase_posts set image_urls = array[image_url] where image_url is not null and cardinality(image_urls) = 0';
  end if;
end;
$$;

alter table public.showcase_posts
drop constraint if exists showcase_posts_image_urls_count;

alter table public.showcase_posts
add constraint showcase_posts_image_urls_count check (cardinality(image_urls) <= 5);
