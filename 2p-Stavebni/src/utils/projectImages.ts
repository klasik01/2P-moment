import type { Project, ProjectImage } from "../types/content";

export function normalizeProjectImages(images: ProjectImage[]) {
  const normalized = images
    .filter((image) => Boolean(image.src))
    .map((image) => ({
      ...image,
      hidden: Boolean(image.hidden),
      isPrimary: Boolean(image.isPrimary),
      useInHero: Boolean(image.useInHero),
    }));

  const visible = normalized.filter((image) => !image.hidden);
  if (visible.length === 0 && normalized[0]) {
    normalized[0] = {
      ...normalized[0],
      hidden: false,
    };
  }

  const primaryVisible = normalized.find((image) => image.isPrimary && !image.hidden);
  if (!primaryVisible) {
    const firstVisibleIndex = normalized.findIndex((image) => !image.hidden);
    if (firstVisibleIndex >= 0) {
      normalized.forEach((image, index) => {
        image.isPrimary = index === firstVisibleIndex;
      });
    }
  }

  return normalized;
}

export function getVisibleProjectImages(project: Project) {
  const visible = normalizeProjectImages(project.images).filter((image) => !image.hidden);
  const primaryIndex = visible.findIndex((image) => image.isPrimary);

  if (primaryIndex <= 0) return visible;

  const [primary] = visible.splice(primaryIndex, 1);
  return [primary, ...visible];
}

export function getPrimaryProjectImage(project: Project) {
  const visibleImages = getVisibleProjectImages(project);
  return visibleImages.find((image) => image.isPrimary) ?? visibleImages[0] ?? null;
}

export function getHeroProjectImages(projects: Project[]) {
  const normalizedProjects = projects.map((project) => ({
    ...project,
    images: normalizeProjectImages(project.images),
  }));

  return normalizedProjects
    .flatMap((project) => project.images)
    .filter((image) => !image.hidden && image.useInHero);
}
