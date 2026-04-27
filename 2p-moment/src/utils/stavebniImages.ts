import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";
import type { Project, ProjectImage } from "../types/stavebni";

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

// ── Image normalization ──────────────────────────────────────────────────────

export function normalizeProjectImages(images: ProjectImage[]): ProjectImage[] {
  const normalized = images
    .filter((img) => Boolean(img.src))
    .map((img) => ({
      ...img,
      hidden: Boolean(img.hidden),
      isPrimary: Boolean(img.isPrimary),
      useInHero: Boolean(img.useInHero),
    }));

  const visible = normalized.filter((img) => !img.hidden);
  if (visible.length === 0 && normalized[0]) {
    normalized[0] = { ...normalized[0], hidden: false };
  }

  const primaryVisible = normalized.find((img) => img.isPrimary && !img.hidden);
  if (!primaryVisible) {
    const firstVisibleIndex = normalized.findIndex((img) => !img.hidden);
    if (firstVisibleIndex >= 0) {
      normalized.forEach((img, i) => {
        img.isPrimary = i === firstVisibleIndex;
      });
    }
  }

  return normalized;
}

export function getVisibleProjectImages(project: Project): ProjectImage[] {
  const visible = normalizeProjectImages(project.images).filter((img) => !img.hidden);
  const primaryIndex = visible.findIndex((img) => img.isPrimary);
  if (primaryIndex <= 0) return visible;
  const [primary] = visible.splice(primaryIndex, 1);
  return [primary, ...visible];
}

export function getPrimaryProjectImage(project: Project): ProjectImage | null {
  const visible = getVisibleProjectImages(project);
  return visible.find((img) => img.isPrimary) ?? visible[0] ?? null;
}

// ── Firebase Storage operations ──────────────────────────────────────────────

export async function uploadProjectImage(file: File, projectSlug: string): Promise<ProjectImage> {
  const cleanSlug = slugify(projectSlug);
  const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `2p-stavebni/projects/${cleanSlug}/${Date.now()}-${baseName}.${extension}`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file, {
    contentType: file.type || "image/jpeg",
  });

  const src = await getDownloadURL(fileRef);

  return { src, alt: file.name.replace(/\.[^.]+$/, ""), storagePath };
}

export async function removeProjectImage(storagePath?: string) {
  if (!storagePath) return;
  try {
    await deleteObject(ref(storage, storagePath));
  } catch {
    // ignore already-deleted
  }
}

export async function removeProjectImages(images: ProjectImage[]) {
  await Promise.all(
    images
      .map((img) => img.storagePath)
      .filter((p): p is string => Boolean(p))
      .map((p) => removeProjectImage(p)),
  );
}
