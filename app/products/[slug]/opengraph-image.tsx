import { ImageResponse } from "next/og";

export const alt = "Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "DesignStore";
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef4ff, #f3e8ff, #eef4ff)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#64748b",
            marginBottom: 16,
          }}
        >
          {storeName}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#0f172a",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
