# Supabase Setup

Apply the migrations in `supabase/migrations`, then create the initial admin user in the Supabase SQL editor with a deployment-specific password:

```sql
insert into public.admin_users (username, password)
values ('admin', '<replace-with-a-strong-password>')
on conflict (username) do update
set password = excluded.password;
```

Keep `SUPABASE_SERVICE_ROLE_KEY` on the server only. Do not expose it in client-side code or commit real environment files.

Gallery image uploads use the public Supabase Storage bucket `gallery-images`, created by the migrations. Override the bucket name with `SUPABASE_GALLERY_IMAGES_BUCKET` only if you also update the matching storage migration/policies.

Showcase image uploads use the public Supabase Storage bucket `showcase-images`, created by the migrations. Override the bucket name with `SUPABASE_SHOWCASE_IMAGES_BUCKET` only if you also update the matching storage migration/policies.

Stay image uploads use the public Supabase Storage bucket `stay-images`, created by the migrations. Override the bucket name with `SUPABASE_STAY_IMAGES_BUCKET` only if you also update the matching storage migration/policies.

Video file uploads use the public Supabase Storage bucket `video-files`, created by the migrations. Override the bucket name with `SUPABASE_VIDEO_FILES_BUCKET` only if you also update the matching storage migration/policies.

The `video-files` migration sets the bucket-level limit to 50 MB so it matches the current Supabase global upload limit.

Image uploads are re-encoded to WebP on the server before they are uploaded to Supabase Storage. The original image file is not uploaded.

The admin dashboard calculates available Storage capacity from the Storage API object sizes and `SUPABASE_STORAGE_QUOTA_GB`. If the variable is omitted, it uses the Supabase Free plan Storage Size quota of 1 GB as the baseline.
