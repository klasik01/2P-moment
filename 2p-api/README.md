# 2P Moment — API

Sdílený backend pro frontendy 2P Moment. Frontendy zůstávají na Netlify,
tenhle stack běží na vlastní VM (`vm-twopmoment`) a drží data.

```
Netlify (statika)              vm-twopmoment
├─ pekarna.2pmoment.cz   ──►   api.2pmoment.cz
├─ hivehouse…                  ├─ caddy     :80 :443  TLS + reverse proxy
└─ …                           ├─ api       :5310     ven jen přes caddy
                               └─ postgres  :5430     jen na interní síti
```

## Endpointy

| Metoda | Cesta               | Popis                                  |
|--------|---------------------|----------------------------------------|
| `GET`  | `/health`           | Kontrola API + databáze                |
| `POST` | `/pekarna/inquiry`  | Poptávka z formuláře na pekárně        |

Nové aplikace přidávej jako vlastní namespace (`/hive-house/*`) —
soubor v `src/routes/`, registrace v `src/server.ts`, schéma v `db/init/`.

## První nasazení

```bash
# na VM
git clone <repo> && cd 2P\ Moment/2p-api
cp .env.example .env && nano .env      # doplň hesla a domény
docker compose up -d --build
docker compose logs -f api
```

Než pustíš compose, musí `API_DOMAIN` mít A záznam na IP té VM — Caddy si
při startu tahá certifikát z Let's Encrypt a bez DNS ho nedostane.

Ve firewallu VM otevři jen `80` a `443`. Postgres ani API nemají v compose
`ports:`, takže z internetu nejsou vidět vůbec.

Ověření:

```bash
curl https://api.2pmoment.cz/health     # {"ok":true}
```

## Databáze

Skripty v `db/init/` se pouštějí **pouze při prvním startu**, kdy je volume
`pg-data` prázdný. Pozdější změny schématu dělej migrací, ne úpravou těch
souborů.

Přístup do databáze (zvenku nejde, jen přes kontejner):

```bash
docker compose exec postgres psql -U twopmoment -d twopmoment -p 5430
```

Každá aplikace má vlastní schéma (`pekarna.*`), aby se tabulky nemíchaly.

## Zálohy

Tohle je nejdůležitější kus provozu — když umře VM, zachrání tě jen záloha
jinde. Denní dump do GCS bucketu, cron na hostu:

```bash
0 3 * * * cd /opt/2p-api && docker compose exec -T postgres \
  pg_dump -U twopmoment -p 5430 twopmoment | gzip | \
  gcloud storage cp - gs://<bucket>/pg/twopmoment-$(date +\%F).sql.gz
```

Obnovu si jednou vyzkoušej nanečisto. Záloha, kterou jsi nikdy neobnovil,
není záloha.

## Vývoj lokálně

```bash
npm install
docker compose up -d postgres
DATABASE_URL=postgres://twopmoment:heslo@localhost:5430/twopmoment \
CORS_ORIGINS=http://localhost:5173 npm run dev
```

Pro lokální běh musíš Postgresu dočasně přidat `ports: - "5430:5430"` —
v produkci to tam nechybí schválně.

## Co ještě chybí

- **Notifikace mailem.** GCP blokuje odchozí port 25, takže vlastní SMTP
  nepůjde — je potřeba relay (Resend, Postmark, Mailgun). Místo pro
  napojení je označené `TODO` v `src/routes/pekarna.ts`.
- **Autentizace.** Až přes tohle API půjde `2p-administration`, bude
  potřeba přihlašování pro `/admin/*`. Dnes žádný endpoint nečte data ven,
  takže to zatím není blokující.
