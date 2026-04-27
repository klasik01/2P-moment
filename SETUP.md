# 2P Hive House — Nastavení projektu

## Struktura

```
2P Hive house/
├── hive-house/      ← Hlavní webová stránka (React + TypeScript + SCSS)
├── 2p-moment/       ← Administrační aplikace (React + TypeScript + SCSS)
└── SETUP.md         ← Tento soubor
```

---

## 1. Firebase nastavení

Oba projekty sdílejí **jeden Firebase projekt** (nebo si vytvořte zvlášť).

1. Jděte na [Firebase Console](https://console.firebase.google.com/)
2. Vytvořte projekt
3. Povolte: **Authentication** (Email/Password), **Firestore Database**, **Storage**
4. Zkopírujte config z Firebase Console → Nastavení projektu → Vaše aplikace

### Firestore kolekce (vytvoří se automaticky):

| Kolekce | Popis | Přístup |
|---------|-------|---------|
| `hive-house-promotions` | Sezonní akce (popupy) | veřejné čtení, admin zápis |
| `hive-house-room` | Obsah stránky ubytování | veřejné čtení, admin zápis |
| `hive-house-fishing` | Obsah stránky rybaření | veřejné čtení, admin zápis |
| `hive-house-surroundings-page` | Hero/konfigurace stránky Okolí | veřejné čtení, admin zápis |
| `hive-house-surroundings` | Jednotlivá místa v okolí | veřejné čtení, admin zápis |
| `hive-house-apiary` | Obsah stránky Včelín & Glamping | veřejné čtení, admin zápis |
| `hive-house-reviews` | Recenze hostů | veřejné čtení, admin zápis |
| `hive-house-contact` | Kontaktní informace | veřejné čtení, admin zápis |
| `hive-house-permits` | Rybářské povolenky | veřejné vytvoření, admin správa |
| `hive-house-vouchers` | Dárkové poukázky | veřejné vytvoření, admin správa |

### Firestore a Storage pravidla:

Pravidla jsou v souborech `firestore.rules` a `storage.rules` v kořenu projektu.

**Nasazení přes Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,storage
```

**Nebo ručně v Firebase Console:**
- Firestore → Pravidla → vložte obsah `firestore.rules`
- Storage → Pravidla → vložte obsah `storage.rules`

---

## 2. Hlavní web (hive-house)

```bash
cd hive-house

# Zkopírujte .env.example jako .env.local a vyplňte Firebase config:
cp .env.example .env.local

# Instalace závislostí:
npm install

# Vývojový server:
npm run dev

# Build pro produkci:
npm run build
```

### .env.local pro hive-house:
```
VITE_FIREBASE_API_KEY=vaše_api_key
VITE_FIREBASE_AUTH_DOMAIN=váš_projekt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=váš_projekt
VITE_FIREBASE_STORAGE_BUCKET=váš_projekt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=12345678
VITE_FIREBASE_APP_ID=1:12345678:web:abc123
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX    # nepovinné, Google Analytics
```

### Vložení rezervačního systému:
Otevřete `src/components/BookingSection.tsx` a nahraďte placeholder svým kódem od Checkfront / Lodgify / Smoobu.

---

## 3. Administrace (2p-moment)

```bash
cd 2p-moment

# Zkopírujte .env.example jako .env.local a vyplňte Firebase config:
cp .env.example .env.local

# Instalace závislostí:
npm install

# Vývojový server:
npm run dev

# Build pro produkci:
npm run build
```

### První přihlášení:
1. V Firebase Console → Authentication → Users
2. Přidejte uživatele: email + heslo
3. Spusťte 2P-Moment a přihlaste se tímto emailem

---

## 4. Sekce adminu (2P Moment → Hive House)

**Stránky & obsah**

| Sekce | Popis |
|-------|-------|
| **Pokoj** | Hero fotka, texty, štítky, galerie, obsahové bloky (text / obrázek vlevo) |
| **Rybaření** | Hero, kroky objednávky, info karty, CTA tlačítko |
| **Okolí — hero** | Hero sekce a popisky stránky výletů |
| **Místa v okolí** | CRUD + řazení míst zobrazovaných na stránce Okolí |
| **Včelín & Glamping** | Hero, glamping karty (max 3 zobrazené), bydlení se včelami, API terapie |

**Akce & prodej**

| Sekce | Popis |
|-------|-------|
| **Sezonní akce** | CRUD editace vyskakovacích oken (promo popup) |
| **Poukázky** | Správa dárkových poukázek, změna statusu |
| **Rybářské povolenky** | Správa povolenek, slevy (hasiči, děti) |

**Informace**

| Sekce | Popis |
|-------|-------|
| **Recenze** | Správa recenzí hostů (autor, hodnocení, text, zdroj) |
| **Kontakt** | Kontaktní osoba, firma, adresa, check-in/out, kapacita |
| **Statistiky** | Tržby po měsících, celkové statistiky |

---

## 5. Přizpůsobení obsahu

Veškeré texty jsou v souboru: `hive-house/src/i18n/cs.ts`

Tam změníte:
- Texty sekcí
- Ceny (VoucherModal.tsx: `PRICE_PER_NIGHT = 3500`)
- Ceny povolenek (i18n/cs.ts → fishing.price_*)
- Obrázky (zatím Unsplash — nahradit vlastními)
- Kontaktní info

---

## 6. Nasazení

Doporučujeme **Vercel** nebo **Netlify**:
- Rootový adresář: `hive-house` (pro web) nebo `2p-moment` (pro admin)
- Build command: `npm run build`
- Output: `dist/`
