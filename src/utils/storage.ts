import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";
import type { ManagedImage } from "../types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

export async function uploadHiveHouseImage(file: File, folder: string): Promise<ManagedImage> {
  const cleanFolder = slugify(folder);
  const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `2p-hive-house/${cleanFolder}/${Date.now()}-${baseName}.${extension}`;
  const fileRef = ref(storage, storagePath);

  await uploadBytes(fileRef, file, {
    contentType: file.type || "image/jpeg",
  });

  const url = await getDownloadURL(fileRef);

  return {
    url,
    storagePath,
    alt: file.name.replace(/\.[^.]+$/, ""),
  };
}

export async function removeHiveHouseImage(storagePath?: string) {
  if (!storagePath) return;
  await deleteObject(ref(storage, storagePath));
}
