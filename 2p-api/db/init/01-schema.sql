-- ============================================================
-- 2P Moment — schéma databáze
--
-- POZOR: tenhle skript se pouští POUZE při prvním startu Postgresu
-- (když je volume pg-data prázdný). Pozdější změny řeš migrací.
-- ============================================================

-- Každá aplikace má vlastní schéma → tabulky se nemíchají dohromady.
create schema if not exists pekarna;

-- ---- Poptávky z formuláře na pekarna.2pmoment.cz ----
create table if not exists pekarna.inquiry (
  id          bigserial   primary key,
  created_at  timestamptz not null default now(),

  name        text        not null,
  email       text        not null,
  phone       text,
  people      smallint,
  date_from   date,
  date_to     date,
  rental_type text        not null default 'short'
                check (rental_type in ('short', 'long')),
  message     text,

  -- Provozní metadata pro dohledání spamu.
  source_ip   inet,
  user_agent  text,

  -- Workflow pro pozdější administraci.
  status      text        not null default 'new'
                check (status in ('new', 'contacted', 'closed'))
);

create index if not exists inquiry_created_at_idx
  on pekarna.inquiry (created_at desc);

create index if not exists inquiry_status_idx
  on pekarna.inquiry (status)
  where status = 'new';
