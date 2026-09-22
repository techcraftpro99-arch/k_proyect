import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    const { data: downloadToken, error } = await supabase
      .from("download_tokens")
      .select("*, product_files(storage_path, file_name)")
      .eq("token", token)
      .single();

    if (error || !downloadToken) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    if (new Date(downloadToken.expires_at) < new Date()) {
      return NextResponse.json({ error: "Download link expired" }, { status: 410 });
    }

    const file = downloadToken.product_files as {
      storage_path: string;
      file_name: string;
    };

    const { data: signed, error: signError } = await supabase.storage
      .from("digital-assets")
      .createSignedUrl(file.storage_path, 3600);

    if (signError || !signed?.signedUrl) {
      return NextResponse.json({ error: "Could not generate download" }, { status: 500 });
    }

    await supabase
      .from("download_tokens")
      .update({ downloaded_at: new Date().toISOString() })
      .eq("token", token);

    return NextResponse.redirect(signed.signedUrl);
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
