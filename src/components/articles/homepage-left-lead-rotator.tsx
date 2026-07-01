"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HomepageArticleLink } from "@/components/articles/homepage-hover-title";
import type { ArticleSummary } from "@/features/articles/types";
import { formatArticleExcerpt, hasArticleExcerpt } from "@/lib/articles/excerpt";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const ROTATE_MS = 20_000;
const FADE_MS = 520;

function articleHref(slug: string) {
  return `/maqola/${slug}`;
}

function articleTime(article: ArticleSummary) {
  return article.publishedAt ?? article.createdAt;
}

function articleHoverHint(article: ArticleSummary) {
  const category = article.categories?.[0]?.name ?? "Maqola";
  const time = articleTime(article);
  return time ? `${category} · ${formatRelativeTime(time)}` : category;
}

function pickRandomArticles(
  pool: ArticleSummary[],
  count: number,
  excludeIds: Set<string>,
): ArticleSummary[] {
  if (count <= 0 || pool.length === 0) return [];

  const unique = pool.filter(
    (article, index, items) =>
      items.findIndex((item) => item.id === article.id) === index,
  );

  let candidates = unique.filter((article) => !excludeIds.has(article.id));
  if (candidates.length < count) {
    candidates = unique;
  }

  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

type HomepageLeftLeadRotatorProps = {
  initialArticles: ArticleSummary[];
  articlePool: ArticleSummary[];
};

export function HomepageLeftLeadRotator({
  initialArticles,
  articlePool,
}: HomepageLeftLeadRotatorProps) {
  const slotCount = initialArticles.length;
  const [articles, setArticles] = useState(initialArticles);
  const [fading, setFading] = useState(false);
  const articlesRef = useRef(articles);
  const poolRef = useRef(articlePool);

  articlesRef.current = articles;
  poolRef.current = articlePool;

  const rotate = useCallback(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const next = () => {
      const exclude = new Set(articlesRef.current.map((article) => article.id));
      setArticles(
        pickRandomArticles(poolRef.current, slotCount, exclude),
      );
    };

    if (reducedMotion) {
      next();
      return;
    }

    setFading(true);
    window.setTimeout(() => {
      next();
      setFading(false);
    }, FADE_MS);
  }, [slotCount]);

  useEffect(() => {
    if (slotCount === 0 || articlePool.length <= slotCount) return;

    let intervalId = 0;

    const start = () => {
      window.clearInterval(intervalId);
      intervalId = window.setInterval(rotate, ROTATE_MS);
    };

    const stop = () => window.clearInterval(intervalId);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [articlePool.length, rotate, slotCount]);

  if (slotCount === 0) return null;

  return (
    <div
      className={cn(
        "homepage-left-lead-rotate flex flex-col gap-3 sm:gap-4 2xl:gap-5",
        fading && "homepage-left-lead-rotate--fading",
      )}
    >
      {articles.map((article, index) => (
        <HomepageArticleLink
          key={article.id}
          href={articleHref(article.slug)}
          title={article.title}
          hint={articleHoverHint(article)}
          className={cn(
            "group block min-w-0 border-border/70 py-0.5 transition-colors",
            index < articles.length - 1 && "border-b pb-3 sm:pb-4",
          )}
        >
          <p className="text-xs font-medium text-primary/85">
            {article.categories?.[0]?.name ?? "Maqola"}
          </p>
          <h2 className="mt-1 break-words text-base font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:mt-1.5 sm:text-lg lg:text-[1.05rem] lg:leading-[1.2] xl:text-[1.2rem] 2xl:mt-2 2xl:text-[1.7rem] 2xl:leading-[1.14]">
            {article.title}
          </h2>
          {hasArticleExcerpt(article.title, article.excerpt) ? (
            <p className="mt-1.5 line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:mt-2 sm:line-clamp-3 sm:text-sm sm:leading-6 2xl:text-[15px]">
              {formatArticleExcerpt(article.title, article.excerpt)}
            </p>
          ) : null}
        </HomepageArticleLink>
      ))}
    </div>
  );
}
