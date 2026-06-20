import { siteConfig } from "@/config/site";

type BrandMarkProps = {
  size: number;
  showName?: boolean;
};

/** Google favicon va OG rasmlar uchun brend belgisi (ImageResponse) */
export function BrandMark({ size, showName = false }: BrandMarkProps) {
  const markSize = showName ? Math.round(size * 0.28) : size;
  const fontSize = Math.round(markSize * 0.52);
  const borderRadius = Math.round(markSize * 0.22);
  const nameSize = Math.round(size * 0.18);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: showName ? Math.round(size * 0.06) : 0,
      }}
    >
      <div
        style={{
          width: markSize,
          height: markSize,
          borderRadius,
          background: "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        M
      </div>
      {showName ? (
        <span
          style={{
            fontSize: nameSize,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </div>
  );
}
