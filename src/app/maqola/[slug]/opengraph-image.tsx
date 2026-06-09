import { ImageResponse } from "next/og";
import { fetchArticleBySlug } from "@/lib/articles/server";
import { buildArticleDescription } from "@/lib/seo/description";
import { resolveOgImageUrl } from "@/lib/seo/urls";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = "Maqola";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ArticleOgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleOpenGraphImage({ params }: ArticleOgImageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { meta: true });

  const authorName = article?.author?.displayName ?? "Noma'lum muallif";
  const title = article?.title ?? "Maqola";
  const description = article
    ? buildArticleDescription({
        title: article.title,
        excerpt: article.excerpt,
        categories: article.categories,
        authorName,
      })
    : siteConfig.description;
  const categoryName = article?.categories?.[0]?.name;
  const coverUrl = resolveOgImageUrl(article?.coverImageUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f172a",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {coverUrl ? (
          <div
            style={{
              width: 420,
              height: "100%",
              display: "flex",
              position: "relative",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.92) 100%)",
              }}
            />
          </div>
        ) : null}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: coverUrl ? "56px 64px 56px 48px" : "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 28,
              fontWeight: 700,
              color: "#a5b4fc",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(99,102,241,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              M
            </div>
            {siteConfig.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {categoryName ? (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(99,102,241,0.22)",
                  color: "#c7d2fe",
                  fontSize: 22,
                }}
              >
                {categoryName}
              </div>
            ) : null}
            <div
              style={{
                fontSize: coverUrl ? 46 : 54,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            <span>{authorName}</span>
            <span>{siteConfig.host}</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
