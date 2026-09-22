import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/delivery/send-digital-goods";
import { approveOrderSchema } from "@/lib/validations/checkout.schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = approveOrderSchema.safeParse({ orderId: id });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const result = await markOrderPaid(id, "admin-approved");

    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Approval failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: id });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
