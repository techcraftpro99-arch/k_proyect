import { NextResponse } from "next/server";
import { getProductFilesAdmin } from "@/lib/admin/products";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { id } = await params;
  const files = await getProductFilesAdmin(id);
  return NextResponse.json({ files });
}
