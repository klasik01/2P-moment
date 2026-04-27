# 2P Stavební – frontend

React + TypeScript + Vite. Public web firmy 2P Stavební s.r.o.

## Lokální vývoj

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` nastav podle `.env.example` – všechny klíče jsou `VITE_*` a injektují
se do klienta.

## Build

```bash
npm run build     # tsc --noEmit + vite build → dist/
npm run preview   # lokální preview dist/ verze
```

## Architektura

```
src/
  components/        14 React komponent (žádná zná Firebase)
  data/              Per-page & shared data (company, contacts, legal, …)
    pages/home/*     Obsah jednotlivých sekcí
    seo/             Per-page SEO, FAQ, JSON-LD
  services/content/  Fasáda pro BE – provider pattern
    providers/firebase/   Jediná Firebase implementace
  lib/firebase.ts    Firebase SDK init (používá jen provider)
  i18n/              Minimalistický t(key) – cs výchozí
  styles/            Tokens / base / blocks / responsive
  config/routes.ts   Hash routy
```

Firebase tahá pouze live data (projekty, promoce, tým). Zbytek je statický.
Viz `src/services/content/providers/firebase/index.ts` pro přesný kontrakt.

## Deploy

Projekt je připravený pro **dva nezávislé deploy targety**:

### 🌐 Netlify (produkční – `2pstavebni.cz`)

Netlify staví automaticky z `main` větve:

- `netlify.toml` definuje build, SPA redirect, cache headers, security headers
- `DEPLOY_TARGET=netlify` → `vite.config.ts` použije root base path `/`
- V Netlify UI nastav **Environment variables** stejně jako v `.env.example`
  (plus `VITE_GA_MEASUREMENT_ID`)

### 🐙 GitHub Pages (preview)

Workflow `.github/workflows/deploy-pages.yml` deployuje na každý push do `main`:

- `DEPLOY_TARGET=github-pages` → vite base `/2p-stavebni-web/`
- `public/404.html` slouží jako SPA fallback (pro deep linky bez hash)
- V **Repo → Settings → Pages** vyber zdroj „GitHub Actions"
- V **Repo → Settings → Secrets and variables → Actions** přidej všechny
  `VITE_*` proměnné jako repo secrets (stejný seznam jako v `.env.example`)

### ✅ CI (PR checks)

`.github/workflows/ci.yml` běží na každý PR i non-main push:

- typecheck (`tsc --noEmit`)
- produkční build (`npm run build`)

## Správa obsahu (Firebase)

Administrační UI je v samostatném projektu. Web zde je read-only vůči
Realtime Database. Čtou se dvě cesty:

| Cesta | Co obsahuje | Kam jde |
|---|---|---|
| `p-stavebni/content` | `{ projects[], promotions[], team[] }` | Reference, PromoPopup, Kontakt-tým |
| `p-stavebni/project-display` | `{ order[], visibility{} }` | Pořadí + skrývání projektů |

Viz `src/services/content/merging.ts` pro detail merge logiky.

## SEO & i18n

- SEO: `src/data/seo/` + `SEOHead` komponenta (title/description/OG/Twitter/JSON-LD), `public/robots.txt`, `public/sitemap.xml`
- i18n: `src/i18n/locales/cs.ts` (~30 klíčů). Přidání EN = nový `en.ts` a
  registrace v `src/i18n/index.ts`.
