import type { ManagedContent, Project, SiteContent } from "../../types/content";

/**
 * Settings that control how projects are displayed (order & visibility).
 * Mirrors the shape the back-office writes into storage.
 */
export type ProjectDisplaySettings = {
  order?: string[];
  visibility?: Record<string, boolean>;
};

export type Unsubscribe = () => void;

/**
 * Generic read-only contract every content backend must fulfill.
 *
 * The public site consumes data through the facade; the facade delegates to
 * the currently active provider (Firebase today, REST / mock tomorrow).
 */
export interface ContentProvider {
  /** One-shot fetch – useful for SSR or initial paint. */
  load(baseContent: SiteContent): Promise<SiteContent>;

  /** Live subscription that keeps the UI in sync with the backend. */
  subscribe(
    baseContent: SiteContent,
    onContent: (content: SiteContent) => void,
    onError?: () => void,
  ): Unsubscribe;
}

// Re-exported so consumers of the facade can work with the raw shape if needed.
export type { ManagedContent, Project, SiteContent };
