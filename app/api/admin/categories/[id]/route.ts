import { NextResponse } from "next/server";
import {
  deleteCategoryAdmin,
  updateCategoryAdmin,
} from "@/lib/admin/categories";
import { categoryAdminSchema } from "@/lib/validations/category-admin.schema";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = categoryAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await updateCategoryAdmin(id, parsed.data);
    if (!result.category) {
      return NextResponse.json(
        { error: result.error ?? "Update failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({ category: result.category });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { id } = await params;
  const result = await deleteCategoryAdmin(id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Delete failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
