import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { BrandMark } from "@/lib/seo/brand-mark";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4f46e5 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <BrandMark size={72} showName />

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 960 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)" }}>
          {siteConfig.creator.name} · {siteConfig.creator.role} ·{" "}
          {siteConfig.creator.telegram}
        </div>
      </div>
    ),
    { ...size },
  );
}
