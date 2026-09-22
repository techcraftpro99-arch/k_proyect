import { NextResponse } from "next/server";
import { uploadAdminFile, type UploadBucket } from "@/lib/admin/upload";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

const ALLOWED_BUCKETS = new Set<UploadBucket>([
  "product-previews",
  "digital-assets",
]);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket") as UploadBucket | null;
    const folder = (formData.get("folder") as string | null) ?? "products";

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: "Bucket inválido" }, { status: 400 });
    }

    const result = await uploadAdminFile(file, bucket, folder);
    if (result.error || !result.path) {
      return NextResponse.json(
        { error: result.error ?? "Error al subir archivo" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      path: result.path,
      url: result.url,
      fileName: result.fileName,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
