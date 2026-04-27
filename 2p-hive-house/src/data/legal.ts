// ============================================================
// Právní dokumenty — obchodní podmínky, ochrana osobních údajů,
// cookies. Jediný zdroj pravdy pro obsah legal popupů v patičce.
//
// ⚠️ Upozornění: toto je vzorové znění ušité na míru malému glamping
// ubytování s apiterapií a soukromým rybníkem. Před spuštěním ostré
// verze doporučuji projít s právníkem (zejména storno, GDPR, evidence
// hostů dle z. č. 565/1990 Sb.).
//
// Každý dokument má stabilní `id` (používá ho LegalModal), `title`,
// `updatedAt` (datum poslední revize, ISO) a pole `sections`, kde
// každá sekce má volitelný nadpis a pole odstavců. Odstavec může být
// prostý text, nebo pole položek (vykreslí se jako <ul>).
// ============================================================

import { hiveHouseConfig } from "./hive-house";

export type LegalId = "terms" | "privacy" | "cookies";

export type LegalParagraph = string | { list: string[] } | { ordered: string[] };

export type LegalSection = {
  /** Volitelný nadpis sekce (H3 uvnitř modalu). */
  heading?: string;
  /** Odstavce / seznamy v této sekci. */
  paragraphs: LegalParagraph[];
};

export type LegalDocument = {
  id: LegalId;
  /** Zobrazovaný titulek popupu a H2 uvnitř. */
  title: string;
  /** Krátký podtitul zobrazovaný pod nadpisem. */
  subtitle?: string;
  /** ISO datum poslední revize (zobrazeno jako „Platné od …"). */
  updatedAt: string;
  sections: LegalSection[];
};

const cfg = hiveHouseConfig;
const OPERATOR = cfg.company.name; // „2P moment s.r.o."
const ICO = cfg.company.ico;
const ADDRESS = cfg.contact.address;
const EMAIL = cfg.contact.email;
const PHONE = cfg.contact.phone;

// ------------------------------------------------------------
// 1) OBCHODNÍ PODMÍNKY
// ------------------------------------------------------------

const terms: LegalDocument = {
  id: "terms",
  title: "Obchodní podmínky",
  subtitle: `Podmínky ubytování a služeb v Hive House, Hojanovice`,
  updatedAt: "2026-04-17",
  sections: [
    {
      heading: "1. Úvodní ustanovení",
      paragraphs: [
        `Tyto obchodní podmínky (dále jen „Podmínky") upravují vzájemná práva a povinnosti mezi provozovatelem ubytovacího zařízení Hive House, společností ${OPERATOR}, IČO ${ICO}, se sídlem ${ADDRESS} (dále jen „Provozovatel"), a hostem, který si prostřednictvím webu hivehouse.2pmoment.cz, e-mailem, telefonicky nebo osobně rezervoval ubytování (dále jen „Host").`,
        `Vztah mezi Provozovatelem a Hostem se řídí zákonem č. 89/2012 Sb., občanským zákoníkem, zákonem č. 634/1992 Sb., o ochraně spotřebitele, a souvisejícími předpisy České republiky.`,
      ],
    },
    {
      heading: "2. Předmět ubytování",
      paragraphs: [
        `Provozovatel poskytuje Hostovi krátkodobé ubytování v objektu Hive House (glamping se včelami, tzv. „apidomek") včetně souvisejících služeb — zejména možnosti apiterapie (pobyt nad včelími úly), rybaření v soukromém rybníku a využití workoutového hřiště.`,
        `Kapacita apidomku je standardně 2 osoby. Detaily vybavení, check-in/out časů a aktuální ceníky jsou zveřejněny na webu Provozovatele.`,
      ],
    },
    {
      heading: "3. Rezervace a uzavření smlouvy",
      paragraphs: [
        `Rezervaci Host provádí prostřednictvím online rezervačního systému, e-mailem nebo telefonicky. Rezervace je závazná okamžikem, kdy Provozovatel Hostovi potvrdí rezervaci a Host uhradí případnou rezervační zálohu (typicky 30–50 % z ceny pobytu).`,
        `Smlouva o ubytování je uzavřena okamžikem úhrady zálohy. Uhrazením zálohy Host potvrzuje, že si tyto Podmínky přečetl a souhlasí s nimi.`,
        `Doplatek je splatný nejpozději při příjezdu, pokud nebylo dohodnuto jinak.`,
      ],
    },
    {
      heading: "4. Cena a platební podmínky",
      paragraphs: [
        `Ceny pobytů jsou uvedeny v CZK a zahrnují ubytování v Hive House pro 2 osoby. Případné doplňkové služby (ochutnávka medu, rybářská povolenka, snídaně, apod.) jsou účtovány zvlášť podle aktuálního ceníku.`,
        `Platbu lze uhradit bankovním převodem, platební kartou online, nebo v hotovosti na místě. Daňový doklad Provozovatel vystaví do 15 dnů od přijetí platby.`,
        `Cena ubytování nezahrnuje místní poplatek z pobytu, který Host hradí samostatně dle platné obecně závazné vyhlášky obce Hojanovice.`,
      ],
    },
    {
      heading: "5. Storno podmínky",
      paragraphs: [
        `Host je oprávněn zrušit rezervaci. V takovém případě se účtují tyto storno poplatky z celkové ceny pobytu:`,
        {
          list: [
            `Zrušení více než 30 dní před příjezdem — bez storno poplatku, vrací se celá záloha.`,
            `Zrušení 15–30 dní před příjezdem — storno poplatek ve výši 30 % ceny pobytu.`,
            `Zrušení 7–14 dní před příjezdem — storno poplatek ve výši 50 % ceny pobytu.`,
            `Zrušení méně než 7 dní před příjezdem nebo nedostavení se (no-show) — storno poplatek ve výši 100 % ceny pobytu.`,
          ],
        },
        `V případě zrušení pobytu z důvodů vyšší moci (živelní pohroma, úřední nařízení, závažné zdravotní důvody doložené lékařským potvrzením) Provozovatel nabídne náhradní termín nebo vrácení zálohy po individuální dohodě.`,
        `Storno musí být provedeno písemně (e-mailem na ${EMAIL}). Rozhodující pro výpočet storno poplatku je datum doručení storno žádosti Provozovateli.`,
      ],
    },
    {
      heading: "6. Check-in a check-out",
      paragraphs: [
        `Check-in je možný od ${cfg.checkInOut.checkIn} hod. v den příjezdu. Check-out je do ${cfg.checkInOut.checkOut} hod. v den odjezdu.`,
        `Host je povinen při příjezdu prokázat svou totožnost platným dokladem (občanský průkaz, pas) — Provozovatel je povinen vést evidenci ubytovaných hostů dle zákona č. 565/1990 Sb., o místních poplatcích.`,
        `Pozdější check-out je možný po domluvě a za příplatek, pokud to provoz Hive House umožňuje.`,
      ],
    },
    {
      heading: "7. Práva a povinnosti Hosta",
      paragraphs: [
        `Host je povinen užívat ubytovací prostory a zařízení Hive House v souladu s jejich určením a dbát na jejich šetrné užívání.`,
        `V objektu Hive House je zakázáno:`,
        {
          list: [
            `Kouření uvnitř objektu (včetně elektronických cigaret) — dle zákona č. 65/2017 Sb., o ochraně zdraví před škodlivými účinky návykových látek.`,
            `Používání otevřeného ohně a svíček mimo místa k tomu určená.`,
            `Manipulace se včelími úly a vybavením pod objektem — včely jsou přístupné pouze z venkovní strany, k ošetření slouží výhradně Provozovatel.`,
            `Rušení nočního klidu mezi 22:00 a 7:00.`,
            `Ubytování většího počtu osob, než je potvrzeno v rezervaci.`,
          ],
        },
        `Domácí mazlíčci (pes, kočka) jsou povoleni pouze po předchozí dohodě a za příplatek. Majitel odpovídá za škody způsobené zvířetem a je povinen zajistit, aby zvíře nerušilo ostatní hosty ani neohrožovalo včely.`,
        `Host odpovídá v plné výši za škody, které způsobí na majetku Provozovatele úmyslně nebo z nedbalosti.`,
      ],
    },
    {
      heading: "8. Apiterapie a bezpečnost",
      paragraphs: [
        `Apiterapie (pobyt nad včelími úly) je bezpečná pro běžnou populaci — včely jsou izolovány v prostoru pod postelemi a nemají přístup do obytné části. Host nepřichází s živými včelami do přímého kontaktu.`,
        `Host je povinen Provozovatele informovat předem o vážné alergii na včelí bodnutí nebo na včelí produkty. V případě alergie Provozovatel doporučuje konzultaci s ošetřujícím lékařem před rezervací.`,
        `Rybaření v soukromém rybníku Hive House se řídí pravidly stanovenými Provozovatelem (zákaz používání toxických návnad, povinnost pustit chráněné druhy, atd.). Rybářská povolenka je prodávaná samostatně.`,
      ],
    },
    {
      heading: "9. Odpovědnost Provozovatele",
      paragraphs: [
        `Provozovatel odpovídá za škodu způsobenou porušením svých povinností vyplývajících ze smlouvy o ubytování, v rozsahu stanoveném občanským zákoníkem.`,
        `Provozovatel neodpovídá za škody na odložených věcech Hosta, pokud nebyly uloženy v místě k tomu určeném (uzamykatelný prostor, trezor).`,
      ],
    },
    {
      heading: "10. Reklamace",
      paragraphs: [
        `Případné vady ubytování nebo služeb je Host povinen reklamovat neprodleně po jejich zjištění u Provozovatele (telefonicky ${PHONE} nebo e-mailem ${EMAIL}), aby mohly být odstraněny ještě v průběhu pobytu.`,
        `Pokud vadu nelze odstranit, má Host právo na přiměřenou slevu z ceny. Pozdější reklamace (po skončení pobytu) je nutné uplatnit nejpozději do 14 dnů od ukončení pobytu.`,
        `V případě sporu mezi Provozovatelem a spotřebitelem má spotřebitel právo na mimosoudní řešení sporu prostřednictvím České obchodní inspekce (www.coi.cz).`,
      ],
    },
    {
      heading: "11. Ochrana osobních údajů",
      paragraphs: [
        `Zpracování osobních údajů Hosta se řídí samostatným dokumentem „Ochrana osobních údajů", který je nedílnou součástí těchto Podmínek a je dostupný v patičce webu.`,
      ],
    },
    {
      heading: "12. Závěrečná ustanovení",
      paragraphs: [
        `Provozovatel si vyhrazuje právo tyto Podmínky kdykoli změnit. Pro již uzavřené rezervace se použijí Podmínky ve znění platném v okamžiku uzavření smlouvy.`,
        `Aktuální znění Podmínek je zveřejněno na webu hivehouse.2pmoment.cz. Tyto Podmínky nabývají účinnosti dnem uvedeným v záhlaví.`,
      ],
    },
  ],
};

// ------------------------------------------------------------
// 2) OCHRANA OSOBNÍCH ÚDAJŮ (GDPR)
// ------------------------------------------------------------

const privacy: LegalDocument = {
  id: "privacy",
  title: "Ochrana osobních údajů",
  subtitle: `Informace o zpracování osobních údajů v souladu s GDPR`,
  updatedAt: "2026-04-17",
  sections: [
    {
      heading: "1. Správce osobních údajů",
      paragraphs: [
        `Správcem osobních údajů je společnost ${OPERATOR}, IČO ${ICO}, se sídlem ${ADDRESS} (dále jen „Správce"), která provozuje ubytovací zařízení Hive House.`,
        `Kontakt pro dotazy ohledně zpracování osobních údajů: ${EMAIL}, tel. ${PHONE}.`,
        `Správce nejmenoval pověřence pro ochranu osobních údajů (DPO), protože mu to zákon nenařizuje.`,
      ],
    },
    {
      heading: "2. Právní základ a účel zpracování",
      paragraphs: [
        `Vaše osobní údaje zpracováváme na základě těchto právních titulů dle čl. 6 odst. 1 nařízení (EU) 2016/679 (GDPR):`,
        {
          list: [
            `Plnění smlouvy (písm. b) — rezervace, poskytnutí ubytování, komunikace s hostem, vystavení daňového dokladu.`,
            `Splnění právní povinnosti (písm. c) — vedení evidence ubytovaných hostů dle zákona č. 565/1990 Sb. o místních poplatcích a dle zákona č. 326/1999 Sb. o pobytu cizinců; vedení účetnictví dle zákona č. 563/1991 Sb.`,
            `Oprávněný zájem Správce (písm. f) — vymáhání pohledávek, obrana proti nárokům, zajištění bezpečnosti objektu.`,
            `Souhlas subjektu údajů (písm. a) — zasílání novinek a marketingových sdělení, analytické cookies. Souhlas lze kdykoli odvolat.`,
          ],
        },
      ],
    },
    {
      heading: "3. Kategorie zpracovávaných údajů",
      paragraphs: [
        `Při rezervaci a ubytování zpracováváme zejména tyto osobní údaje:`,
        {
          list: [
            `Identifikační údaje — jméno, příjmení, datum narození, číslo dokladu totožnosti (pro evidenci hostů).`,
            `Kontaktní údaje — e-mail, telefon, adresa trvalého pobytu.`,
            `Platební údaje — bankovní spojení, variabilní symbol platby (nikdy celé číslo platební karty, to zpracovává platební brána).`,
            `Údaje o pobytu — datum příjezdu a odjezdu, počet osob, objednané služby.`,
            `Komunikace — obsah e-mailové a telefonické komunikace ohledně rezervace.`,
            `Technické údaje při návštěvě webu — IP adresa, cookies, informace o prohlížeči (viz dokument „Cookies").`,
          ],
        },
      ],
    },
    {
      heading: "4. Doba uchování údajů",
      paragraphs: [
        `Osobní údaje uchováváme pouze po dobu nezbytně nutnou:`,
        {
          list: [
            `Údaje pro účely smlouvy — po dobu jejího plnění a následně 4 roky pro případné právní nároky.`,
            `Účetní a daňové doklady — 10 let dle zákona č. 235/2004 Sb. o DPH.`,
            `Evidence hostů — 6 let dle zákona č. 565/1990 Sb.`,
            `Údaje pro marketingové účely — do odvolání souhlasu, nejdéle 5 let.`,
            `Cookies a analytická data — dle nastavení v dokumentu „Cookies" (standardně max. 26 měsíců).`,
          ],
        },
      ],
    },
    {
      heading: "5. Příjemci osobních údajů",
      paragraphs: [
        `Vaše údaje můžeme v nezbytném rozsahu předat těmto kategoriím příjemců:`,
        {
          list: [
            `Účetní a daňový poradce Správce (smluvní zpracovatel).`,
            `Provozovatel rezervačního systému a platební brány (zpracovatel na základě smlouvy o zpracování osobních údajů).`,
            `Google LLC — v anonymizované podobě pro účely analytiky (Google Analytics 4, pouze se souhlasem).`,
            `Orgány veřejné moci, pokud tak stanoví právní předpis (obecní úřad, Policie ČR, finanční správa).`,
          ],
        },
        `Osobní údaje nepředáváme mimo Evropský hospodářský prostor, s výjimkou standardních smluvních doložek při využití služeb Google LLC (GA4).`,
      ],
    },
    {
      heading: "6. Vaše práva",
      paragraphs: [
        `V souvislosti se zpracováním osobních údajů máte právo:`,
        {
          list: [
            `Na přístup ke svým osobním údajům (čl. 15 GDPR).`,
            `Na opravu nepřesných údajů (čl. 16 GDPR).`,
            `Na výmaz („právo být zapomenut") — pokud neexistuje jiný právní důvod pro zpracování (čl. 17 GDPR).`,
            `Na omezení zpracování (čl. 18 GDPR).`,
            `Na přenositelnost údajů (čl. 20 GDPR).`,
            `Vznést námitku proti zpracování založenému na oprávněném zájmu (čl. 21 GDPR).`,
            `Kdykoli odvolat udělený souhlas — bez vlivu na zákonnost zpracování před odvoláním.`,
            `Podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz, Pplk. Sochora 27, 170 00 Praha 7).`,
          ],
        },
        `Svá práva můžete uplatnit e-mailem na ${EMAIL} nebo písemně na adrese Správce.`,
      ],
    },
    {
      heading: "7. Cookies a analytika",
      paragraphs: [
        `Web Hive House používá cookies. Podrobné informace — jaké cookies používáme, jak je vypnout a jak odvolat souhlas — najdete v samostatném dokumentu „Cookies" dostupném v patičce webu.`,
      ],
    },
    {
      heading: "8. Závěrečná ustanovení",
      paragraphs: [
        `Tyto zásady nabývají účinnosti dnem uvedeným v záhlaví. Správce si vyhrazuje právo zásady aktualizovat; aktuální znění je vždy zveřejněno na webu hivehouse.2pmoment.cz.`,
      ],
    },
  ],
};

// ------------------------------------------------------------
// 3) COOKIES
// ------------------------------------------------------------

const cookies: LegalDocument = {
  id: "cookies",
  title: "Zásady používání cookies",
  subtitle: "Jak Hive House pracuje s cookies a podobnými technologiemi",
  updatedAt: "2026-04-17",
  sections: [
    {
      heading: "1. Co jsou cookies",
      paragraphs: [
        `Cookies jsou malé textové soubory, které web ukládá do vašeho prohlížeče. Slouží k tomu, aby si web zapamatoval vaše preference, rozpoznal opakovaného návštěvníka nebo anonymně analyzoval návštěvnost.`,
        `Používání cookies upravuje § 89 zákona č. 127/2005 Sb., o elektronických komunikacích, a nařízení (EU) 2016/679 (GDPR).`,
      ],
    },
    {
      heading: "2. Jaké cookies používáme",
      paragraphs: [
        `Web Hive House používá dva druhy cookies:`,
        {
          list: [
            `Nezbytné (technické) cookies — slouží k základnímu fungování webu (uložení vašeho souhlasu / nesouhlasu s cookies). Tyto cookies zpracováváme bez souhlasu na základě oprávněného zájmu.`,
            `Analytické cookies — slouží k anonymnímu měření návštěvnosti přes Google Analytics 4 (GA4). Tyto cookies zpracováváme pouze s vaším souhlasem.`,
          ],
        },
        `Marketingové a remarketingové cookies neznáme — web Hive House neprovozuje cílenou reklamu ani remarketing.`,
      ],
    },
    {
      heading: "3. Konkrétní používané cookies",
      paragraphs: [
        `Přehled cookies, které se mohou na webu Hive House objevit:`,
        {
          list: [
            `hivehouse-cookie-consent (nezbytná) — ukládá váš souhlas/nesouhlas s analytickými cookies. Doba trvání: 12 měsíců. Poskytovatel: hivehouse.2pmoment.cz.`,
            `_ga, _ga_* (analytická) — unikátní anonymní ID pro Google Analytics 4. Doba trvání: 24 měsíců. Poskytovatel: Google LLC.`,
            `_gid (analytická) — identifikátor relace pro GA4. Doba trvání: 24 hodin. Poskytovatel: Google LLC.`,
          ],
        },
      ],
    },
    {
      heading: "4. Souhlas a jeho odvolání",
      paragraphs: [
        `Při první návštěvě webu se zobrazí cookie banner, ve kterém můžete souhlasit nebo odmítnout analytické cookies. Nezbytné (technické) cookies se zpracovávají bez souhlasu.`,
        `Svou volbu můžete kdykoli změnit — smazáním cookies z prohlížeče (v nastavení prohlížeče) nebo kontaktováním Správce na ${EMAIL}.`,
        `Váš prohlížeč umí cookies plošně blokovat nebo mazat — návody najdete na webech Chrome, Firefox, Safari a Edge. Vypnutí nezbytných cookies může omezit funkčnost webu.`,
      ],
    },
    {
      heading: "5. Předávání údajů mimo EU",
      paragraphs: [
        `Google Analytics 4 zpracovává anonymizované údaje na serverech společnosti Google LLC v USA. Předávání probíhá na základě standardních smluvních doložek schválených Evropskou komisí.`,
      ],
    },
    {
      heading: "6. Kontakt",
      paragraphs: [
        `Dotazy k cookies směřujte na ${EMAIL} nebo telefonicky na ${PHONE}. Více o zpracování osobních údajů najdete v dokumentu „Ochrana osobních údajů".`,
      ],
    },
  ],
};

// ------------------------------------------------------------
// Export — registr všech dokumentů
// ------------------------------------------------------------

export const legalDocuments: Record<LegalId, LegalDocument> = {
  terms,
  privacy,
  cookies,
};

export const legalDisclaimer =
  "Toto je vzorové znění. Před ostrým spuštěním doporučujeme právní revizi (zejména storno podmínky, evidence hostů a GDPR).";
