import { get, onValue, ref } from "firebase/database";
import { database } from "../../../../lib/firebase";
import type { ManagedContent, SiteContent } from "../../../../types/content";
import { mergeResolvedState } from "../../merging";
import type { ContentProvider, ProjectDisplaySettings, Unsubscribe } from "../../types";
import { FIREBASE_CONTENT_PATH, FIREBASE_PROJECT_DISPLAY_PATH } from "./paths";

/**
 * Firebase Realtime Database implementation of the ContentProvider.
 *
 * This is the ONLY layer that imports from `firebase/database`. The facade
 * and every component are completely unaware of Firebase.
 */
export const firebaseContentProvider: ContentProvider = {
  async load(baseContent: SiteContent) {
    try {
      const [contentSnapshot, projectDisplaySnapshot] = await Promise.all([
        get(ref(database, FIREBASE_CONTENT_PATH)),
        get(ref(database, FIREBASE_PROJECT_DISPLAY_PATH)),
      ]);

      return mergeResolvedState(
        baseContent,
        contentSnapshot.exists() ? (contentSnapshot.val() as Partial<ManagedContent>) : null,
        projectDisplaySnapshot.exists()
          ? (projectDisplaySnapshot.val() as Partial<ProjectDisplaySettings>)
          : null,
      );
    } catch {
      return baseContent;
    }
  },

  subscribe(baseContent, onContent, onError): Unsubscribe {
    let latestContent: Partial<ManagedContent> | null = null;
    let latestProjectDisplay: Partial<ProjectDisplaySettings> | null = null;

    const emit = () => {
      onContent(mergeResolvedState(baseContent, latestContent, latestProjectDisplay));
    };

    const unsubscribeContent = onValue(
      ref(database, FIREBASE_CONTENT_PATH),
      (snapshot) => {
        latestContent = snapshot.exists() ? (snapshot.val() as Partial<ManagedContent>) : null;
        emit();
      },
      () => {
        onError?.();
      },
    );

    const unsubscribeProjectDisplay = onValue(
      ref(database, FIREBASE_PROJECT_DISPLAY_PATH),
      (snapshot) => {
        latestProjectDisplay = snapshot.exists()
          ? (snapshot.val() as Partial<ProjectDisplaySettings>)
          : null;
        emit();
      },
      () => {
        onError?.();
      },
    );

    return () => {
      unsubscribeContent();
      unsubscribeProjectDisplay();
    };
  },
};
