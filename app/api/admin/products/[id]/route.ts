import { NextResponse } from "next/server";
import { productAdminSchema } from "@/lib/validations/product-admin.schema";
import { deleteProductAdmin, updateProductAdmin } from "@/lib/admin/products";
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
    const parsed = productAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await updateProductAdmin(id, parsed.data);
    if (!result.product) {
      return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ product: result.product });
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
  const result = await deleteProductAdmin(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Delete failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
