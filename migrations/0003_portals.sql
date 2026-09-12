-- Client + operator portals: invoices, payments, tickets, admin seats
alter table workspaces add column if not exists billing_email text;
alter table workspaces add column if not exists notes text;
alter table workspaces add column if not exists suspended boolean not null default false;
alter table workspaces add column if not exists is_sample boolean not null default false;

create table if not exists platform_admins (
  user_id text primary key,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  stripe_invoice_id text,
  number text not null,
  status text not null default 'paid',
  kind text not null default 'subscription',
  description text not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  period_start timestamptz,
  period_end timestamptz,
  hosted_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists invoices_workspace_idx on invoices (workspace_id);
create index if not exists invoices_created_idx on invoices (created_at desc);

create table if not exists payment_events (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  invoice_id text,
  kind text not null,
  amount_cents integer not null default 0,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists payment_events_workspace_idx on payment_events (workspace_id);
create index if not exists payment_events_created_idx on payment_events (created_at desc);

create table if not exists support_tickets (
  id text primary key,
  workspace_id text,
  user_id text not null,
  subject text not null,
  body text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists support_tickets_workspace_idx on support_tickets (workspace_id);
create index if not exists support_tickets_status_idx on support_tickets (status);
