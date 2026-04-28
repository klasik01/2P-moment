// ============================================================
// Firebase implementace BackendService.
// Jediné místo v aplikaci, které přímo volá Firestore SDK.
// ============================================================

import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { pekarnaConfig } from "../data/pekarna";
import type { Promotion } from "../types";
import type { BackendService, AppSettings } from "./contracts";

const PROMOTIONS_COLLECTION = "2p-pekarna-promotions";

const cfg = pekarnaConfig.firestore;

const DEFAULTS_SETTINGS: AppSettings = {
  activeProfiles: ["VE_VYSTAVBE"],
};

export function createFirebaseBackend(): BackendService {
  return {
    // ---- Promotions ----

    subscribePromotions(onData, onError): Unsubscribe {
      return onSnapshot(
        collection(db, PROMOTIONS_COLLECTION),
        (snapshot) => {
          const promos = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Promotion,
          );
          onData(promos);
        },
        () => onError?.(),
      );
    },

    async savePromotion(promo) {
      const { id, ...data } = promo;
      await setDoc(doc(db, PROMOTIONS_COLLECTION, id), data);
    },

    async deletePromotion(id) {
      await deleteDoc(doc(db, PROMOTIONS_COLLECTION, id));
    },

    // ---- App Settings ----

    async fetchAppSettings(): Promise<AppSettings> {
      try {
        const snap = await getDoc(doc(db, cfg.settingsCollection, cfg.settingsDoc));
        if (snap.exists()) {
          const data = snap.data() as Partial<AppSettings>;
          return {
            activeProfiles: data.activeProfiles ?? DEFAULTS_SETTINGS.activeProfiles,
          };
        }
        return DEFAULTS_SETTINGS;
      } catch (err) {
        console.warn("[FirebaseBackend] fetchAppSettings failed, using defaults:", err);
        return DEFAULTS_SETTINGS;
      }
    },

    async saveAppSettings(settings) {
      await setDoc(
        doc(db, cfg.settingsCollection, cfg.settingsDoc),
        settings,
        { merge: true },
      );
    },

    // ---- Email Subscriptions ----

    async createSubscription(entry): Promise<string> {
      const docRef = await addDoc(
        collection(db, cfg.subscriptionsCollection),
        {
          email: entry.email.trim().toLowerCase(),
          source: entry.source,
          createdAt: serverTimestamp(),
        },
      );
      return docRef.id;
    },
  };
}
