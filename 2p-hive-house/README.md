# 2P Hive House — úvodní web

Statický web pro 2P Hive House. TS + React + Vite, Firebase (Firestore + Storage)
pro dynamický obsah (sezonní akce), Google Analytics s cookie souhlasem,
mobile-first responzivní design.

## Struktura

```
src/
├── api/           # Firestore subscribe helpery (sezonní akce)
├── components/    # UI komponenty (Navbar, Hero, Offerings, Video, Footer, ...)
├── config/        # Konfigurační soubory (footer.ts)
├── data/          # Statický obsah (homepage.json)
├── hooks/         # React hooky (reveal scroll, analytics, boot ready, ...)
├── i18n/          # Překlady / texty tlačítek (cs.ts)
├── lib/           # Firebase init
├── pages/         # Stránky (HomePage)
├── styles/
│   ├── main.scss           # vstupní bod
│   ├── partials/           # tokeny
│   │   ├── _colors.scss
│   │   ├── _typography.scss
│   │   ├── _breakpoints.scss
│   │   └── _layout.scss
│   └── components/         # komponentové styly
│       ├── _navbar.scss
│       ├── _hero.scss
│       ├── _offerings.scss
│       ├── _video-section.scss
│       ├── _footer.scss
│       ├── _modal.scss
│       ├── _loader.scss
│       ├── _cookie.scss
│       └── _promo.scss
├── types/         # TypeScript typy
├── utils/         # cookieConsent, analytics, seo
├── App.tsx
└── main.tsx
```

## Spuštění lokálně

```bash
npm install
cp .env.example .env      # a vyplň Firebase klíče
npm run dev
```

## SEO

SEO meta se definuje v `src/data/homepage.json` v sekci `seo` a aplikuje se
přes komponentu `<SEOHead />`. Nadpisy `<h1>` – `<h6>` jsou použity sémanticky:
`h1` pouze v Hero, `h2` u každé sekce, `h3` u karet.

## Nasazení

* **GitHub Pages** — `.github/workflows/deploy-github-pages.yml`
* **Netlify** — `.github/workflows/deploy-netlify.yml` + `netlify.toml`

Oba pipelines čtou Firebase / GA klíče z GitHub Secrets.

## Úprava patičky / kontaktů

Všechny údaje v patičce (e-mail, telefon, adresa, sloupce s odkazy,
soc. sítě) jsou v `src/config/footer.ts`. Tam se edituje.

## Sezonní akce

Načítají se z Firestore kolekce `2p-hive-house-promotions`. Viz
`src/api/promotions.ts`. Struktura: `{ enabled, badge, title, text, ctaLabel, ctaHref, startsAt?, endsAt? }`.

## Rybářská povolenka

Komponenta `FishingModal` je zatím prázdný placeholder — formulář
se doplní později.
