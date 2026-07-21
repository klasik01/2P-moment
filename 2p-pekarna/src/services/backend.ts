// ============================================================
// Backend fasáda — jediný vstupní bod pro všechny backend operace.
//
// Komponenty importují POUZE z tohoto souboru:
//   import { backend } from "../services";
//   await backend.createInquiry(payload);
//
// Implementace se vybírá podle VITE_API_URL:
//   nastavené  → httpBackend  (2p-api na vm-twopmoment)
//   prázdné    → mockBackend  (lokální vývoj, ukázka pro klienta)
//
// Díky tomu se aplikace nasadí na Netlify a funguje i bez backendu.
// ============================================================

import type { BackendService } from "./contracts";
import { createHttpBackend } from "./httpBackend";
import { createMockBackend } from "./mockBackend";

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

/** True, když běžíme bez backendu — poptávka se nikam neodešle. */
export const isMockBackend = !apiUrl;

let _backend: BackendService = apiUrl
  ? createHttpBackend(apiUrl)
  : createMockBackend();

if (isMockBackend) {
  console.info(
    "[backend] Mock režim — VITE_API_URL není nastavené, poptávky se neodesílají.",
  );
}

/** Přepne implementaci — hlavně pro testy. */
export function setBackend(impl: BackendService) {
  _backend = impl;
}

/**
 * Aktuální backend — proxy objekt, aby reference zůstala stabilní
 * i po případném přepnutí implementace.
 */
export const backend: BackendService = {
  createInquiry: (...args) => _backend.createInquiry(...args),
};
