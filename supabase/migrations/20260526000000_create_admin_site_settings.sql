create table if not exists public.admin_site_settings (
  id boolean primary key default true check (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reservation_email_enabled boolean not null default true,
  reservation_recipient_email text not null default 'lallafm1984@gmail.com' check (
    char_length(reservation_recipient_email) <= 254
    and position('@' in reservation_recipient_email) > 1
  ),
  smtp_host text not null default 'smtp.gmail.com' check (char_length(smtp_host) between 1 and 255),
  smtp_port integer not null default 465 check (smtp_port between 1 and 65535),
  smtp_secure boolean not null default true,
  smtp_user text not null default 'lallafm1984@gmail.com' check (char_length(smtp_user) between 1 and 254),
  smtp_password text not null default '' check (char_length(smtp_password) <= 500),
  smtp_from text not null default '제천 수상레저 예약 알림 <lallafm1984@gmail.com>' check (char_length(smtp_from) between 1 and 320)
);

insert into public.admin_site_settings (id, reservation_email_enabled, reservation_recipient_email)
values (true, true, 'lallafm1984@gmail.com')
on conflict (id) do nothing;

create or replace function public.set_admin_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_site_settings_set_updated_at on public.admin_site_settings;

create trigger admin_site_settings_set_updated_at
before update on public.admin_site_settings
for each row
execute function public.set_admin_site_settings_updated_at();

alter table public.admin_site_settings enable row level security;

revoke all on public.admin_site_settings from anon, authenticated;
grant select, insert, update on public.admin_site_settings to service_role;
