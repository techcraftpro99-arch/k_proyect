import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/delivery/send-digital-goods";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    const resource = body.resource;

    if (eventType === "CHECKOUT.ORDER.APPROVED" || eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const referenceId =
        resource?.purchase_units?.[0]?.reference_id ??
        resource?.supplementary_data?.related_ids?.order_id;

      if (referenceId) {
        await markOrderPaid(referenceId, resource?.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
