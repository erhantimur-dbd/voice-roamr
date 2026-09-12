-- Remove leftover travel-eSIM placeholder tables (schema from deleted 0004_esim).
drop table if exists esim_topups;
drop table if exists esim_invoices;
drop table if exists esim_inventory;
drop table if exists esims;
drop table if exists esim_orders;
drop table if exists partner_applications;
drop table if exists support_messages;
drop table if exists profiles;
