alter table public.gallery_posts
add column if not exists image_urls text[] not null default '{}';

update public.gallery_posts
set image_urls = case
  when image_url ~ '^\s*\[' then array(
    select jsonb_array_elements_text(image_url::jsonb)
  )
  else array[image_url]
end
where image_url is not null
  and cardinality(image_urls) = 0;

alter table public.gallery_posts
drop constraint if exists gallery_posts_image_urls_count;

alter table public.gallery_posts
add constraint gallery_posts_image_urls_count check (cardinality(image_urls) between 1 and 8);
