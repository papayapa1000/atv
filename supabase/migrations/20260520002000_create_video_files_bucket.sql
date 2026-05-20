insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'video-files',
  'video-files',
  true,
  52428800,
  array['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read access for video files" on storage.objects;

create policy "Public read access for video files"
on storage.objects
for select
to public
using (bucket_id = 'video-files');

drop policy if exists "Service role manages video files" on storage.objects;

create policy "Service role manages video files"
on storage.objects
for all
to service_role
using (bucket_id = 'video-files')
with check (bucket_id = 'video-files');
