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
import type { Promotion, FishingPermit, GiftVoucher, SurroundingPlace, RoomContent } from "../types";

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
  return snap.docs.map((d, index) => ({
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
    ...d.data(),
  }) as SurroundingPlace);
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
  };
}

// --- Room content ---
export async function loadRoomContent(): Promise<RoomContent> {
  const snap = await getDoc(doc(db, COL_ROOM, ROOM_DOC_ID));
  if (!snap.exists()) return newRoomContent();
  const data = snap.data() as Partial<RoomContent> & { images?: Array<string | RoomContent["images"][number]> };
  return {
    ...newRoomContent(),
    id: snap.id,
    ...data,
    images: Array.isArray(data.images)
      ? data.images.map((image) =>
          typeof image === "string"
            ? { url: image }
            : { url: image.url, storagePath: image.storagePath, alt: image.alt },
        )
      : [],
  } as RoomContent;
}

export async function saveRoomContent(room: RoomContent): Promise<void> {
  const { id, ...data } = room;
  await setDoc(doc(db, COL_ROOM, id), data);
}

export function newRoomContent(): RoomContent {
  return {
    id: ROOM_DOC_ID,
    title: "Pokoj Hive House",
    description: "",
    labels: [],
    images: [],
  };
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
