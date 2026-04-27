import type { SiteContent } from "../../types/content";
import { firebaseContentProvider } from "./providers/firebase";
import type { ContentProvider, Unsubscribe } from "./types";

/**
 * Active content provider. Swap this for a different backend (REST, mock…)
 * without touching any component or the facade consumers.
 */
let activeProvider: ContentProvider = firebaseContentProvider;

/** Test / wiring hook: replace the provider at runtime. */
export function setContentProvider(provider: ContentProvider) {
  activeProvider = provider;
}

/**
 * Content facade – the only content API components are allowed to touch.
 * It intentionally mirrors ContentProvider and keeps the signatures stable
 * for callers.
 */
export const contentFacade = {
  load(baseContent: SiteContent): Promise<SiteContent> {
    return activeProvider.load(baseContent);
  },

  subscribe(
    baseContent: SiteContent,
    onContent: (content: SiteContent) => void,
    onError?: () => void,
  ): Unsubscribe {
    return activeProvider.subscribe(baseContent, onContent, onError);
  },
};
