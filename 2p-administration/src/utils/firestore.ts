import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type {
  Promotion, FishingPermit, GiftVoucher, SurroundingPlace,
  RoomContent, RoomStorySection, RoomEquipmentItem, RoomFacilityItem,
  FishingContent, FishingStep, FishingInfoCard,
  SurroundingsPageContent,
  ApiaryContent, GlampingCard,
  Review, ContactContent,
  VoucherFormConfig, PermitFormConfig,
  HomepageHero, HomepageOfferings, HomepageOfferingCard,
  HomepageApitherapy, HomepageApiBenefit,
  HomepageTrustbar, HomepageReviewsConfig,
  ManagedImage,
} from "../types";

const COL_PROMOTIONS = "hive-house-promotions";
const COL_PERMITS    = "hive-house-permits";
const COL_VOUCHERS   = "hive-house-vouchers";
const COL_SURROUNDINGS = "hive-house-surroundings";
const COL_ROOM = "hive-house-room";
const ROOM_DOC_ID = "main";

// --- Promotions ---
export function subscribePromotions(cb: (p: Promotion[]) => void): Unsubscribe {
  return onSnapshot(collection(db, COL_PROMOTIONS), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Promotion));
  });
}

export async function savePromotion(promo: Promotion): Promise<void> {
  const { id, ...data } = promo;
  await setDoc(doc(db, COL_PROMOTIONS, id), data);
}

export async function deletePromotion(id: string): Promise<void> {
  await deleteDoc(doc(db, COL_PROMOTIONS, id));
}

export function newPromotion(): Promotion {
  return {
    id: `promo-${Date.now()}`,
    enabled: false,
    badge: "Nová akce",
    title: "",
    text: "",
    ctaLabel: "Více informací",
    ctaHref: "#rezervace",
  };
}

// --- Surroundings ---
export async function loadSurroundingPlaces(): Promise<SurroundingPlace[]> {
  const snap = await getDocs(query(collection(db, COL_SURROUNDINGS), orderBy("sortOrder", "asc")));
  return snap.docs.map((d, index) => {
    const raw = d.data() as Partial<SurroundingPlace>;
    return {
      id: d.id,
      enabled: true,
      sortOrder: index,
      title: "",
      subtitle: "",
      distance: "",
      description: "",
      imageUrl: "",
      imageStoragePath: "",
      linkHref: "/vylety",
      tags: [],
      mapEmbedUrl: "",
      tip: "",
      ...raw,
      gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
    } as SurroundingPlace;
  });
}

export async function saveSurroundingPlace(place: SurroundingPlace): Promise<void> {
  const normalizedPlace: SurroundingPlace = {
    ...place,
    title: place.title.trim(),
    subtitle: place.subtitle.trim(),
    distance: place.distance.trim(),
    description: place.description.trim(),
    imageUrl: place.imageUrl.trim(),
    imageStoragePath: place.imageStoragePath?.trim() || "",
    linkHref: place.linkHref.trim() || "/vylety",
    tags: place.tags.map((tag) => tag.trim()).filter(Boolean),
    gallery: (place.gallery || []).filter((img) => img.url && img.url.trim()).map((img) => ({
      url: img.url.trim(),
      storagePath: img.storagePath?.trim() || "",
      alt: img.alt?.trim() || "",
    })),
    mapEmbedUrl: place.mapEmbedUrl?.trim() || "",
    tip: place.tip?.trim() || "",
    sortOrder: Number.isFinite(place.sortOrder) ? place.sortOrder : 0,
  };
  const { id, ...data } = normalizedPlace;
  await setDoc(doc(db, COL_SURROUNDINGS, id), data);
}

export async function deleteSurroundingPlace(id: string): Promise<void> {
  await deleteDoc(doc(db, COL_SURROUNDINGS, id));
}

export async function reorderSurroundingPlaces(places: SurroundingPlace[]): Promise<void> {
  const batch = writeBatch(db);
  places.forEach((place, index) => {
    batch.set(doc(db, COL_SURROUNDINGS, place.id), { ...place, sortOrder: index }, { merge: true });
  });
  await batch.commit();
}

export function newSurroundingPlace(sortOrder: number): SurroundingPlace {
  return {
    id: `place-${Date.now()}`,
    enabled: true,
    sortOrder,
    title: "",
    subtitle: "",
    distance: "",
    description: "",
    imageUrl: "",
    imageStoragePath: "",
    linkHref: "/vylety",
    tags: [],
    gallery: [],
    mapEmbedUrl: "",
    tip: "",
  };
}

// --- Room content ---
// Struktura: každá sekce je vlastní dokument v kolekci hive-house-room
// Dokumenty: "hero" | "content" | "gallery" | "sections"
// Starý dokument "main" slouží jako fallback (migrace).

function buildRoomFromSectionData(
  heroData: Record<string, unknown>,
  contentData: Record<string, unknown>,
  galleryData: Record<string, unknown>,
  sectionsData: Record<string, unknown>,
  equipmentData: Record<string, unknown> = {},
  facilitiesData: Record<string, unknown> = {},
): RoomContent {
  const d = newRoomContent();
  return {
    ...d,
    heroEyebrow:       (heroData.heroEyebrow as string)       ?? d.heroEyebrow,
    heroTitle:         (heroData.heroTitle as string)         ?? d.heroTitle,
    heroHighlight:     (heroData.heroHighlight as string)     ?? d.heroHighlight,
    heroDescription:   (heroData.heroDescription as string)   ?? d.heroDescription,
    ...(heroData.heroImage ? { heroImage: heroData.heroImage as RoomContent["heroImage"] } : {}),
    detailEyebrow:     (contentData.detailEyebrow as string)  ?? d.detailEyebrow,
    title:             (contentData.title as string)          ?? d.title,
    detailHighlight:   (contentData.detailHighlight as string)?? d.detailHighlight,
    description:       (contentData.description as string)    ?? d.description,
    modalTitle:        (contentData.modalTitle as string)     ?? d.modalTitle,
    modalSubtitle:     (contentData.modalSubtitle as string)  ?? d.modalSubtitle,
    modalDescription:  (contentData.modalDescription as string) ?? d.modalDescription,
    reserveLabel:      (contentData.reserveLabel as string)   ?? d.reserveLabel,
    galleryLabel:      (contentData.galleryLabel as string)   ?? d.galleryLabel,
    voucherLabel:      (contentData.voucherLabel as string)   ?? d.voucherLabel,
    showReserveBtn: typeof contentData.showReserveBtn === "boolean" ? contentData.showReserveBtn : d.showReserveBtn,
    showGalleryBtn: typeof contentData.showGalleryBtn === "boolean" ? contentData.showGalleryBtn : d.showGalleryBtn,
    showVoucherBtn: typeof contentData.showVoucherBtn === "boolean" ? contentData.showVoucherBtn : d.showVoucherBtn,
    buttonsOrder: Array.isArray(contentData.buttonsOrder)
      ? ((contentData.buttonsOrder as string[]).filter((k): k is "reserve" | "gallery" | "voucher" =>
          k === "reserve" || k === "gallery" || k === "voucher"))
      : d.buttonsOrder,
    labels: Array.isArray(contentData.labels) ? (contentData.labels as string[]) : d.labels,
    images: Array.isArray(galleryData.images)
      ? (galleryData.images as Array<string | RoomContent["images"][number]>).map((img) =>
          typeof img === "string" ? { url: img } : { url: img.url, storagePath: img.storagePath, alt: img.alt },
        )
      : d.images,
    sections: Array.isArray(sectionsData.sections)
      ? (sectionsData.sections as Array<Partial<RoomStorySection>>).map((s, i) => ({
          id: s.id || `room-section-${i}`,
          eyebrow: s.eyebrow || "",
          title: s.title || "",
          text: s.text || "",
          layout: s.layout,
          image: s.image,
        }))
      : d.sections,
    equipment: Array.isArray(equipmentData.equipment)
      ? (equipmentData.equipment as Array<Partial<RoomEquipmentItem>>).map((e, i) => ({
          id: e.id || `eq-${i}`,
          icon: e.icon || "🏠",
          title: e.title || "",
          desc: e.desc || "",
        }))
      : d.equipment,
    facilities: Array.isArray(facilitiesData.facilities)
      ? (facilitiesData.facilities as Array<Partial<RoomFacilityItem>>).map((f, i) => ({
          id: f.id || `fac-${i}`,
          icon: f.icon || "🏠",
          title: f.title || "",
          desc: f.desc || "",
        }))
      : d.facilities,
    intentional: Array.isArray(facilitiesData.intentional)
      ? (facilitiesData.intentional as Array<Partial<RoomFacilityItem>>).map((f, i) => ({
          id: f.id || `int-${i}`,
          icon: f.icon || "🌿",
          title: f.title || "",
          desc: f.desc || "",
        }))
      : d.intentional,
  } as RoomContent;
}

export async function loadRoomContent(): Promise<RoomContent> {
  const [heroSnap, contentSnap, gallerySnap, sectionsSnap, equipmentSnap, facilitiesSnap] = await Promise.all([
    getDoc(doc(db, COL_ROOM, "hero")),
    getDoc(doc(db, COL_ROOM, "content")),
    getDoc(doc(db, COL_ROOM, "gallery")),
    getDoc(doc(db, COL_ROOM, "sections")),
    getDoc(doc(db, COL_ROOM, "equipment")),
    getDoc(doc(db, COL_ROOM, "facilities")),
  ]);

  // Fallback: pokud neexistují sekční dokumenty, zkus starý "main"
  if (!heroSnap.exists() && !contentSnap.exists() && !gallerySnap.exists() && !sectionsSnap.exists()) {
    const mainSnap = await getDoc(doc(db, COL_ROOM, ROOM_DOC_ID));
    if (!mainSnap.exists()) return newRoomContent();
    const data = mainSnap.data() as Partial<RoomContent> & {
      images?: Array<string | RoomContent["images"][number]>;
      sections?: Array<Partial<RoomStorySection>>;
    };
    return buildRoomFromSectionData(data as Record<string, unknown>, data as Record<string, unknown>, data as Record<string, unknown>, data as Record<string, unknown>, {}, {});
  }

  return buildRoomFromSectionData(
    heroSnap.exists() ? (heroSnap.data() as Record<string, unknown>) : {},
    contentSnap.exists() ? (contentSnap.data() as Record<string, unknown>) : {},
    gallerySnap.exists() ? (gallerySnap.data() as Record<string, unknown>) : {},
    sectionsSnap.exists() ? (sectionsSnap.data() as Record<string, unknown>) : {},
    equipmentSnap.exists() ? (equipmentSnap.data() as Record<string, unknown>) : {},
    facilitiesSnap.exists() ? (facilitiesSnap.data() as Record<string, unknown>) : {},
  );
}

// Uložení jednotlivých sekcí pokoje
export async function saveRoomHero(
  data: Pick<RoomContent, "heroEyebrow" | "heroTitle" | "heroHighlight" | "heroDescription" | "heroImage">,
): Promise<void> {
  const payload: Record<string, unknown> = {
    heroEyebrow:     data.heroEyebrow.trim(),
    heroTitle:       data.heroTitle.trim(),
    heroHighlight:   data.heroHighlight.trim(),
    heroDescription: data.heroDescription.trim(),
  };
  if (data.heroImage) payload.heroImage = data.heroImage;
  await setDoc(doc(db, COL_ROOM, "hero"), payload);
}

export async function saveRoomDetail(
  data: Pick<RoomContent, "detailEyebrow" | "title" | "detailHighlight" | "description" | "modalTitle" | "modalSubtitle" | "modalDescription" | "reserveLabel" | "galleryLabel" | "voucherLabel" | "showReserveBtn" | "showGalleryBtn" | "showVoucherBtn" | "buttonsOrder" | "labels">,
): Promise<void> {
  await setDoc(doc(db, COL_ROOM, "content"), {
    detailEyebrow:    data.detailEyebrow.trim(),
    title:            data.title.trim(),
    detailHighlight:  data.detailHighlight.trim(),
    description:      data.description.trim(),
    modalTitle:       data.modalTitle.trim(),
    modalSubtitle:    data.modalSubtitle.trim(),
    modalDescription: data.modalDescription.trim(),
    reserveLabel:     data.reserveLabel.trim() || "Rezervovat pobyt",
    galleryLabel:     data.galleryLabel.trim() || "Zobrazit galerii",
    voucherLabel:     data.voucherLabel.trim() || "Koupit poukázku",
    showReserveBtn:   data.showReserveBtn,
    showGalleryBtn:   data.showGalleryBtn,
    showVoucherBtn:   data.showVoucherBtn,
    buttonsOrder:     data.buttonsOrder,
    labels:           data.labels.map((l) => l.trim()).filter(Boolean),
  });
}

export async function saveRoomGallery(data: Pick<RoomContent, "images">): Promise<void> {
  await setDoc(doc(db, COL_ROOM, "gallery"), {
    images: data.images
      .filter((img) => img.url.trim())
      .map((img) => ({ url: img.url.trim(), storagePath: img.storagePath?.trim() || "", alt: img.alt?.trim() || "" })),
  });
}

export async function saveRoomSections(data: Pick<RoomContent, "sections">): Promise<void> {
  await setDoc(doc(db, COL_ROOM, "sections"), {
    sections: data.sections.map((s, i) => ({
      id:      s.id || `room-section-${i}`,
      eyebrow: s.eyebrow.trim(),
      title:   s.title.trim(),
      text:    s.text.trim(),
      layout:  s.layout || "text",
      ...(s.image ? { image: s.image } : {}),
    })),
  });
}

export async function saveRoomEquipment(data: Pick<RoomContent, "equipment">): Promise<void> {
  await setDoc(doc(db, COL_ROOM, "equipment"), {
    equipment: data.equipment.map((e, i) => ({
      id:    e.id || `eq-${i}`,
      icon:  e.icon.trim() || "🏠",
      title: e.title.trim(),
      desc:  e.desc.trim(),
    })),
  });
}

export async function saveRoomFacilities(data: Pick<RoomContent, "facilities" | "intentional">): Promise<void> {
  await setDoc(doc(db, COL_ROOM, "facilities"), {
    facilities: data.facilities.map((f, i) => ({
      id:    f.id || `fac-${i}`,
      icon:  f.icon.trim() || "🏠",
      title: f.title.trim(),
      desc:  f.desc.trim(),
    })),
    intentional: data.intentional.map((f, i) => ({
      id:    f.id || `int-${i}`,
      icon:  f.icon.trim() || "🌿",
      title: f.title.trim(),
      desc:  f.desc.trim(),
    })),
  });
}

export function newRoomContent(): RoomContent {
  return {
    id: ROOM_DOC_ID,
    heroEyebrow: "Ubytování",
    heroTitle: "Pokoj Hive House",
    heroHighlight: "na jedné stránce",
    heroDescription:
      "Tady najdou hosté konkrétní představu o interiéru, vybavení, soukromí i atmosféře pobytu. Hlavní stránka je navede, detail jim pomůže rozhodnout se.",
    detailEyebrow: "Co hosté uvidí",
    title: "Pokoj Hive House",
    detailHighlight: "bez zbytečného chaosu",
    description:
      "Detail ubytování má jasně ukázat, že nejde jen o hezkou fotku. Hosté potřebují rozumět tomu, co je čeká, jaké mají zázemí a proč je pobyt v Hive House jiný než běžné ubytování.",
    modalTitle: "Ubytování v Hive House",
    modalSubtitle: "Fotky a základní informace",
    modalDescription:
      "Popup slouží jako rychlý náhled přímo z homepage nebo z detailu. Návštěvník si díky němu udělá rychlou představu, aniž by ztratil kontext.",
    reserveLabel: "Rezervovat pobyt",
    galleryLabel: "Zobrazit galerii",
    voucherLabel: "Koupit poukázku",
    showReserveBtn: true,
    showGalleryBtn: true,
    showVoucherBtn: true,
    buttonsOrder: ["reserve", "gallery", "voucher"],
    labels: [],
    images: [],
    sections: [
      {
        id: "room-section-1",
        eyebrow: "Ráno v Hive House",
        title: "Klidný start dne bez rušivých podnětů",
        text: "Ranní káva na terase, výhled do krajiny a pocit, že nikam nemusíte. Tahle část stránky má prodávat atmosféru stejně silně jako samotné vybavení.",
      },
      {
        id: "room-section-2",
        eyebrow: "Večer a odpočinek",
        title: "Pobyt, který má být zážitkem, ne jen přespáním",
        text: "Komfortní interiér, klid a propojení s přírodou vytváří ideální prostor pro páry, které chtějí zpomalit a být chvíli mimo běžný provoz.",
      },
    ],
    equipment: [
      { id: "eq-1", icon: "🛏️", title: "Postel 140 cm + 90 cm", desc: "Dvojlůžko a jednolůžko s kvalitní matrací pro klidný spánek" },
      { id: "eq-2", icon: "🗄️", title: "Skříň a stůl", desc: "Prostor pro osobní věci a pohodlné stolní zázemí" },
      { id: "eq-3", icon: "🌡️", title: "Klimatizace", desc: "Příjemná teplota v létě i v zimě — plně regulovatelná" },
      { id: "eq-4", icon: "💡", title: "Elektřina a osvětlení", desc: "Plnohodnotné elektrické rozvody a ambientní osvětlení" },
      { id: "eq-5", icon: "📶", title: "Wi-Fi připojení", desc: "Stabilní internetové připojení pro práci i zábavu" },
      { id: "eq-6", icon: "🔌", title: "Zásuvky pro nabíjení", desc: "Dostatek zásuvek pro mobily, notebooky a další elektroniku" },
    ],
    facilities: [
      { id: "fac-1", icon: "🍳", title: "Kuchyňka a jídelní kout", desc: "Společný prostor cca 5 metrů od domku s možností vlastního vaření" },
      { id: "fac-2", icon: "🚿", title: "Toaleta a umyvadlo", desc: "Samostatné sociální zařízení rovněž 5 metrů od ubytování" },
    ],
    intentional: [
      { id: "int-1", icon: "🌿", title: "Stravování", desc: "Není součástí pobytu — můžete si vařit sami z lokálních surovin v naší kuchyňce" },
      { id: "int-2", icon: "🌙", title: "Televize a rádio", desc: "Úmyslně. Pro zachování ticha a hlubšího vnímání přírody kolem vás" },
    ],
  };
}

// --- Fishing PAGE content ---
const COL_FISHING = "hive-house-fishing";
const FISHING_DOC_ID = "main";

export function newFishingContent(): FishingContent {
  return {
    heroEyebrow: "Rybaření",
    heroTitle: "Rybník přímo u chalupy",
    heroHighlight: "pro hosty i veřejnost",
    heroDescription: "Klidné rybaření v přírodním prostředí s výhledem na lesy. Povolení si objednáte online ještě před příjezdem.",
    stepsTitle: "Jak si objednat povolení",
    steps: [
      { id: "step-1", icon: "📋", title: "Vyplňte formulář", text: "Zadejte jméno, datum a počet osob." },
      { id: "step-2", icon: "💳", title: "Uhraďte poplatek", text: "Platba probíhá bezpečně online nebo na místě." },
      { id: "step-3", icon: "🎣", title: "Přijďte rybařit", text: "Povolení dostanete e-mailem a platí na zvolený den." },
    ],
    infoCards: [
      { id: "info-1", label: "Denní povolení", value: "250 Kč / osoba" },
      { id: "info-2", label: "Hasiči z Hojnovic", value: "Zdarma" },
      { id: "info-3", label: "Otevřeno", value: "celoročně" },
    ],
    ctaLabel: "Objednat povolení",
    ctaHref: "#povoleni",
    gallery: [],
  };
}

// Struktura: "hero" | "steps" | "info" | "gallery" (starý "main" jako fallback)

function buildFishingFromSectionData(
  heroData: Record<string, unknown>,
  stepsData: Record<string, unknown>,
  infoData: Record<string, unknown>,
  galData: Record<string, unknown> = {},
): FishingContent {
  const d = newFishingContent();
  return {
    heroEyebrow:     (heroData.heroEyebrow as string)     ?? d.heroEyebrow,
    heroTitle:       (heroData.heroTitle as string)       ?? d.heroTitle,
    heroHighlight:   (heroData.heroHighlight as string)   ?? d.heroHighlight,
    heroDescription: (heroData.heroDescription as string) ?? d.heroDescription,
    ...(heroData.heroImage ? { heroImage: heroData.heroImage as FishingContent["heroImage"] } : {}),
    ctaLabel: (heroData.ctaLabel as string) ?? d.ctaLabel,
    ctaHref:  (heroData.ctaHref as string)  ?? d.ctaHref,
    stepsTitle: (stepsData.stepsTitle as string) ?? d.stepsTitle,
    steps: Array.isArray(stepsData.steps)
      ? (stepsData.steps as Array<Partial<FishingStep>>).map((s, i) => ({ id: s.id || `step-${i}`, icon: s.icon || "", title: s.title || "", text: s.text || "" }))
      : d.steps,
    infoCards: Array.isArray(infoData.infoCards)
      ? (infoData.infoCards as Array<Partial<FishingInfoCard>>).map((c, i) => ({ id: c.id || `info-${i}`, label: c.label || "", value: c.value || "" }))
      : d.infoCards,
    gallery: Array.isArray(galData.gallery)
      ? (galData.gallery as Array<Partial<ManagedImage>>).map((img) => ({ url: img.url || "", storagePath: img.storagePath, alt: img.alt }))
      : d.gallery,
  };
}

export async function loadFishingContent(): Promise<FishingContent> {
  const [heroSnap, stepsSnap, infoSnap, galSnap, mainSnap] = await Promise.all([
    getDoc(doc(db, COL_FISHING, "hero")),
    getDoc(doc(db, COL_FISHING, "steps")),
    getDoc(doc(db, COL_FISHING, "info")),
    getDoc(doc(db, COL_FISHING, "gallery")),
    getDoc(doc(db, COL_FISHING, FISHING_DOC_ID)),
  ]);

  // Fallback: pokud specifický doc neexistuje, zkusí main doc
  const main = mainSnap.exists() ? (mainSnap.data() as Record<string, unknown>) : {};
  const heroData  = heroSnap.exists()  ? (heroSnap.data() as Record<string, unknown>)  : main;
  const stepsData = stepsSnap.exists() ? (stepsSnap.data() as Record<string, unknown>) : main;
  const infoData  = infoSnap.exists()  ? (infoSnap.data() as Record<string, unknown>)  : main;
  const galData   = galSnap.exists()   ? (galSnap.data() as Record<string, unknown>)   : main;

  if (!heroSnap.exists() && !stepsSnap.exists() && !infoSnap.exists() && !galSnap.exists() && !mainSnap.exists()) {
    return newFishingContent();
  }

  return buildFishingFromSectionData(heroData, stepsData, infoData, galData);
}

export async function saveFishingHero(
  data: Pick<FishingContent, "heroEyebrow" | "heroTitle" | "heroHighlight" | "heroDescription" | "heroImage" | "ctaLabel" | "ctaHref">,
): Promise<void> {
  const payload: Record<string, unknown> = {
    heroEyebrow:     data.heroEyebrow.trim(),
    heroTitle:       data.heroTitle.trim(),
    heroHighlight:   data.heroHighlight.trim(),
    heroDescription: data.heroDescription.trim(),
    ctaLabel:        data.ctaLabel.trim(),
    ctaHref:         data.ctaHref.trim(),
  };
  if (data.heroImage) payload.heroImage = data.heroImage;
  await setDoc(doc(db, COL_FISHING, "hero"), payload);
}

export async function saveFishingSteps(data: Pick<FishingContent, "stepsTitle" | "steps">): Promise<void> {
  await setDoc(doc(db, COL_FISHING, "steps"), {
    stepsTitle: data.stepsTitle.trim(),
    steps: data.steps.map((s, i) => ({ id: s.id || `step-${i}`, icon: s.icon, title: s.title.trim(), text: s.text.trim() })),
  });
}

export async function saveFishingInfo(data: Pick<FishingContent, "infoCards">): Promise<void> {
  await setDoc(doc(db, COL_FISHING, "info"), {
    infoCards: data.infoCards.map((c, i) => ({ id: c.id || `info-${i}`, label: c.label.trim(), value: c.value.trim() })),
  });
}

export async function saveFishingGallery(data: Pick<FishingContent, "gallery">): Promise<void> {
  await setDoc(doc(db, COL_FISHING, "gallery"), {
    gallery: data.gallery.map((img) => ({ url: img.url, storagePath: img.storagePath || "", alt: img.alt || "" })),
  });
}

// --- Surroundings PAGE config ---
const COL_SURROUNDINGS_PAGE = "hive-house-surroundings-page";
const SURROUNDINGS_PAGE_DOC_ID = "main";

export function newSurroundingsPageContent(): SurroundingsPageContent {
  return {
    heroEyebrow: "Okolí",
    heroTitle: "Objevujte okolí",
    heroHighlight: "krok za krokem",
    heroDescription: "Hojnovice a okolí nabízejí spoustu zážitků — od přírody přes historii až po gastronomii.",
    sectionTitle: "Tipy na výlety",
    sectionSubtitle: "Ručně vybraná místa v dosahu do hodiny jízdy",
  };
}

export async function loadSurroundingsPageContent(): Promise<SurroundingsPageContent> {
  const snap = await getDoc(doc(db, COL_SURROUNDINGS_PAGE, SURROUNDINGS_PAGE_DOC_ID));
  if (!snap.exists()) return newSurroundingsPageContent();
  return { ...newSurroundingsPageContent(), ...(snap.data() as Partial<SurroundingsPageContent>) };
}

export async function saveSurroundingsPageContent(content: SurroundingsPageContent): Promise<void> {
  await setDoc(doc(db, COL_SURROUNDINGS_PAGE, SURROUNDINGS_PAGE_DOC_ID), content);
}

// --- Apiary / Glamping PAGE content ---
const COL_APIARY = "hive-house-apiary";
const APIARY_DOC_ID = "main";

export function newApiaryContent(): ApiaryContent {
  return {
    heroEyebrow: "Včelín & Glamping",
    heroTitle: "Příroda, klid",
    heroHighlight: "a vůně medu",
    heroDescription: "Glamping stan u lesa s přímým výhledem na včelín. Zažijte přírodu bez kompromisů.",
    glampingTitle: "Glamping pod hvězdami",
    glampingSubtitle: "Komfort v přírodě",
    glampingCards: [
      { id: "glamping-1", selected: true, sortOrder: 0, title: "Prostorný stan", subtitle: "Komfort v přírodě", description: "Velký glamping stan s pohodlnou postelí a dekorací.", image: undefined },
      { id: "glamping-2", selected: true, sortOrder: 1, title: "Soukromá terasa", subtitle: "Váš kout ráje", description: "Vlastní terasa s výhledem na louku a les.", image: undefined },
      { id: "glamping-3", selected: true, sortOrder: 2, title: "Ranní snídaně", subtitle: "Z místních zdrojů", description: "Snídaně s medem přímo od včelaře.", image: undefined },
    ],
    beeLivingTitle: "Léčivé vlastnosti včel",
    beeLivingHighlight: "Pobyt se včelami",
    beeLivingText: "Ubytování v moderní maringotce se včelími úly je nejen unikátní zážitek, ale také obohacující pobyt spojený s přírodou. Když vkročíte dovnitř, ucítíte charakteristickou vůni včel, která vás obklopuje a nabízí jedinečný zážitek pro vaše smysly.\n\nVůně včel a vosku, která se šíří v prostoru ubytování, má řadu pozitivních vlivů na tělo a mysl. Vdechování této přírodní vůně může působit jako relaxační terapie, snižovat úzkost a stres a přispívat k obnově energie a vitality.\n\nSamotný pobyt v blízkosti včelích úlů může být obohacujícím a vzdělávacím zážitkem. Budete moct pozorovat včely uvnitř našeho ubytování a být tak svědkem jejich práce a života.",
    apiTherapyTitle: "Co je apiterapie",
    apiTherapyHighlight: "Léčba přírodou",
    apiTherapyText: "Apiterapie je léčebná metoda a forma alternativní medicíny, která využívá produkty včel, jako jsou med, propolis, mateří kašička, včelí jed a včelí vosk, pro prevenci a léčbu různých zdravotních problémů. Tento tradiční přístup je známý již tisíce let a využívá se v různých kulturách po celém světě. Za zakladatele moderní apiterapie je považován Dr. Philipp Terč (jeho knihu si u nás můžete během pobytu přečíst).",
    apiTherapyProducts: [
      { id: "prod-med", icon: "🍯", title: "Med", text: "Používá se nejen jako sladidlo, ale také pro své antibakteriální, protizánětlivé a antioxidační vlastnosti. Obsahuje enzymy, vitamíny a minerály, které posilují imunitní systém a podporují trávení." },
      { id: "prod-propolis", icon: "🌿", title: "Propolis", text: "Je pryskyřičná látka sbíraná včelami z pupenů stromů a rostlin. Má taktéž silné antibakteriální, antivirové a protizánětlivé účinky a používá se k podpoře imunitního systému a léčbě infekcí." },
      { id: "prod-kasicka", icon: "👑", title: "Mateří kašička", text: "Je výživná látka produkovaná včelami dělnicemi, která se podává larvám a včelí královně. Obsahuje vitamíny, minerály a aminokyseliny a používá se na podporu vitality a celkového zdraví." },
      { id: "prod-jed", icon: "💉", title: "Včelí jed", text: "Používá se zejména v terapii artritidy a dalších revmatických onemocnění pro své protizánětlivé vlastnosti. Apitoxin se aplikuje buď přímo včelím bodnutím, nebo ve formě injekcí či mastí." },
      { id: "prod-vosk", icon: "🕯️", title: "Včelí vosk", text: "Má hydratační a ochranné vlastnosti a je součástí mnoha kosmetických a léčivých přípravků pro péči o pokožku, zejména pro její hydrataci a ochranu." },
    ],
    experienceEyebrow: "Průběh zážitku",
    experienceTitle: "Co vás",
    experienceHighlight: "čeká",
    experienceIntro: "Od příchodu k úlům až po klidné zakončení — zážitek, který si užijete v pohodlí a vlastním tempu.",
    experienceSteps: [
      { id: "step-1", icon: "🌿", title: "Přivítání u včelína", text: "Klidný úvod na zahradě, krátké povídání o včelách a bezpečí." },
      { id: "step-2", icon: "🛋️", title: "Usazení do lehátka", text: "Pohodlné ležení přímo nad funkčními včelstvy — bez přímého kontaktu se včelami." },
      { id: "step-3", icon: "🐝", title: "Vnímání bzukotu", text: "Poslech nízkofrekvenčního zvuku úlu, teplo včelstva a vůně vosku." },
      { id: "step-4", icon: "☕", title: "Zakončení nad medem", text: "Na závěr ochutnávka medu přímo od našich včel a čas na sebe." },
    ],
    gallery: [],
  };
}

// Struktura: "hero" | "glamping" | "bee-living" | "api-therapy" (starý "main" jako fallback)

function normalizeGlampingCards(raw: Array<Partial<GlampingCard>>): GlampingCard[] {
  return raw.map((c, i) => ({
    id: c.id || `glamping-${i}`,
    selected: c.selected ?? false,
    sortOrder: c.sortOrder ?? i,
    title: c.title || "",
    subtitle: c.subtitle || "",
    description: c.description || "",
    image: c.image,
  }));
}

function buildApiaryFromSectionData(
  heroData: Record<string, unknown>,
  glampingData: Record<string, unknown>,
  beeData: Record<string, unknown>,
  apiData: Record<string, unknown>,
  experienceData: Record<string, unknown> = {},
  galleryData: Record<string, unknown> = {},
): ApiaryContent {
  const d = newApiaryContent();
  return {
    heroEyebrow:      (heroData.heroEyebrow as string)      ?? d.heroEyebrow,
    heroTitle:        (heroData.heroTitle as string)        ?? d.heroTitle,
    heroHighlight:    (heroData.heroHighlight as string)    ?? d.heroHighlight,
    heroDescription:  (heroData.heroDescription as string)  ?? d.heroDescription,
    ...(heroData.heroImage ? { heroImage: heroData.heroImage as ApiaryContent["heroImage"] } : {}),
    glampingTitle:    (glampingData.glampingTitle as string)    ?? d.glampingTitle,
    glampingSubtitle: (glampingData.glampingSubtitle as string) ?? d.glampingSubtitle,
    glampingCards: Array.isArray(glampingData.glampingCards)
      ? normalizeGlampingCards(glampingData.glampingCards as Array<Partial<GlampingCard>>)
      : d.glampingCards,
    beeLivingTitle:      (beeData.beeLivingTitle as string)      ?? d.beeLivingTitle,
    beeLivingHighlight:  (beeData.beeLivingHighlight as string)  ?? d.beeLivingHighlight,
    beeLivingText:       (beeData.beeLivingText as string)       ?? d.beeLivingText,
    ...(beeData.beeLivingImage ? { beeLivingImage: beeData.beeLivingImage as ApiaryContent["beeLivingImage"] } : {}),
    apiTherapyTitle:     (apiData.apiTherapyTitle as string)     ?? d.apiTherapyTitle,
    apiTherapyHighlight: (apiData.apiTherapyHighlight as string) ?? d.apiTherapyHighlight,
    apiTherapyText:      (apiData.apiTherapyText as string)      ?? d.apiTherapyText,
    ...(apiData.apiTherapyImage ? { apiTherapyImage: apiData.apiTherapyImage as ApiaryContent["apiTherapyImage"] } : {}),
    apiTherapyProducts: Array.isArray(apiData.apiTherapyProducts)
      ? (apiData.apiTherapyProducts as Array<Partial<ApiaryContent["apiTherapyProducts"][number]>>).map((p, i) => ({
          id: p.id || `prod-${i}`,
          icon: p.icon || "🍯",
          title: p.title || "",
          text: p.text || "",
        }))
      : d.apiTherapyProducts,
    experienceEyebrow:   (experienceData.experienceEyebrow as string)   ?? d.experienceEyebrow,
    experienceTitle:     (experienceData.experienceTitle as string)     ?? d.experienceTitle,
    experienceHighlight: (experienceData.experienceHighlight as string) ?? d.experienceHighlight,
    experienceIntro:     (experienceData.experienceIntro as string)     ?? d.experienceIntro,
    experienceSteps: Array.isArray(experienceData.experienceSteps)
      ? (experienceData.experienceSteps as Array<Partial<ApiaryContent["experienceSteps"][number]>>).map((s, i) => ({
          id: s.id || `step-${i}`,
          icon: s.icon || "🐝",
          title: s.title || "",
          text: s.text || "",
        }))
      : d.experienceSteps,
    gallery: Array.isArray(galleryData.gallery)
      ? (galleryData.gallery as Array<Partial<ManagedImage>>).map((img) => ({
          url: img.url || "",
          storagePath: img.storagePath,
          alt: img.alt,
        })).filter((img) => img.url)
      : d.gallery,
  };
}

export async function loadApiaryContent(): Promise<ApiaryContent> {
  const [heroSnap, glampingSnap, beeSnap, apiSnap, experienceSnap, gallerySnap] = await Promise.all([
    getDoc(doc(db, COL_APIARY, "hero")),
    getDoc(doc(db, COL_APIARY, "glamping")),
    getDoc(doc(db, COL_APIARY, "bee-living")),
    getDoc(doc(db, COL_APIARY, "api-therapy")),
    getDoc(doc(db, COL_APIARY, "experience")),
    getDoc(doc(db, COL_APIARY, "gallery")),
  ]);

  if (!heroSnap.exists() && !glampingSnap.exists() && !beeSnap.exists() && !apiSnap.exists() && !experienceSnap.exists() && !gallerySnap.exists()) {
    const mainSnap = await getDoc(doc(db, COL_APIARY, APIARY_DOC_ID));
    if (!mainSnap.exists()) return newApiaryContent();
    const data = mainSnap.data() as Record<string, unknown>;
    return buildApiaryFromSectionData(data, data, data, data, data, data);
  }

  return buildApiaryFromSectionData(
    heroSnap.exists() ? (heroSnap.data() as Record<string, unknown>) : {},
    glampingSnap.exists() ? (glampingSnap.data() as Record<string, unknown>) : {},
    beeSnap.exists() ? (beeSnap.data() as Record<string, unknown>) : {},
    apiSnap.exists() ? (apiSnap.data() as Record<string, unknown>) : {},
    experienceSnap.exists() ? (experienceSnap.data() as Record<string, unknown>) : {},
    gallerySnap.exists() ? (gallerySnap.data() as Record<string, unknown>) : {},
  );
}

export async function saveApiaryHero(
  data: Pick<ApiaryContent, "heroEyebrow" | "heroTitle" | "heroHighlight" | "heroDescription" | "heroImage">,
): Promise<void> {
  const payload: Record<string, unknown> = {
    heroEyebrow:     data.heroEyebrow.trim(),
    heroTitle:       data.heroTitle.trim(),
    heroHighlight:   data.heroHighlight.trim(),
    heroDescription: data.heroDescription.trim(),
  };
  if (data.heroImage) payload.heroImage = data.heroImage;
  await setDoc(doc(db, COL_APIARY, "hero"), payload);
}

export async function saveApiaryGlamping(
  data: Pick<ApiaryContent, "glampingTitle" | "glampingSubtitle" | "glampingCards">,
): Promise<void> {
  await setDoc(doc(db, COL_APIARY, "glamping"), {
    glampingTitle:    data.glampingTitle.trim(),
    glampingSubtitle: data.glampingSubtitle.trim(),
    glampingCards: data.glampingCards.map((c, i) => ({
      id:          c.id || `glamping-${i}`,
      selected:    c.selected,
      sortOrder:   c.sortOrder ?? i,
      title:       c.title.trim(),
      subtitle:    c.subtitle.trim(),
      description: c.description.trim(),
      ...(c.image ? { image: c.image } : {}),
    })),
  });
}

export async function saveApiaryBeeLiving(
  data: Pick<ApiaryContent, "beeLivingTitle" | "beeLivingHighlight" | "beeLivingText" | "beeLivingImage">,
): Promise<void> {
  const payload: Record<string, unknown> = {
    beeLivingTitle:     data.beeLivingTitle.trim(),
    beeLivingHighlight: data.beeLivingHighlight.trim(),
    beeLivingText:      data.beeLivingText.trim(),
  };
  if (data.beeLivingImage) payload.beeLivingImage = data.beeLivingImage;
  await setDoc(doc(db, COL_APIARY, "bee-living"), payload);
}

export async function saveApiaryApiTherapy(
  data: Pick<ApiaryContent, "apiTherapyTitle" | "apiTherapyHighlight" | "apiTherapyText" | "apiTherapyImage" | "apiTherapyProducts">,
): Promise<void> {
  const payload: Record<string, unknown> = {
    apiTherapyTitle:     data.apiTherapyTitle.trim(),
    apiTherapyHighlight: data.apiTherapyHighlight.trim(),
    apiTherapyText:      data.apiTherapyText.trim(),
    apiTherapyProducts: data.apiTherapyProducts.map((p, i) => ({
      id: p.id || `prod-${i}`,
      icon: p.icon || "🍯",
      title: p.title.trim(),
      text: p.text.trim(),
    })),
  };
  if (data.apiTherapyImage) payload.apiTherapyImage = data.apiTherapyImage;
  await setDoc(doc(db, COL_APIARY, "api-therapy"), payload);
}

export async function saveApiaryExperience(
  data: Pick<ApiaryContent, "experienceEyebrow" | "experienceTitle" | "experienceHighlight" | "experienceIntro" | "experienceSteps">,
): Promise<void> {
  await setDoc(doc(db, COL_APIARY, "experience"), {
    experienceEyebrow:   data.experienceEyebrow.trim(),
    experienceTitle:     data.experienceTitle.trim(),
    experienceHighlight: data.experienceHighlight.trim(),
    experienceIntro:     data.experienceIntro.trim(),
    experienceSteps: data.experienceSteps.map((s, i) => ({
      id: s.id || `step-${i}`,
      icon: s.icon || "🐝",
      title: s.title.trim(),
      text: s.text.trim(),
    })),
  });
}

export async function saveApiaryGallery(
  data: Pick<ApiaryContent, "gallery">,
): Promise<void> {
  await setDoc(doc(db, COL_APIARY, "gallery"), {
    gallery: data.gallery
      .filter((img) => img.url && img.url.trim())
      .map((img) => ({
        url: img.url.trim(),
        storagePath: img.storagePath?.trim() || "",
        alt: img.alt?.trim() || "",
      })),
  });
}

// --- Reviews ---
const COL_REVIEWS = "hive-house-reviews";

export async function loadReviews(): Promise<Review[]> {
  const snap = await getDocs(query(collection(db, COL_REVIEWS), orderBy("sortOrder", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

export async function saveReview(review: Review): Promise<void> {
  const { id, ...data } = review;
  await setDoc(doc(db, COL_REVIEWS, id), data);
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COL_REVIEWS, id));
}

export function newReview(sortOrder: number): Review {
  return {
    id: `review-${Date.now()}`,
    enabled: true,
    author: "",
    rating: 5,
    text: "",
    date: new Date().toISOString().slice(0, 10),
    source: "",
    sortOrder,
  };
}

// --- Contact ---
const COL_CONTACT = "hive-house-contact";
const CONTACT_DOC_ID = "main";

export function newContactContent(): ContactContent {
  return {
    contactName: "",
    phone: "",
    email: "",
    companyName: "2P s.r.o.",
    ico: "",
    address: "Hojnovice, Česká republika",
    checkIn: "14:00",
    checkOut: "11:00",
    capacity: 2,
    notes: "",
    mapEmbedUrl: "",
  };
}

export async function loadContactContent(): Promise<ContactContent> {
  const snap = await getDoc(doc(db, COL_CONTACT, CONTACT_DOC_ID));
  if (!snap.exists()) return newContactContent();
  return { ...newContactContent(), ...(snap.data() as Partial<ContactContent>) };
}

export async function saveContactContent(content: ContactContent): Promise<void> {
  await setDoc(doc(db, COL_CONTACT, CONTACT_DOC_ID), content);
}

// --- Fishing Permits ---
export async function loadPermits(): Promise<FishingPermit[]> {
  const snap = await getDocs(query(collection(db, COL_PERMITS), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FishingPermit);
}

export async function updatePermitStatus(id: string, status: FishingPermit["status"]): Promise<void> {
  await updateDoc(doc(db, COL_PERMITS, id), { status });
}

export async function createPermit(permit: Omit<FishingPermit, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COL_PERMITS), permit);
  return ref.id;
}

// --- Gift Vouchers ---
export async function loadVouchers(): Promise<GiftVoucher[]> {
  const snap = await getDocs(query(collection(db, COL_VOUCHERS), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GiftVoucher);
}

export async function updateVoucherStatus(id: string, status: GiftVoucher["status"]): Promise<void> {
  await updateDoc(doc(db, COL_VOUCHERS, id), { status });
}

// --- Voucher Form Config ---
const COL_VOUCHER_CONFIG = "hive-house-voucher-config";
const VOUCHER_CONFIG_DOC_ID = "main";

export function newVoucherFormConfig(): VoucherFormConfig {
  return {
    modalTitle: "Dárková poukázka",
    modalDesc: "Darujte nezapomenutelný zážitek. Poukázka na pobyt v 2P Hive House.",
    successMessage: "Poukázka byla odeslána\! Potvrzení přijde na váš e-mail.",
    pricePerNight: 3500,
    nightOptions: [1, 2, 3, 4, 5, 7],
    validityMonths: 12,
    payButtonLabel: "Zaplatit a odeslat",
    cancelButtonLabel: "Zrušit",
  };
}

export async function loadVoucherFormConfig(): Promise<VoucherFormConfig> {
  const snap = await getDoc(doc(db, COL_VOUCHER_CONFIG, VOUCHER_CONFIG_DOC_ID));
  if (!snap.exists()) return newVoucherFormConfig();
  return { ...newVoucherFormConfig(), ...(snap.data() as Partial<VoucherFormConfig>) };
}

export async function saveVoucherFormConfig(config: VoucherFormConfig): Promise<void> {
  await setDoc(doc(db, COL_VOUCHER_CONFIG, VOUCHER_CONFIG_DOC_ID), config);
}

// --- Permit Form Config ---
const COL_PERMIT_CONFIG = "hive-house-permit-config";
const PERMIT_CONFIG_DOC_ID = "main";

export function newPermitFormConfig(): PermitFormConfig {
  return {
    modalTitle: "Rybářská povolenka",
    modalDesc: "Sportovní rybolov na soukromém rybníku přímo u objektu.",
    successMessage: "Povolenka zarezervována! Potvrzení přijde na váš e-mail.",
    priceAdult: 150,
    priceFirefighter: 75,
    priceChild: 0,
    maxPersons: 4,
    discountFirefighterEnabled: true,
    discountFirefighterLabel: "Jsem hasič z Hojanovic",
    discountChildEnabled: true,
    discountChildLabel: "Jsem dítě z Hojanovic",
    payButtonLabel: "Zaplatit a rezervovat",
    cancelButtonLabel: "Zrušit",
  };
}

export async function loadPermitFormConfig(): Promise<PermitFormConfig> {
  const snap = await getDoc(doc(db, COL_PERMIT_CONFIG, PERMIT_CONFIG_DOC_ID));
  if (!snap.exists()) return newPermitFormConfig();
  return { ...newPermitFormConfig(), ...(snap.data() as Partial<PermitFormConfig>) };
}

export async function savePermitFormConfig(config: PermitFormConfig): Promise<void> {
  await setDoc(doc(db, COL_PERMIT_CONFIG, PERMIT_CONFIG_DOC_ID), config);
}

// =====================================================================
// HOMEPAGE SEKCE
// =====================================================================

const COL_HOMEPAGE = "hive-house-homepage";

// --- defaults ---

export function newHomepageHero(): HomepageHero {
  return {
    title: "Usněte nad",
    titleAccent: "včelími úly",
    subtitle: "Glamping · Apiterapie · Příroda",
    text: "Unikátní glamping nedaleko vodní nádrže Švihov. Apiterapie, vlastní med, soukromý rybník — maximální pohodlí v srdci přírody.",
    ctaReserveLabel: "Rezervovat pobyt",
    ctaReserveHref: "/rezervace",
    ctaVoucherLabel: "Koupit poukázku",
    stat1Num: "27", stat1Label: "m² luxusního prostoru",
    stat2Num: "2",  stat2Label: "Osoby, naprosté soukromí",
    stat3Num: "∞",  stat3Label: "Klidu a přírody",
    images: [
      { url: "https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=1920&q=85&auto=format", alt: "Hive House 1" },
      { url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=1920&q=85&auto=format", alt: "Hive House 2" },
      { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=85&auto=format", alt: "Hive House 3" },
    ],
  };
}

export function newHomepageOfferings(): HomepageOfferings {
  return {
    sectionEyebrow: "Co nabízíme",
    sectionTitle: "Zážitek, který si",
    sectionTitleAccent: "zamilujete",
    sectionDesc: "Každá část Hive House má jinou atmosféru.",
    cards: [
      { id: "offer-1", sortOrder: 0, title: "Ubytování", description: "Komfortní dům pro dva.", eyebrow: "Komfort v přírodě", linkHref: "/ubytovani", ctaLabel: "Zjistit více", image: { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&auto=format" } },
      { id: "offer-2", sortOrder: 1, title: "Rybaření", description: "Soukromý rybník u objektu.", eyebrow: "Klid na vodě", linkHref: "/rybareni", ctaLabel: "Zjistit více", image: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format" } },
      { id: "offer-3", sortOrder: 2, title: "Okolí & výlety", description: "Hrad Švihov, cyklostezky.", eyebrow: "Místa kolem", linkHref: "/vylety", ctaLabel: "Zjistit více", image: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80&auto=format" } },
    ],
  };
}

export function newHomepageApitherapy(): HomepageApitherapy {
  return {
    eyebrow: "Glamping se včelami",
    title: "Apiterapie —",
    titleAccent: "léčivá síla včel",
    text1: "",
    text2: "",
    benefits: [
      { id: "b1", icon: "🫁", text: "Zlepšení dýchacích cest a astmatu" },
      { id: "b2", icon: "😴", text: "Hlubší a kvalitnější spánek" },
      { id: "b3", icon: "🧘", text: "Snížení stresu a úzkosti" },
      { id: "b4", icon: "💪", text: "Posílení imunitního systému" },
      { id: "b5", icon: "🩺", text: "Zmírnění chronických bolestí" },
      { id: "b6", icon: "🧠", text: "Lepší soustředění a mentální klid" },
    ],
    ctaPrimaryLabel: "Více o apiterapii",
    ctaPrimaryHref: "/vcelin-glamping",
    ctaSecondaryLabel: "Rezervovat pobyt",
    ctaSecondaryHref: "/rezervace",
  };
}

export function newHomepageTrustbar(): HomepageTrustbar {
  return {
    items: [
      "Apiterapie pod postelí",
      "Soukromý rybník",
      "Vlastní med",
      "Blízko nádrže Švihov",
      "Moderní technologie",
      "Naprosté soukromí",
    ],
  };
}

export function newHomepageReviewsConfig(): HomepageReviewsConfig {
  return { displayCount: 5 };
}

// --- load ---

export async function loadHomepageHero(): Promise<HomepageHero> {
  const snap = await getDoc(doc(db, COL_HOMEPAGE, "hero"));
  if (!snap.exists()) return newHomepageHero();
  const raw = snap.data() as Partial<HomepageHero>;
  const d = newHomepageHero();
  return {
    ...d,
    ...raw,
    images: Array.isArray(raw.images)
      ? (raw.images as Array<string | ManagedImage>).map((img) =>
          typeof img === "string" ? { url: img } : { url: img.url, storagePath: img.storagePath, alt: img.alt },
        )
      : d.images,
  };
}

export async function loadHomepageOfferings(): Promise<HomepageOfferings> {
  const snap = await getDoc(doc(db, COL_HOMEPAGE, "offerings"));
  if (!snap.exists()) return newHomepageOfferings();
  const raw = snap.data() as Partial<HomepageOfferings>;
  const d = newHomepageOfferings();
  return {
    ...d,
    ...raw,
    cards: Array.isArray(raw.cards)
      ? (raw.cards as Array<Partial<HomepageOfferingCard>>)
          .map((c, i) => ({
            id: c.id || `offer-${i}`,
            sortOrder: c.sortOrder ?? i,
            title: c.title || "",
            description: c.description || "",
            eyebrow: c.eyebrow || "",
            linkHref: c.linkHref || "",
            ctaLabel: c.ctaLabel || "Zjistit více",
            image: c.image,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder)
      : d.cards,
  };
}

export async function loadHomepageApitherapy(): Promise<HomepageApitherapy> {
  const snap = await getDoc(doc(db, COL_HOMEPAGE, "apitherapy"));
  if (!snap.exists()) return newHomepageApitherapy();
  const raw = snap.data() as Partial<HomepageApitherapy>;
  const d = newHomepageApitherapy();
  return {
    ...d,
    ...raw,
    benefits: Array.isArray(raw.benefits)
      ? (raw.benefits as Array<Partial<HomepageApiBenefit>>).map((b, i) => ({
          id: b.id || `b${i}`, icon: b.icon || "", text: b.text || "",
        }))
      : d.benefits,
  };
}

export async function loadHomepageTrustbar(): Promise<HomepageTrustbar> {
  const snap = await getDoc(doc(db, COL_HOMEPAGE, "trustbar"));
  if (!snap.exists()) return newHomepageTrustbar();
  const raw = snap.data() as Partial<HomepageTrustbar>;
  return {
    items: Array.isArray(raw.items) ? (raw.items as string[]).filter(Boolean) : newHomepageTrustbar().items,
  };
}

export async function loadHomepageReviewsConfig(): Promise<HomepageReviewsConfig> {
  const snap = await getDoc(doc(db, COL_HOMEPAGE, "reviews-config"));
  if (!snap.exists()) return newHomepageReviewsConfig();
  const raw = snap.data() as Partial<HomepageReviewsConfig>;
  return { displayCount: typeof raw.displayCount === "number" ? raw.displayCount : 5 };
}

// --- save ---

export async function saveHomepageHero(data: HomepageHero): Promise<void> {
  await setDoc(doc(db, COL_HOMEPAGE, "hero"), {
    ...data,
    title: data.title.trim(),
    titleAccent: data.titleAccent.trim(),
    subtitle: data.subtitle.trim(),
    text: data.text.trim(),
    images: data.images
      .filter((img) => img.url.trim())
      .map((img) => ({ url: img.url.trim(), storagePath: img.storagePath?.trim() || "", alt: img.alt?.trim() || "" })),
  });
}

export async function saveHomepageOfferings(data: HomepageOfferings): Promise<void> {
  await setDoc(doc(db, COL_HOMEPAGE, "offerings"), {
    sectionEyebrow: data.sectionEyebrow.trim(),
    sectionTitle: data.sectionTitle.trim(),
    sectionTitleAccent: data.sectionTitleAccent.trim(),
    sectionDesc: data.sectionDesc.trim(),
    cards: data.cards.map((c, i) => ({
      id: c.id || `offer-${i}`,
      sortOrder: c.sortOrder ?? i,
      title: c.title.trim(),
      description: c.description.trim(),
      eyebrow: c.eyebrow.trim(),
      linkHref: c.linkHref.trim(),
      ctaLabel: c.ctaLabel.trim() || "Zjistit více",
      ...(c.image ? { image: c.image } : {}),
    })),
  });
}

export async function saveHomepageApitherapy(data: HomepageApitherapy): Promise<void> {
  const payload: Record<string, unknown> = {
    eyebrow: data.eyebrow.trim(),
    title: data.title.trim(),
    titleAccent: data.titleAccent.trim(),
    text1: data.text1.trim(),
    text2: data.text2.trim(),
    benefits: data.benefits.map((b, i) => ({ id: b.id || `b${i}`, icon: b.icon, text: b.text.trim() })),
    ctaPrimaryLabel: data.ctaPrimaryLabel.trim(),
    ctaPrimaryHref: data.ctaPrimaryHref.trim(),
    ctaSecondaryLabel: data.ctaSecondaryLabel.trim(),
    ctaSecondaryHref: data.ctaSecondaryHref.trim(),
  };
  if (data.imageMain) payload.imageMain = data.imageMain;
  if (data.imageSmall1) payload.imageSmall1 = data.imageSmall1;
  if (data.imageSmall2) payload.imageSmall2 = data.imageSmall2;
  await setDoc(doc(db, COL_HOMEPAGE, "apitherapy"), payload);
}

export async function saveHomepageTrustbar(data: HomepageTrustbar): Promise<void> {
  await setDoc(doc(db, COL_HOMEPAGE, "trustbar"), {
    items: data.items.map((s) => s.trim()).filter(Boolean),
  });
}

export async function saveHomepageReviewsConfig(data: HomepageReviewsConfig): Promise<void> {
  await setDoc(doc(db, COL_HOMEPAGE, "reviews-config"), { displayCount: data.displayCount });
}
