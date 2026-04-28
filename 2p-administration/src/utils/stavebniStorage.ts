import { get, onValue, ref, set, type Unsubscribe } from "firebase/database";
import { database } from "../lib/firebase";
import type { Project, StavebniManagedContent } from "../types/stavebni";

export const FIREBASE_STAVEBNI_CONTENT_PATH = "p-stavebni/content";
export const FIREBASE_STAVEBNI_PROJECT_DISPLAY_PATH = "p-stavebni/project-display";

type ProjectDisplaySettings = {
  order?: string[];
  visibility?: Record<string, boolean>;
};

export function buildProjectDisplaySettings(projects: Project[]): ProjectDisplaySettings {
  return {
    order: projects.map((p) => p.slug),
    visibility: Object.fromEntries(projects.map((p) => [p.slug, !p.hidden])),
  };
}

function applyProjectDisplaySettings(
  projects: Project[],
  settings?: Partial<ProjectDisplaySettings>,
): Project[] {
  const order = Array.isArray(settings?.order) ? settings.order : [];
  const visibility = settings?.visibility ?? {};
  const projectMap = new Map(projects.map((p) => [p.slug, p]));

  const orderedProjects = order
    .map((slug) => projectMap.get(slug))
    .filter((p): p is Project => Boolean(p));

  const remainingProjects = projects.filter((p) => !order.includes(p.slug));
  const resolvedProjects = [...orderedProjects, ...remainingProjects];

  return resolvedProjects.map((p) => ({
    ...p,
    hidden:
      typeof visibility[p.slug] === "boolean" ? !visibility[p.slug] : Boolean(p.hidden),
  }));
}

function stripProjectDisplayState(projects: Project[]): Project[] {
  return projects.map(({ hidden: _hidden, ...rest }) => rest as Project);
}

export async function loadStavebniContentFromFirebase(): Promise<StavebniManagedContent> {
  try {
    const [contentSnap, displaySnap] = await Promise.all([
      get(ref(database, FIREBASE_STAVEBNI_CONTENT_PATH)),
      get(ref(database, FIREBASE_STAVEBNI_PROJECT_DISPLAY_PATH)),
    ]);

    const raw = contentSnap.exists()
      ? (contentSnap.val() as Partial<StavebniManagedContent>)
      : {};

    const displaySettings = displaySnap.exists()
      ? (displaySnap.val() as Partial<ProjectDisplaySettings>)
      : undefined;

    const projects = applyProjectDisplaySettings(
      Array.isArray(raw.projects) ? raw.projects : [],
      displaySettings,
    );

    return {
      projects,
      promotions: Array.isArray(raw.promotions) ? raw.promotions : [],
      team: Array.isArray(raw.team) ? raw.team : [],
    };
  } catch {
    return { projects: [], promotions: [], team: [] };
  }
}

export async function saveStavebniContentToFirebase(content: StavebniManagedContent) {
  await set(ref(database, FIREBASE_STAVEBNI_CONTENT_PATH), {
    ...content,
    projects: stripProjectDisplayState(content.projects),
  });
}

export async function saveStavebniProjectDisplayToFirebase(projects: Project[]) {
  await set(
    ref(database, FIREBASE_STAVEBNI_PROJECT_DISPLAY_PATH),
    buildProjectDisplaySettings(projects),
  );
}

export function subscribeStavebniContent(
  onContent: (content: StavebniManagedContent) => void,
  onError?: () => void,
): Unsubscribe {
  let latestRaw: Partial<StavebniManagedContent> | null = null;
  let latestDisplay: Partial<ProjectDisplaySettings> | null = null;

  const emit = () => {
    const projects = applyProjectDisplaySettings(
      Array.isArray(latestRaw?.projects) ? latestRaw!.projects : [],
      latestDisplay ?? undefined,
    );
    onContent({
      projects,
      promotions: Array.isArray(latestRaw?.promotions) ? latestRaw!.promotions! : [],
      team: Array.isArray(latestRaw?.team) ? latestRaw!.team! : [],
    });
  };

  const unsubContent = onValue(
    ref(database, FIREBASE_STAVEBNI_CONTENT_PATH),
    (snap) => {
      latestRaw = snap.exists() ? (snap.val() as Partial<StavebniManagedContent>) : null;
      emit();
    },
    () => onError?.(),
  );

  const unsubDisplay = onValue(
    ref(database, FIREBASE_STAVEBNI_PROJECT_DISPLAY_PATH),
    (snap) => {
      latestDisplay = snap.exists() ? (snap.val() as Partial<ProjectDisplaySettings>) : null;
      emit();
    },
    () => onError?.(),
  );

  return () => {
    unsubContent();
    unsubDisplay();
  };
}
