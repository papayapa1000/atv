alter table public.admin_users
add column if not exists password text;

alter table public.admin_users
alter column password set not null;

alter table public.admin_users
drop column if exists password_hash;
