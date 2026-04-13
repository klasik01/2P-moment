import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Promotion, FishingPermit, GiftVoucher } from "../types";

const COL_PROMOTIONS = "hive-house-promotions";
const COL_PERMITS    = "hive-house-permits";
const COL_VOUCHERS   = "hive-house-vouchers";

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
