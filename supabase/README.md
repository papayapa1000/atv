# Supabase Setup

Apply the migrations in `supabase/migrations`, then create the initial admin user in the Supabase SQL editor with a deployment-specific password:

```sql
insert into public.admin_users (username, password)
values ('admin', '<replace-with-a-strong-password>')
on conflict (username) do update
set password = excluded.password;
```

Keep `SUPABASE_SERVICE_ROLE_KEY` on the server only. Do not expose it in client-side code or commit real environment files.
