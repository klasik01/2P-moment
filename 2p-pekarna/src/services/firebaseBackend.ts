// ============================================================
// Firebase implementace BackendService.
// Jediné místo v aplikaci, které přímo volá Firestore SDK.
// ============================================================

import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { pekarnaConfig } from "../data/pekarna";
import type { Promotion } from "../types";
import type { BackendService } from "./contracts";

const PROMOTIONS_COLLECTION = pekarnaConfig.firestore.promotionsCollection;

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
  };
}
