insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'stay-images',
  'stay-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read stay images" on storage.objects;
create policy "Public read stay images"
on storage.objects
for select
to public
using (bucket_id = 'stay-images');

drop policy if exists "Service role manages stay images" on storage.objects;
create policy "Service role manages stay images"
on storage.objects
for all
to service_role
using (bucket_id = 'stay-images')
with check (bucket_id = 'stay-images');
