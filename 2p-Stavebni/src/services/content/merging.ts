import type { ManagedContent, Project, SiteContent } from "../../types/content";
import type { ProjectDisplaySettings } from "./types";

/**
 * Pure merging logic – no backend dependency.
 * Every ContentProvider uses it to turn raw snapshots (content + project
 * display settings) into a resolved SiteContent.
 */

export function mergeManagedContent(
  baseContent: SiteContent,
  parsed: Partial<ManagedContent>,
): SiteContent {
  return {
    ...baseContent,
    projects: {
      ...baseContent.projects,
      items: Array.isArray(parsed.projects) ? parsed.projects : baseContent.projects.items,
    },
    promotions: {
      items: Array.isArray(parsed.promotions) ? parsed.promotions : [],
    },
    contact: {
      ...baseContent.contact,
      team: Array.isArray(parsed.team) ? parsed.team : [],
    },
  };
}

export function applyProjectDisplaySettings(
  projects: Project[],
  settings?: Partial<ProjectDisplaySettings>,
): Project[] {
  const order = Array.isArray(settings?.order) ? settings.order : [];
  const visibility = settings?.visibility ?? {};
  const projectMap = new Map(projects.map((project) => [project.slug, project]));

  const orderedProjects = order
    .map((slug) => projectMap.get(slug))
    .filter((project): project is Project => Boolean(project));

  const remainingProjects = projects.filter((project) => !order.includes(project.slug));
  const resolvedProjects = [...orderedProjects, ...remainingProjects];

  return resolvedProjects.map((project) => ({
    ...project,
    hidden:
      typeof visibility[project.slug] === "boolean"
        ? !visibility[project.slug]
        : Boolean(project.hidden),
  }));
}

export function mergeResolvedState(
  baseContent: SiteContent,
  contentSnapshot: Partial<ManagedContent> | null,
  projectDisplaySnapshot?: Partial<ProjectDisplaySettings> | null,
): SiteContent {
  const mergedContent = contentSnapshot
    ? mergeManagedContent(baseContent, contentSnapshot)
    : baseContent;

  return {
    ...mergedContent,
    projects: {
      ...mergedContent.projects,
      items: applyProjectDisplaySettings(
        mergedContent.projects.items,
        projectDisplaySnapshot ?? undefined,
      ),
    },
  };
}
