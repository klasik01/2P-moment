# Hive House — Instruction File

> Referenční dokument pro AI asistenta. Popisuje architekturu, konvence a patterny projektu. Při implementaci nových features se řiď tímto souborem.

---

## 1. Stack & tooling

| Co | Čím |
|---|---|
| Framework | React 19 + TypeScript 5.8 (strict) |
| Build | Vite 6 |
| Styling | SCSS modules (BEM-inspired), žádný CSS-in-JS |
| Backend | Firebase Firestore (za service facade) |
| Routing | Hash-based (`#/`, `#/fishing`, `#/rezervace`, `#/kontakt`) |
| i18n | Statický objekt `cs` v `src/i18n/cs.ts`, typ `T = typeof cs` |
| State management | Žádná knihovna — pouze React hooks + component state |
| Deployment | Netlify (primary), GitHub Pages (fallback přes `VITE_BASE`) |

---

## 2. Adresářová struktura

```
src/
├── components/
│   ├── layout/          Navbar, Footer, HeroSection, PageHero, VideoLightbox
│   ├── sections/        Plug-and-play homepage sekce (About, Offerings, …)
│   ├── modals/          Dialogy (Fishing, Voucher, Construction, OfferingArticle)
│   ├── overlays/        Cookie banner, PromoPopup
│   └── ui/              Icon, Loader, SEOHead, ProfileSelector
├── pages/               Routované stránky (HomePage, FishingPage, ContactPage, ReservationPage)
├── config/              Konstanty a konfigurace (contact, fishing, footer, profiles)
├── data/                JSON data + TS wrappery (homepage, fishing, hive-house)
├── services/            Backend facade + Firebase implementace
├── hooks/               Custom React hooks
├── utils/               Utility funkce (analytics, asset, cookieConsent, seo)
├── styles/
│   ├── partials/        Design tokens, breakpoints, typography, mixins
│   └── components/      Per-component SCSS (1 soubor = 1 komponenta)
├── i18n/                Překlady (cs.ts)
├── types/               Centrální typy (index.ts)
├── lib/                 Firebase init (firebase.ts)
└── App.tsx              Root — routing, modal orchestrace, boot sequence
```

---

## 3. Datový tok

```
homepage.json / fishing.json / hive-house.json
        ↓
  data/*.ts  (typovaný wrapper, shortcut exporty)
        ↓
  types/index.ts  (centrální typy)
        ↓
  komponenta (přijímá data přes props s default fallback)
```

Všechny obsahové texty žijí v JSON souborech. Komponenty NIKDY neobsahují hardcoded český text — systémové/UI texty jsou v `i18n/cs.ts`, obsahové v JSON datech.

---

## 4. Klíčové patterny

### 4.1 Section komponenta (plug-and-play)

```tsx
import type { AboutData } from "../../types";
import { aboutData as defaultData } from "../../data/homepage";

type Props = {
  data?: AboutData;
  id?: string;
};

export function AboutSection({ data = defaultData, id = "o-nas" }: Props) {
  const titleId = `${id}-title`;
  return (
    <section className="about-section section-pad" id={id} aria-labelledby={titleId}>
      {/* … */}
    </section>
  );
}
```

**Pravidla:**
- Vždy přijímá `data?` prop s defaultní hodnotou z `data/homepage.ts`
- Vždy přijímá `id?` prop pro anchor linking
- Typ dat je definovaný v `types/index.ts`
- Exportuje se přes barrel `components/sections/index.ts`

### 4.2 Viditelnost sekcí a karet

```tsx
// HomePage — sekce
{data.about.visible !== false && <AboutSection data={data.about} />}

// OfferingsSection — karty
const visibleCards = data.cards.filter((c) => c.visible !== false);
```

Pole `visible?: boolean` je na každém section typu i na kartách. Default je `true` (nezadáno = viditelné).

### 4.3 Modal

```tsx
import { useModalOpen } from "../../hooks/useModalOpen";

export function MyModal({ t, onClose }: { t: T; onClose: () => void }) {
  useModalOpen(true, onClose);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true"
         aria-labelledby="my-modal-title" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.common.close}>
          ✕
        </button>
        {/* obsah */}
      </div>
    </div>
  );
}
```

**Pravidla:**
- Vždy `useModalOpen(true, onClose)` — řeší Escape key + body scroll lock
- Backdrop zavírá klikem (`onClick={onClose}`)
- Inner modal zastavuje propagaci (`e.stopPropagation()`)
- Close button má `aria-label={t.common.close}`
- Modální stav (`showX` / `setShowX`) žije v `App.tsx`
- Export přes barrel `components/modals/index.ts`

### 4.4 Profily (feature flags)

```tsx
import { isActive } from "../../config/profiles";

// V komponentě:
const underConstruction = isActive("VE_VYSTAVBE");
const noPromo = isActive("BEZ_REKLAMY");

if (noPromo) return null; // skryje celou sekci
```

**Flow:**
1. App.tsx → `backend.fetchAppSettings()` → `setActiveProfiles()`
2. Komponenty → `isActive("VE_VYSTAVBE")` (runtime check)
3. ProfileSelector v patičce → `backend.saveAppSettings()` → reload

Profily se čtou z Firestore (`settings/app`). Fallback je v `profiles.ts`.

### 4.5 Service facade

```tsx
// Komponenta volá POUZE fasádu:
import { backend } from "../../services";

await backend.createSubscription({ email, source: "construction_popup" });
const settings = await backend.fetchAppSettings();
```

**Nikdy neimportuj přímo z `firebase/firestore` nebo `lib/firebase` v komponentách.**

Struktura:
```
services/
├── contracts.ts        ← interface BackendService (co se dělá)
├── firebaseBackend.ts  ← Firebase implementace (jak se to dělá)
├── backend.ts          ← fasáda — singleton proxy
└── index.ts            ← barrel export
```

Pro novou backend operaci:
1. Přidej metodu do `BackendService` interface v `contracts.ts`
2. Implementuj v `firebaseBackend.ts`
3. Přidej proxy v `backend.ts`

### 4.6 Hash routing

```tsx
const route = useHashRoute(); // vrací "/", "/fishing", "/rezervace", "/kontakt"
```

- Routes: `#/` (homepage), `#/fishing`, `#/rezervace`, `#/kontakt`
- Anchor support: `#/#vcelin` → homepage + scroll to `#vcelin`
- Navbar links: `{ key: "fishing", href: "#/fishing", match: "/fishing" }`
- Routování v App.tsx je if/else chain, ne React Router

### 4.7 i18n konvence

```tsx
// UI/systémové texty → i18n/cs.ts
t.common.close       // "Zavřít"
t.common.sending     // "Odesílám…"
t.nav.fishing        // "Rybaření"

// Obsahové texty → JSON data
data.about.title     // "O Hive House"
cfg.popupTitle       // "Hive House je ve výstavbě"
```

**Pravidla:**
- Komponenty NIKDY neobsahují hardcoded české řetězce
- UI labely (buttony, aria-labels, error messages) → `cs.ts`
- Obsahové texty (nadpisy, odstavce, CTA) → JSON data
- Config texty (SEO, footer links) → `config/*.ts` nebo JSON

---

## 5. Styling konvence

### Naming (BEM-inspired)
```scss
.component-name { }              // blok
.component-name-element { }      // element
.component-name--modifier { }    // modifikátor
```

### Utility classes
- `.section-pad` — padding pro sekce
- `.container` — max-width wrapper
- `.reveal`, `.reveal-left`, `.reveal-right` — scroll animace (`.visible` přidáno JS)
- `.is-active` — aktivní stav
- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-outline-honey` — buttony

### Soubory
- 1 komponenta = 1 SCSS soubor v `styles/components/`
- Název: `_component-name.scss`
- Import v `styles/main.scss`
- Design tokens: `styles/partials/_colors.scss`, `_typography.scss`, `_breakpoints.scss`
- Breakpoint mixins: `@include sm { }`, `@include md { }`, `@include lg { }`

---

## 6. Boot sequence

```
main.tsx
  → App.tsx mount
    → useEffect: backend.fetchAppSettings() → setActiveProfiles() → markLoaded("settings")
    → useEffect: backend.subscribePromotions() → markLoaded("promotions")
    → useBootReady(loadedKeys, ["promotions", "settings"], 4000)
    → isReady === false → <Loader />
    → isReady === true  → render app
```

Aplikace se NEZOBRAZÍ dokud nepřijdou data z Firestore (nebo timeout 4s).

---

## 7. Globální konfigurace

`src/data/hive-house.json` — jediný zdroj pravdy pro:
- Název webu, tagline
- Termín otevření (`expectedOpenDate`)
- Kontaktní údaje (email, telefon, adresa)
- Check-in/out časy
- Sociální sítě
- Construction popup texty
- Firestore kolekce názvy

`config/*.ts` soubory importují z `hive-house.json` a doplňují strukturu.

---

## 8. Přidání nové feature — checklist

### Nová sekce na homepage:
1. Typ v `types/index.ts` (s `visible?: boolean`)
2. Data v `homepage.json` (s `"visible": true`)
3. Shortcut export v `data/homepage.ts`
4. Přidat do `HomepageData` typu
5. Komponenta v `components/sections/` (default data fallback)
6. Barrel export v `components/sections/index.ts`
7. SCSS v `styles/components/_nazev.scss` + import v `main.scss`
8. Render v `HomePage.tsx` s `data.X.visible !== false`

### Nový modal:
1. Komponenta v `components/modals/` (pattern viz 4.3)
2. Barrel export v `components/modals/index.ts`
3. State (`showX`, `setShowX`) v `App.tsx`
4. Texty do `i18n/cs.ts`
5. Pokud má styly → nový SCSS nebo přidat do `_modal.scss`

### Nová stránka/route:
1. Stránka v `pages/`
2. Route v `App.tsx` if/else chain
3. Odkaz v Navbar (`navLinks` pole + union typ pro `match`)
4. Odkaz v footer (`config/footer.ts`)
5. SEO meta (v komponentě nebo JSON)
6. Sitemap (`public/sitemap.xml`)
7. Volitelně: vlastní JSON data soubor + config

### Nová backend operace:
1. Metoda v `services/contracts.ts` (BackendService interface)
2. Implementace v `services/firebaseBackend.ts`
3. Proxy v `services/backend.ts`
4. Firestore rules ve Firebase Console

---

## 9. Pojmenování v kódu

- **Komponenty**: PascalCase (`FishingPage`, `OfferingsSection`)
- **Soubory**: PascalCase pro komponenty, camelCase pro utility/hooks
- **CSS classes**: kebab-case (`fishing-about-card`)
- **Proměnné/funkce**: camelCase (`isActive`, `onVoucherClick`)
- **Typy**: PascalCase (`HomepageData`, `OfferingCard`)
- **JSON klíče**: camelCase (`sectionTitle`, `ctaLabel`)
- **Konstanty**: UPPER_SNAKE_CASE (`REQUIRED_KEYS`, `PROMOTIONS_COLLECTION`)
- **Routy**: kebab-case anglicky (`/fishing`, `/rezervace`, `/kontakt`)
- **Kód**: anglicky (žádné české názvy proměnných, tříd, metod)
- **UI texty**: česky (přes i18n nebo JSON data)

---

## 10. Důležitá pravidla

1. **TypeScript strict** — `tsc --noEmit` musí projít bez chyb
2. **Žádné přímé Firebase importy v komponentách** — vše přes `backend.*`
3. **Žádné hardcoded české texty v .tsx** — vše v `cs.ts` nebo JSON
4. **Každá sekce má `visible?: boolean`** — kontrolováno v rodičovské komponentě
5. **Modální stav žije v App.tsx** — komponenta jen renderuje a volá `onClose`
6. **Data defaulty v komponentě** — `{ data = defaultData }` pattern
7. **1 SCSS soubor na komponentu** — importovaný v `main.scss`
8. **Barrel exporty** — každý adresář v `components/` má `index.ts`
9. **Profily z Firestore** — app čeká na načtení před renderem
10. **SEO** — každá stránka má `<SEOHead meta={...} />`, sitemap odpovídá routám
