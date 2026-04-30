# DISCOVERY — 2P Pekárna

> One-page web pro pronájem ubytování v Pacově (Vysočina), provozováno
> 2P Moment s.r.o. Diskuse a otázky vedeny formou grill-me 2026-04-30.

## Problem statement

Majitel zrekonstruovaného domu (bývalá pekárna) v Pacově pronajímá tři
apartmány (2+1, každý se 4 lůžky, KK a vlastní sociálkou) a nebytové
prostory. Chybí mu jednoduchá veřejná stránka, která řekne „takto se
ubytujete", ukáže fotky, polohu a dovolí lidem rovnou poslat poptávku.
Stránka má být postavená podle stejného principu jako sesterský projekt
Hive House — single-page mobile-first SPA, čisté linie, moderní vzhled,
jen ve světlejší (teplé krémové) paletě.

## Primary user

Český návštěvník Pacova a okolí — buď krátkodobý (víkendoví turisté,
rodiny s dětmi mířící na hrad Kámen / Lipno / Telč) nebo dlouhodobý
nájemce (např. lidé pracující v okolí), který hledá důvěryhodný
soukromý pronájem mimo Booking/Airbnb.

## Success metric

**Cíl:** ≥ 8 vyplněných poptávkových formulářů týdně do 90 dní od spuštění
(launch 2026-07-01). Sekundárně: ≥ 60 % traffic z mobilu (potvrzení
hypotézy 80 %).

## Top 3 risks

1. **Nedotažený obsah apartmánů.** Zatím chybí ceník, přesné dispozice
   a popis nebytových prostor. Pokud jdeme live bez toho, formulář
   sbírá lidi, kteří nevědí, co kupují → vysoká dropout v emailu.
2. **„Pacov" bez přesné adresy.** Bez ulice/čísla popisku má host
   ztížené plánování, slabší SEO (lokální balíčky) a nedůvěryhodný
   dojem. Nutno dodat před launchem.
3. **Logo ve výrobě.** Když se objeví pozdě, hrozí přebarvení celé
   palety / typografie. Mockup proto stavíme s textovým wordmarkem
   `2P Pekárna` v Oswaldu — logo se nahradí v jednom místě.

---

## 1. Problem & outcome

- **Problém v jedné větě:** Lidé v Pacově nemají přímý kanál, jak si
  rezervovat / poptat ubytování v Pekárně mimo platformy třetích stran.
- **Pro koho:** Krátkodobí turisté (víkendy, dovolená), dlouhodobí
  nájemci (měsíce+), rodiny s dětmi. Nebytové prostory pro firmy
  (sekundární).
- **Úspěch za 90 dní:** ≥ 8 poptávek/týden, ≥ 60 % mobile traffic.
- **Cena nedělání:** 2P Moment nadále platí provize/poplatky platforem
  a ztrácí přímý kontakt s hostem.

## 2. Users & jobs-to-be-done

- **Primární:** Krátkodobý turista — chce v 60 vteřinách na mobilu
  zjistit „kde to je, jak to vypadá uvnitř, kolik se nás vejde, jak se
  ozvu".
- **Sekundární:** Dlouhodobý nájemce — chce vidět, že jde o solidní,
  čistý dům, a předat kontakt pro schůzku.
- **Terciární:** Rodina s dětmi — chce vědět, že je tam dost místa
  (4 lůžka/apartmán) a co je v okolí.
- **Workaround dnes:** Booking, Airbnb, Facebook, doporučení.

## 3. Scope & non-goals

**V1 (in-scope):**
- One-page SPA, čeština, mobile-first.
- Hero (název, podnadpis, CTA „Mám zájem"), sekce o Pekárně, sekce
  apartmány (3× 2+1, 4 lůžka, KK, sociálka), galerie z `/public/images`,
  okolí Pacova, poptávkový formulář, footer s 2P Moment s.r.o. a
  kontakty.
- Structured data (LodgingBusiness, Organization).

**Out-of-scope v1 (explicitně):**
1. Online rezervační kalendář / platba.
2. Multijazyčnost (EN, DE) — pouze CS v této vlně.
3. Ceník / dynamic pricing.
4. Recenze, blog, newsletter.
5. Detailní popis nebytových prostor (jen zmínka + odkaz na poptávku).

**Co bych řízl, kdyby se termín půlil:** sekci „okolí" zúžím na 4 odrážky,
strukturovaná data zúžím na LodgingBusiness, vyhodím zatím nebytové
prostory.

## 4. Constraints

- **Deadline:** launch 2026-07-01 (≈ 2 měsíce od dnes).
- **Budget:** interní (2P Moment).
- **Tým:** Stanislav (owner), Claude (design + impl. assist).
- **Stack:** React + Vite + TypeScript (existující kostra v `2p-pekarna`),
  hosting jako Hive House. Mockup nejdřív jako čisté HTML, pak rozsekat.
- **Brand:** Logo ve výrobě → zatím wordmark „2P Pekárna".
- **A11y baseline:** WCAG 2.1 AA — kontrast textu, alt na fotkách,
  labelované formulářové pole, klávesnicová navigace.

## 5. Content & data

- **Hotovo:** ~20 fotek `/public/images/RD, Pacov (n).jpg`. Nejsou
  vytříděné ani popsané (úkol pro v1.1).
- **Chybí:**
  - Přesná adresa (ulice, č.p., PSČ).
  - Popis apartmánů (krom „2+1, 4 lůžka, KK, sociálka").
  - Popis nebytových prostor.
  - About text.
  - Ceny (zatím nebudou veřejně).
- **Kontakty (převzato z Hive House):** `+420 774 110 224`,
  email `pekarna@2pmoment.cz` (předpokládám paralelu k
  `hivehouse@2pmoment.cz`; potvrdit).

## 6. Context of use

- **Devices:** ≈ 80 % mobile, 20 % desktop/tablet (předpoklad
  vlastníka).
- **Bandwidth:** běžné mobilní LTE, žádný offline use case.
- **Prostředí:** typicky doma / na cestě, host plánuje výlet.
- **A11y baseline:** WCAG 2.1 AA, žádný explicitní AAA požadavek.

## 7. Tone, brand, aesthetic

- **Adjektiva pro feel:** světlé, hřejivé (krémová/béžová s teplým hnědým
  akcentem), čisté linie.
- **Typografie:** Oswald (display, jako Hive House) + Inter (body).
- **Reference (správně):** Hive House — strukturou, sazbou, tónem.
- **Reference (špatně, na co se vyhnout):** booking/airbnb listing
  (přeplácané), generické Wix/Webnode šablony, „dovolenkové" weby s
  drop-shadowy a stock fotkami.

## 8. Competitors & references

- **Přímé:** Booking/Airbnb listings v Pacově, lokální penziony
  (Penzion u Antonína Sovy apod.).
- **Co dělají dobře:** rezervační flow, recenze, jasná galerie.
- **Co dělají špatně:** vizuální chaos, slabá identita, žádný osobní tón.
- **Náš přístup:** vlastní stránka = osobní, čistá, rychlá; rezervace
  zatím přes formulář (lidský follow-up).

## 9. Risks & unknowns

- **Největší riziko selhání:** spuštění bez doplněných obsahových polí
  (adresa, popis apartmánů) — formulář pak nepřinese kvalifikované
  poptávky.
- **Nejistota #1:** kolik z 20 fotek je opravdu publikovatelných (focené
  konzistentně, exteriér + 3 interiéry per apartmán). Doporučuji prvně
  vytřídit do 8–12 hero ks.
- **Co prototypovat první:** mobile hero + galerie + formulář (to je
  60 % konverzního funnelu).

---

## Otevřené otázky / TODO

- **[OPEN]** Přesná adresa (ulice, č.p., PSČ).
- **[OPEN]** Email — opravdu `pekarna@2pmoment.cz`? Nebo přesměrovat
  vše na `hivehouse@2pmoment.cz`?
- **[OPEN]** Kdo z apartmánů 1/2/3 má jaký výhled / patro / vybavení?
- **[OPEN]** Co s nebytovými prostory — popsat (m², k čemu se hodí)
  nebo jen zmínit „k pronájmu"?
- **[OPEN]** Sociální sítě — bude Instagram/FB pro Pekárnu, nebo
  sdílíme s Hive House?
- **[UNANSWERED — bude v.1.1]** Ceník / sezónnost.
- **[UNANSWERED — bude v.1.1]** Vícejazyčnost.
