alter table agents add column if not exists voice_type text not null default 'warm';
alter table workspaces add column if not exists seats integer not null default 1;
alter table workspaces add column if not exists overage_cents integer not null default 22;
alter table custom_voices add column if not exists sample_note text;
