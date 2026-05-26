alter table public.admin_site_settings
  add column if not exists smtp_host text not null default 'smtp.gmail.com' check (char_length(smtp_host) between 1 and 255),
  add column if not exists smtp_port integer not null default 465 check (smtp_port between 1 and 65535),
  add column if not exists smtp_secure boolean not null default true,
  add column if not exists smtp_user text not null default 'lallafm1984@gmail.com' check (char_length(smtp_user) between 1 and 254),
  add column if not exists smtp_password text not null default '' check (char_length(smtp_password) <= 500),
  add column if not exists smtp_from text not null default '제천 수상레저 예약 알림 <lallafm1984@gmail.com>' check (char_length(smtp_from) between 1 and 320);

update public.admin_site_settings
set
  smtp_host = coalesce(nullif(smtp_host, ''), 'smtp.gmail.com'),
  smtp_port = coalesce(smtp_port, 465),
  smtp_secure = coalesce(smtp_secure, true),
  smtp_user = coalesce(nullif(smtp_user, ''), 'lallafm1984@gmail.com'),
  smtp_from = coalesce(nullif(smtp_from, ''), '제천 수상레저 예약 알림 <lallafm1984@gmail.com>')
where id = true;
