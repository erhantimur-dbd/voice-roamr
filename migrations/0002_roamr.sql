-- Roamr multi-tenant voice agent platform
create table if not exists workspaces (
  id text primary key,
  user_id text not null,
  name text not null,
  slug text not null,
  plan text not null default 'trial',
  billing_interval text not null default 'monthly',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  subscription_status text not null default 'trialing',
  trial_ends_at timestamptz,
  minutes_included integer not null default 50,
  minutes_used numeric not null default 0,
  extra_numbers integer not null default 0,
  locale text not null default 'en',
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists workspaces_user_id_idx on workspaces (user_id);
create index if not exists workspaces_stripe_customer_idx on workspaces (stripe_customer_id);

create table if not exists agents (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  name text not null,
  role text not null default 'assistant',
  status text not null default 'draft',
  voice_id text not null default 'eve',
  custom_voice_id text,
  language text not null default 'auto',
  model text not null default 'grok-voice-think-fast-2.0',
  greeting text,
  instructions text not null default '',
  personality text,
  guardrails jsonb not null default '{}'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  knowledge_enabled boolean not null default true,
  phone_number_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists agents_workspace_idx on agents (workspace_id);
create index if not exists agents_user_idx on agents (user_id);

create table if not exists knowledge_docs (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  agent_id text,
  title text not null,
  content text not null,
  source_url text,
  created_at timestamptz not null default now()
);
create index if not exists knowledge_docs_workspace_idx on knowledge_docs (workspace_id);
create index if not exists knowledge_docs_agent_idx on knowledge_docs (agent_id);

create table if not exists knowledge_chunks (
  id text primary key,
  doc_id text not null,
  workspace_id text not null,
  user_id text not null,
  chunk_index integer not null,
  content text not null
);
create index if not exists knowledge_chunks_doc_idx on knowledge_chunks (doc_id);
create index if not exists knowledge_chunks_workspace_idx on knowledge_chunks (workspace_id);

create table if not exists custom_voices (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  name text not null,
  description text,
  gender text,
  accent text,
  tone text,
  language text not null default 'en',
  xai_voice_id text,
  status text not null default 'ready',
  created_at timestamptz not null default now()
);
create index if not exists custom_voices_workspace_idx on custom_voices (workspace_id);

create table if not exists phone_numbers (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  e164 text not null,
  country text not null,
  region text,
  locality text,
  number_type text not null default 'local',
  twilio_sid text,
  status text not null default 'active',
  monthly_cost_cents integer not null default 600,
  agent_id text,
  created_at timestamptz not null default now()
);
create index if not exists phone_numbers_workspace_idx on phone_numbers (workspace_id);
create unique index if not exists phone_numbers_e164_idx on phone_numbers (e164);

create table if not exists integrations (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  provider text not null,
  status text not null default 'disconnected',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists integrations_workspace_provider_idx on integrations (workspace_id, provider);

create table if not exists calls (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  agent_id text not null,
  direction text not null default 'inbound',
  channel text not null default 'web',
  from_number text,
  to_number text,
  status text not null default 'completed',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0,
  minutes_billed numeric not null default 0,
  transcript text,
  summary text,
  language text,
  recording_url text
);
create index if not exists calls_workspace_idx on calls (workspace_id);
create index if not exists calls_agent_idx on calls (agent_id);
create index if not exists calls_started_idx on calls (started_at desc);

create table if not exists call_messages (
  id text primary key,
  call_id text not null,
  workspace_id text not null,
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists call_messages_call_idx on call_messages (call_id);

create table if not exists usage_events (
  id text primary key,
  workspace_id text not null,
  user_id text not null,
  kind text not null,
  units numeric not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists usage_events_workspace_idx on usage_events (workspace_id);

create table if not exists email_log (
  id text primary key,
  workspace_id text,
  user_id text,
  to_address text not null,
  template text not null,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);
