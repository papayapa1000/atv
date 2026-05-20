insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-images',
  'gallery-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read access for gallery images" on storage.objects;

create policy "Public read access for gallery images"
on storage.objects
for select
to public
using (bucket_id = 'gallery-images');

drop policy if exists "Service role manages gallery images" on storage.objects;

create policy "Service role manages gallery images"
on storage.objects
for all
to service_role
using (bucket_id = 'gallery-images')
with check (bucket_id = 'gallery-images');
