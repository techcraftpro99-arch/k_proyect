import { NextResponse } from "next/server";
import { productAdminSchema } from "@/lib/validations/product-admin.schema";
import { createProductAdmin, getAllProductsAdmin } from "@/lib/admin/products";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const products = await getAllProductsAdmin();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = productAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await createProductAdmin(parsed.data);
    if (!result.product) {
      return NextResponse.json({ error: result.error ?? "Create failed" }, { status: 500 });
    }
    return NextResponse.json({ product: result.product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
