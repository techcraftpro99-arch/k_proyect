import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { getEffectivePrice } from "@/lib/format";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      productId: product.id,
      name: product.name,
      nameEn: product.nameEn,
      price: getEffectivePrice(product),
      thumbnailUrl: product.thumbnailUrl,
      paymentLink: product.paymentLink,
    },
  });
}
