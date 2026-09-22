import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailInfo } from "@/components/shop/ProductDetailInfo";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { getEffectivePrice } from "@/lib/format";
import { getProductBySlug, getProductSlugs } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | ${storeName}`,
      description: product.shortDescription,
      images: [{ url: product.thumbnailUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.thumbnailUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const effectivePrice = getEffectivePrice(product);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.thumbnailUrl,
    brand: { "@type": "Brand", name: storeName },
    offers: {
      "@type": "Offer",
      price: effectivePrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${appUrl}/products/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductDetailInfo product={product} effectivePrice={effectivePrice} />
      </div>
    </article>
  );
}
