import type { Promotion } from "../../types/content";

/**
 * Promotions are normally overridden from the backend (Realtime Database).
 * This file is the local fallback shape – empty by default so nothing is
 * shown until the backend provides active items.
 */
export const promotions: Promotion[] = [];
