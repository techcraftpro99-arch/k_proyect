import { NextResponse } from "next/server";
import {
  createCategoryAdmin,
  getCategoriesAdmin,
} from "@/lib/admin/categories";
import { categoryAdminSchema } from "@/lib/validations/category-admin.schema";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const categories = await getCategoriesAdmin();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = categoryAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await createCategoryAdmin(parsed.data);
    if (!result.category) {
      return NextResponse.json(
        { error: result.error ?? "Create failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category: result.category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
