// ============================================================
// Backend fasáda — jediný vstupní bod pro všechny backend operace.
//
// Komponenty importují POUZE z tohoto souboru:
//   import { backend } from "../services/backend";
//   backend.fetchAppSettings();
//
// Provider se nastavuje jednou (v main.tsx nebo App.tsx).
// Výchozí implementace je Firebase (viz firebaseBackend.ts).
// Pro výměnu za jinou implementaci stačí zavolat setBackend().
// ============================================================

import type { BackendService } from "./contracts";
import { createFirebaseBackend } from "./firebaseBackend";

// Výchozí implementace = Firebase
let _backend: BackendService = createFirebaseBackend();

/**
 * Přepne backend implementaci.
 * Volat jednou při startu aplikace, pokud nechceme Firebase.
 */
export function setBackend(impl: BackendService) {
  _backend = impl;
}

/**
 * Vrátí aktuální backend — proxy objekt, aby reference zůstala stabilní
 * i po případném přepnutí implementace.
 */
export const backend: BackendService = {
  subscribePromotions: (...args) => _backend.subscribePromotions(...args),
  savePromotion: (...args) => _backend.savePromotion(...args),
  deletePromotion: (...args) => _backend.deletePromotion(...args),
  fetchAppSettings: (...args) => _backend.fetchAppSettings(...args),
  saveAppSettings: (...args) => _backend.saveAppSettings(...args),
  createSubscription: (...args) => _backend.createSubscription(...args),
};
