import { createAdminClient } from "@/lib/supabase/admin";
import { resolveStoragePublicUrl } from "@/lib/storage/paths";

export type UploadBucket = "product-previews" | "digital-assets";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jfif",
]);
const DIGITAL_TYPES = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "image/png",
  "video/quicktime",
  "application/octet-stream",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DIGITAL_BYTES = 100 * 1024 * 1024;

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extensionFromName(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "bin") : "bin";
}

export function validateUploadFile(
  file: File,
  bucket: UploadBucket
): string | null {
  if (bucket === "product-previews") {
    if (!IMAGE_TYPES.has(file.type)) {
      return "Solo se permiten imágenes JPG, PNG, WebP o GIF";
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return "La imagen no puede superar 10 MB";
    }
    return null;
  }

  const ext = extensionFromName(file.name);
  const allowedDigital =
    DIGITAL_TYPES.has(file.type) ||
    ext === "zip" ||
    ext === "png" ||
    ext === "mov";

  if (!allowedDigital) {
    return "Formato no permitido. Usa ZIP, PNG o MOV";
  }
  if (file.size > MAX_DIGITAL_BYTES) {
    return "El archivo no puede superar 100 MB";
  }
  return null;
}

export async function uploadAdminFile(
  file: File,
  bucket: UploadBucket,
  folder: string
) {
  const validationError = validateUploadFile(file, bucket);
  if (validationError) {
    return { path: null, url: null, error: validationError };
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "");
  const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ""));
  const ext = extensionFromName(file.name);
  const path = `${safeFolder}/${baseName}-${Date.now()}.${ext}`;

  const supabase = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (error) {
    return { path: null, url: null, error: error.message };
  }

  const url =
    bucket === "product-previews"
      ? resolveStoragePublicUrl(path)
      : path;

  return {
    path,
    url,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
    error: null,
  };
}
