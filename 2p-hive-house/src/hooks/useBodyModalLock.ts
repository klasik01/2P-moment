// Ponecháno pro zpětnou kompatibilitu. Nová logika je v `./useModalOpen`
// (stejný body-lock + Escape). Tato re-exportní fasáda bude v příštím
// úklidu smazána.
export { useModalOpen as useBodyModalLock } from "./useModalOpen";
