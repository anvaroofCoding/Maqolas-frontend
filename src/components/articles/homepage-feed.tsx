import { Eye, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  HomepageArticleLink,
  HomepageHoverTitle,
} from "@/components/articles/homepage-hover-title";
import { HomepageArticleMedia } from "@/components/articles/homepage-article-media";
import { HomepageHeroMedia } from "@/components/articles/homepage-hero-media";
import type { ArticleSummary } from "@/features/articles/types";
import { formatArticleExcerpt, hasArticleExcerpt, truncateToWords } from "@/lib/articles/excerpt";
import { htmlToPlainText } from "@/lib/articles/plain-text";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type HomepageFeedProps = {
  articles: ArticleSummary[];
  latestArticles?: ArticleSummary[];
  title: string;
  emptyMessage: string;
};

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

function articlePopularityScore(article: ArticleSummary) {
  return (
    (article.likeCount ?? 0) * 5 +
    (article.commentCount ?? 0) * 4 +
    (article.viewCount ?? 0)
  );
}

const CROWD_CHOICE_PREVIEW_WORDS = 40;

function crowdChoiceBody(article: ArticleSummary) {
  const text =
    article.previewText ??
    (article.contentHtml
      ? htmlToPlainText(article.contentHtml)
      : (article.excerpt ?? ""));

  const withoutTitle = formatArticleExcerpt(article.title, text);
  return truncateToWords(withoutTitle, CROWD_CHOICE_PREVIEW_WORDS);
}

function uniqueById(items: ArticleSummary[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function pickArticles(
  preferred: ArticleSummary[],
  fallback: ArticleSummary[],
  limit: number,
  excludedIds: string[] = [],
) {
  const excluded = new Set(excludedIds);
  return uniqueById([...preferred, ...fallback]).filter((article) => {
    if (excluded.has(article.id)) return false;
    excluded.add(article.id);
    return true;
  }).slice(0, limit);
}

export function HomepageFeed({
  articles,
  latestArticles = [],
  title,
  emptyMessage,
}: HomepageFeedProps) {
  if (articles.length === 0) {
    return (
      <section
        aria-label={title}
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      >
        <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  const hero = articles[0];
  const pool = uniqueById([...articles.slice(1), ...latestArticles]);
  const leftLead = pickArticles(articles.slice(1, 5), pool, 4);
  const centerList = pickArticles(
    articles.slice(5, 9),
    pool,
    4,
    [hero.id, ...leftLead.map((article) => article.id)],
  );
  const crowdChoiceCandidates = pickArticles(
    pool,
    articles.slice(1),
    Math.max(pool.length, 1),
    [
      hero.id,
      ...leftLead.map((article) => article.id),
      ...centerList.map((article) => article.id),
    ],
  );
  const crowdChoice =
    [...crowdChoiceCandidates].sort(
      (a, b) => articlePopularityScore(b) - articlePopularityScore(a),
    )[0] ?? null;
  const crowdChoiceText = crowdChoice ? crowdChoiceBody(crowdChoice) : "";
  const rightLatest = pickArticles(
    latestArticles.length > 0 ? latestArticles : articles.slice(1),
    articles.slice(1),
    8,
    [hero.id],
  );

  const topSectionIds = [
    hero.id,
    ...leftLead.map((article) => article.id),
    ...centerList.map((article) => article.id),
    ...(crowdChoice ? [crowdChoice.id] : []),
    ...rightLatest.map((article) => article.id),
  ];

  const urgentLead =
    pickArticles(articles.slice(2, 3), pool, 1, topSectionIds)[0] ??
    pickArticles(articles.slice(1), pool, 1, [hero.id])[0] ??
    hero;

  let urgentGrid = pickArticles(
    articles.slice(8, 12),
    pool,
    4,
    [...topSectionIds, urgentLead.id],
  );

  if (urgentGrid.length < 4) {
    const urgentExcluded = [urgentLead.id, ...urgentGrid.map((article) => article.id)];
    const remaining = uniqueById([...articles, ...latestArticles]).filter(
      (article) =>
        !urgentExcluded.includes(article.id) &&
        !topSectionIds.includes(article.id),
    );
    urgentGrid = [
      ...urgentGrid,
      ...pickArticles(remaining, pool, 4 - urgentGrid.length, urgentExcluded),
    ];
  }

  const showcase = pickArticles(articles.slice(4, 8), pool, 4, topSectionIds);
  const lowerGrid = pickArticles(
    articles.slice(8, 10),
    pool,
    2,
    [
      ...topSectionIds,
      urgentLead.id,
      ...urgentGrid.map((article) => article.id),
      ...showcase.map((article) => article.id),
    ],
  );

  return (
    <section aria-label={title} className="space-y-10">
      <div className="grid gap-5 xl:grid-cols-[minmax(240px,0.95fr)_minmax(380px,1.3fr)_minmax(240px,0.82fr)] xl:items-stretch">
        <div className="flex flex-col border-b border-border/70 pb-4 xl:h-full xl:border-b-0 xl:border-t xl:pt-4">
          <div className="flex flex-col gap-5 sm:gap-6">
            {leftLead.map((article, index) => (
              <HomepageArticleLink
                key={article.id}
                href={articleHref(article.slug)}
                title={article.title}
                hint={articleHoverHint(article)}
                className={cn(
                  "group block min-w-0 border-border/70 py-1 transition-colors",
                  index < leftLead.length - 1 && "border-b pb-5",
                )}
              >
              <p className="text-xs font-medium text-primary/85">
                {article.categories?.[0]?.name ?? "Maqola"}
              </p>
              <h2 className="mt-2 break-words text-xl font-bold leading-snug tracking-tight text-foreground group-hover:text-primary sm:text-[1.45rem] sm:leading-[1.14] xl:text-[1.7rem]">
                {article.title}
              </h2>
              {hasArticleExcerpt(article.title, article.excerpt) ? (
                <p className="mt-2.5 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:text-[15px] sm:leading-6">
                  {formatArticleExcerpt(article.title, article.excerpt)}
                </p>
              ) : null}
            </HomepageArticleLink>
            ))}
          </div>
        </div>

        <div className="flex h-full flex-col gap-4">
          <HomepageHoverTitle
            title={hero.title}
            hint={articleHoverHint(hero)}
            className="block shrink-0"
          >
            <HomepageHeroMedia
              article={hero}
              href={articleHref(hero.slug)}
              className="h-[240px] sm:h-[320px] xl:h-[360px]"
              imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </HomepageHoverTitle>

          <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-stretch">
            <div className="flex flex-col gap-3">
              {centerList.map((article) => (
                <HomepageHoverTitle
                  key={article.id}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group grid grid-cols-[60px_minmax(0,1fr)] items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-colors hover:bg-muted/30 sm:grid-cols-[68px_minmax(0,1fr)]"
                >
                  <HomepageArticleMedia
                    article={article}
                    href={articleHref(article.slug)}
                    compactDots
                    sizes="80px"
                    className="relative h-[60px] w-[60px] shrink-0 rounded-xl sm:h-[68px] sm:w-[68px]"
                    imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <Link
                    href={articleHref(article.slug)}
                    className="line-clamp-3 min-w-0 break-words text-[0.95rem] font-semibold leading-5 text-foreground group-hover:text-primary sm:text-base sm:leading-6"
                  >
                    {article.title}
                  </Link>
                </HomepageHoverTitle>
              ))}
            </div>

            {crowdChoice ? (
              <div className="flex h-full min-h-0 flex-col rounded-[1.6rem] border bg-[linear-gradient(180deg,rgba(220,238,255,0.9),rgba(240,247,255,1))] p-4 shadow-sm dark:bg-[linear-gradient(180deg,rgba(40,61,85,0.55),rgba(28,37,51,0.96))]">
                <p className="shrink-0 text-sm font-bold tracking-tight text-foreground">
                  Ko&apos;pchilik tanlovi
                </p>
                <HomepageArticleLink
                  href={articleHref(crowdChoice.slug)}
                  title={crowdChoice.title}
                  hint={articleHoverHint(crowdChoice)}
                  className="group mt-3 block space-y-2.5"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block size-2 rounded-full bg-primary" />
                    <span>{crowdChoice.categories?.[0]?.name ?? "Ommabop maqola"}</span>
                  </div>
                  <h3 className="text-[1.15rem] font-bold leading-[1.2] text-foreground group-hover:text-primary sm:text-[1.35rem]">
                    {crowdChoice.title}
                  </h3>
                  {crowdChoiceText ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {crowdChoiceText}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5" aria-label="Ko'rishlar">
                      <Eye className="size-4 shrink-0" aria-hidden />
                      <span>{formatCount(crowdChoice.viewCount ?? 0)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5" aria-label="Yoqtirishlar">
                      <Heart
                        className={cn(
                          "size-4 shrink-0",
                          (crowdChoice.likeCount ?? 0) > 0 &&
                            "fill-primary text-primary",
                        )}
                        aria-hidden
                      />
                      <span>{formatCount(crowdChoice.likeCount ?? 0)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5" aria-label="Izohlar">
                      <MessageSquare className="size-4 shrink-0" aria-hidden />
                      <span>{formatCount(crowdChoice.commentCount ?? 0)}</span>
                    </span>
                  </div>
                </HomepageArticleLink>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="flex h-full flex-col rounded-[1.6rem] border bg-card px-4 py-5 shadow-sm">
          <h2 className="shrink-0 text-[1.65rem] font-bold tracking-tight text-foreground">
            So&apos;nggi maqolalar
          </h2>
          <ul className="mt-4 flex min-h-0 flex-1 flex-col justify-between">
            {rightLatest.map((article, index) => (
              <li
                key={article.id}
                className={cn(
                  "flex min-h-0 flex-1 flex-col justify-center border-border/70 py-3",
                  index < rightLatest.length - 1 && "border-b",
                )}
              >
                <HomepageArticleLink
                  href={articleHref(article.slug)}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group block space-y-2"
                >
                  <p className="line-clamp-3 text-[0.95rem] font-medium leading-6 text-foreground group-hover:text-primary">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.categories?.[0]?.name ?? "Maqola"}</span>
                    {articleTime(article) ? (
                      <>
                        <span className="size-1 rounded-full bg-muted-foreground/50" />
                        <span>{formatRelativeTime(articleTime(article)!)}</span>
                      </>
                    ) : null}
                  </div>
                </HomepageArticleLink>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[2rem] font-bold tracking-tight text-foreground sm:text-[2.35rem]">
            Dolzarb maqolalar
          </h2>
          <span className="text-sm text-muted-foreground">Kun davomida saralangan</span>
        </div>
        <div
          className={cn(
            "grid gap-5",
            urgentGrid.length > 0 &&
              "md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-stretch",
          )}
        >
          <HomepageHoverTitle
            title={urgentLead.title}
            hint={articleHoverHint(urgentLead)}
            className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border bg-card shadow-sm"
          >
            <HomepageArticleMedia
              article={urgentLead}
              href={articleHref(urgentLead.slug)}
              sizes="(min-width: 1280px) 700px, 100vw"
              className="min-h-[230px] flex-1 sm:min-h-[300px]"
              imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <Link
              href={articleHref(urgentLead.slug)}
              className="shrink-0 space-y-3 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{urgentLead.categories?.[0]?.name ?? "Dolzarb"}</span>
                {articleTime(urgentLead) ? (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground/50" />
                    <span>{formatRelativeTime(articleTime(urgentLead)!)}</span>
                  </>
                ) : null}
              </div>
              <h3 className="text-[1.75rem] font-bold leading-tight tracking-tight text-foreground group-hover:text-primary sm:text-[2rem]">
                {urgentLead.title}
              </h3>
              {hasArticleExcerpt(urgentLead.title, urgentLead.excerpt) ? (
                <p className="line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:leading-6">
                  {formatArticleExcerpt(urgentLead.title, urgentLead.excerpt)}
                </p>
              ) : null}
            </Link>
          </HomepageHoverTitle>

          {urgentGrid.length > 0 ? (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
              {urgentGrid.map((article) => (
                <HomepageHoverTitle
                  key={article.id}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border bg-card p-3 shadow-sm transition-colors hover:bg-muted/25"
                >
                  <HomepageArticleMedia
                    article={article}
                    href={articleHref(article.slug)}
                    sizes="(min-width: 640px) 280px, 100vw"
                    className="relative min-h-[7.5rem] flex-1 rounded-[1.15rem]"
                    imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <Link
                    href={articleHref(article.slug)}
                    className="mt-3 shrink-0 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {articleTime(article) ? (
                        <span>{formatRelativeTime(articleTime(article)!)}</span>
                      ) : null}
                    </div>
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary sm:text-base">
                      {article.title}
                    </p>
                  </Link>
                </HomepageHoverTitle>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {showcase.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[2rem] font-bold tracking-tight text-foreground sm:text-[2.35rem]">
              Turli uslubdagi maqolalar
            </h2>
            <span className="text-sm text-muted-foreground">Portal ko&apos;rinishida</span>
          </div>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {showcase.map((article) => (
              <HomepageHoverTitle
                key={article.id}
                title={article.title}
                hint={articleHoverHint(article)}
                className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <HomepageArticleMedia
                  article={article}
                  href={articleHref(article.slug)}
                  sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="h-52 shrink-0"
                  imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <Link
                  href={articleHref(article.slug)}
                  className="flex flex-1 flex-col justify-between space-y-3 bg-slate-900 p-4 text-white dark:bg-slate-950"
                >
                  <p className="text-xs uppercase tracking-wide text-white/65">
                    {article.categories?.[0]?.name ?? "Saralangan"}
                  </p>
                  <p className="line-clamp-4 text-[1.05rem] font-bold leading-[1.25] sm:text-[1.2rem]">
                    {article.title}
                  </p>
                </Link>
              </HomepageHoverTitle>
            ))}
          </div>
        </div>
      ) : null}

      {lowerGrid.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {lowerGrid.map((article) => (
            <HomepageHoverTitle
              key={article.id}
              title={article.title}
              hint={articleHoverHint(article)}
              className="group flex gap-4 rounded-[1.5rem] border bg-card p-4 shadow-sm transition-colors hover:bg-muted/25"
            >
              <HomepageArticleMedia
                article={article}
                href={articleHref(article.slug)}
                compactDots
                sizes="192px"
                className="relative hidden h-36 w-48 shrink-0 rounded-[1.15rem] sm:block"
                imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <Link href={articleHref(article.slug)} className="min-w-0 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{article.categories?.[0]?.name ?? "Maqola"}</span>
                  {articleTime(article) ? (
                    <>
                      <span className="size-1 rounded-full bg-muted-foreground/50" />
                      <span>{formatRelativeTime(articleTime(article)!)}</span>
                    </>
                  ) : null}
                </div>
                <p className="line-clamp-3 text-[1.45rem] font-bold leading-tight tracking-tight text-foreground group-hover:text-primary">
                  {article.title}
                </p>
                {hasArticleExcerpt(article.title, article.excerpt) ? (
                  <p className="line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:leading-6">
                    {formatArticleExcerpt(article.title, article.excerpt)}
                  </p>
                ) : null}
              </Link>
            </HomepageHoverTitle>
          ))}
        </div>
      ) : null}
    </section>
  );
}
