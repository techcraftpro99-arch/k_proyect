import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  getStoreSettings,
  updateStoreBrandImage,
} from "@/lib/store-settings";

const patchSchema = z.object({
  brandImagePath: z.string().trim().max(500).nullable(),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const settings = await getStoreSettings();
  return NextResponse.json({
    brandImagePath: settings.brandImagePath,
    brandImageUrl: settings.brandImageUrl,
  });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { error } = await updateStoreBrandImage(parsed.data.brandImagePath);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/admin/settings");

    const settings = await getStoreSettings();
    return NextResponse.json({
      brandImagePath: settings.brandImagePath,
      brandImageUrl: settings.brandImageUrl,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
