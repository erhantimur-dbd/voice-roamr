-- 0003 created support_tickets without `category` and with body NOT NULL.
alter table support_tickets add column if not exists category text not null default 'general';
alter table support_tickets alter column body drop not null;
alter table support_tickets alter column body set default '';
