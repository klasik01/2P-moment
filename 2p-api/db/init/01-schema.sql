-- ============================================================
-- 2P Moment — schéma databáze
--
-- POZOR: tenhle skript se pouští POUZE při prvním startu Postgresu
-- (když je volume pg-data prázdný). Pozdější změny řeš migrací.
-- ============================================================

-- Každá aplikace má vlastní schéma → tabulky se nemíchají dohromady.
create schema if not exists pekarna;

-- ---- Poptávky z kontaktního formuláře na pekarna.2pmoment.cz ----
-- Termíny ubytování se tudy neposílají — ty řeší rezervační systém
-- Previo. Tenhle formulář je na dotazy a poptávky komerčních prostor.
create table if not exists pekarna.inquiry (
  id           bigserial   primary key,
  created_at   timestamptz not null default now(),

  name         text        not null,
  email        text        not null,
  phone        text,
  message      text,

  -- Typ dotazu podle zadání klienta.
  inquiry_type text        not null default 'ostatni'
                 check (inquiry_type in
                   ('ubytovani', 'sklad', 'vyroba', 'kancelar', 'ostatni')),

  -- Provozní metadata pro dohledání spamu.
  source_ip    inet,
  user_agent   text,

  -- Workflow pro pozdější administraci.
  status       text        not null default 'new'
                 check (status in ('new', 'contacted', 'closed'))
);

create index if not exists inquiry_created_at_idx
  on pekarna.inquiry (created_at desc);

create index if not exists inquiry_status_idx
  on pekarna.inquiry (status)
  where status = 'new';

create index if not exists inquiry_type_idx
  on pekarna.inquiry (inquiry_type);
