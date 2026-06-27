import { Eye, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  HomepageArticleLink,
  HomepageHoverTitle,
} from "@/components/articles/homepage-hover-title";
import { HomepageArticleMedia } from "@/components/articles/homepage-article-media";
import { HomepageHeroMedia } from "@/components/articles/homepage-hero-media";
import type { ArticleSummary, HomepageLayout } from "@/features/articles/types";
import { isHomepageLayoutEmpty } from "@/lib/articles/homepage-layout";
import { getPrimaryArticleImageUrl } from "@/lib/articles/images";
import { formatArticleExcerpt, hasArticleExcerpt, truncateToWords } from "@/lib/articles/excerpt";
import { htmlToPlainText } from "@/lib/articles/plain-text";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type HomepageFeedProps = {
  layout: HomepageLayout;
  algorithm?: "popular" | "forYou";
  /** So'nggi maqolalar ustuni — alohida newest feed */
  latestArticles?: ArticleSummary[];
  /** Bo'sh qolsa, feed dan zaxira */
  fallbackArticles?: ArticleSummary[];
  title: string;
  emptyMessage: string;
};

function uniqueArticlesById(items: ArticleSummary[]): ArticleSummary[] {
  const seen = new Set<string>();
  return items.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });
}

function pickLatestForSidebar(
  layoutLatest: ArticleSummary[],
  latestArticles: ArticleSummary[] | undefined,
  fallbackArticles: ArticleSummary[] | undefined,
): ArticleSummary[] {
  const pool = uniqueArticlesById([
    ...(latestArticles ?? []),
    ...layoutLatest,
    ...(fallbackArticles ?? []),
  ]);

  return pool.slice(0, 8);
}

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

function HomepageCompactCardMobileMeta({
  article,
}: {
  article: ArticleSummary;
}) {
  const time = articleTime(article);
  const hasLikes = (article.likeCount ?? 0) > 0;

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-0.5 text-[0.7rem] leading-none text-muted-foreground md:hidden">
      <span className="inline-flex items-center gap-1" aria-label="Ko'rishlar">
        <Eye className="size-3 shrink-0" aria-hidden />
        <span>{formatCount(article.viewCount ?? 0)}</span>
      </span>
      <span className="inline-flex items-center gap-1" aria-label="Yoqtirishlar">
        <Heart
          className={cn(
            "size-3 shrink-0",
            hasLikes ? "fill-primary text-primary" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <span>{formatCount(article.likeCount ?? 0)}</span>
      </span>
      <span className="inline-flex items-center gap-1" aria-label="Izohlar">
        <MessageSquare className="size-3 shrink-0" aria-hidden />
        <span>{formatCount(article.commentCount ?? 0)}</span>
      </span>
      {time ? (
        <>
          <span className="size-1 rounded-full bg-muted-foreground/50" aria-hidden />
          <span>{formatRelativeTime(time)}</span>
        </>
      ) : null}
    </div>
  );
}

const CROWD_CHOICE_PREVIEW_WORDS = 40;
const CENTER_CARD_COUNT = 5;
const URGENT_GRID_COUNT = 4;
const SHOWCASE_COUNT = 4;

function hasCoverImage(article: ArticleSummary) {
  return Boolean(getPrimaryArticleImageUrl(article));
}

function supplementCoverSection(
  section: ArticleSummary[],
  pool: ArticleSummary[],
  count: number,
  excludeIds: Set<string> = new Set(),
): ArticleSummary[] {
  if (section.length >= count) return section;

  const picked = [...section];
  const pickedIds = new Set(picked.map((article) => article.id));

  const tryPick = (allowReuse: boolean) => {
    for (const article of pool) {
      if (picked.length >= count) break;
      if (!hasCoverImage(article)) continue;
      if (excludeIds.has(article.id)) continue;
      if (!allowReuse && pickedIds.has(article.id)) continue;
      if (allowReuse && picked.some((item) => item.id === article.id)) continue;

      picked.push(article);
      pickedIds.add(article.id);
    }
  };

  tryPick(false);
  tryPick(true);

  return picked.slice(0, count);
}

function crowdChoiceBody(article: ArticleSummary) {
  const text =
    article.previewText ??
    (article.contentHtml
      ? htmlToPlainText(article.contentHtml)
      : (article.excerpt ?? ""));

  const withoutTitle = formatArticleExcerpt(article.title, text);
  return truncateToWords(withoutTitle, CROWD_CHOICE_PREVIEW_WORDS);
}

export function HomepageFeed({
  layout,
  latestArticles,
  fallbackArticles,
  title,
  emptyMessage,
}: HomepageFeedProps) {
  if (isHomepageLayoutEmpty(layout)) {
    return (
      <section
        aria-label={title}
        className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      >
        <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  const {
    hero,
    leftLead,
    centerList,
    centerFill,
    editorChoice: crowdChoice,
    latest: layoutLatest,
    urgentLead,
    urgentGrid: layoutUrgentGrid,
    showcase: layoutShowcase,
    lowerGrid,
  } = layout;

  const coverPool = uniqueArticlesById([
    ...(fallbackArticles ?? []),
    ...(latestArticles ?? []),
    ...layoutLatest,
  ]);
  const urgentExcludeIds = new Set(
    urgentLead ? [urgentLead.id] : [],
  );
  const urgentGrid = supplementCoverSection(
    layoutUrgentGrid,
    coverPool,
    URGENT_GRID_COUNT,
    urgentExcludeIds,
  );
  const showcase = supplementCoverSection(
    layoutShowcase,
    coverPool,
    SHOWCASE_COUNT,
  );

  const crowdChoiceText = crowdChoice ? crowdChoiceBody(crowdChoice) : "";
  const centerArticles = uniqueArticlesById([
    ...centerList,
    ...centerFill,
  ]).slice(0, CENTER_CARD_COUNT);
  const rightLatest = pickLatestForSidebar(
    layoutLatest,
    latestArticles,
    fallbackArticles,
  );

  return (
    <section aria-label={title} className="space-y-5 md:space-y-6 2xl:space-y-10">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(200px,0.34fr)] 2xl:grid-cols-[minmax(200px,0.95fr)_minmax(0,1.3fr)_minmax(200px,0.82fr)] 2xl:items-stretch 2xl:gap-5">
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-3.5 lg:col-span-1 xl:gap-4 2xl:contents 2xl:gap-5">
        <div className="flex min-w-0 flex-col border-b border-border/70 pb-3 sm:pb-4 lg:border-b-0 lg:border-r lg:border-border/70 lg:pb-0 lg:pr-3 xl:pr-4 2xl:col-start-1 2xl:h-full 2xl:border-r-0 2xl:border-t 2xl:pt-4 2xl:pr-0">
          <div className="flex flex-col gap-3 sm:gap-4 2xl:gap-5">
            {leftLead.map((article, index) => (
              <HomepageArticleLink
                key={article.id}
                href={articleHref(article.slug)}
                title={article.title}
                hint={articleHoverHint(article)}
                className={cn(
                  "group block min-w-0 border-border/70 py-0.5 transition-colors",
                  index < leftLead.length - 1 && "border-b pb-3 sm:pb-4",
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
        </div>

        <div className="flex min-w-0 flex-col gap-2.5 sm:gap-3 2xl:col-start-2 2xl:h-full 2xl:gap-4">
          {hero ? (
            <HomepageHoverTitle
              title={hero.title}
              hint={articleHoverHint(hero)}
              className="block w-full min-w-0 shrink-0"
            >
              <HomepageHeroMedia
                article={hero}
                href={articleHref(hero.slug)}
                className="relative aspect-[16/10] h-auto w-full max-h-[200px] sm:max-h-[240px] lg:max-h-[210px] xl:max-h-[250px] 2xl:aspect-auto 2xl:h-[360px] 2xl:max-h-none"
                imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </HomepageHoverTitle>
          ) : null}

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2 md:items-stretch lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5">
              {centerArticles.map((article) => (
                <HomepageHoverTitle
                  key={article.id}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group grid min-w-0 w-full grid-cols-[48px_minmax(0,1fr)] items-start gap-2 rounded-2xl border bg-card p-2.5 shadow-sm transition-colors hover:bg-muted/30 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-2.5 md:grid-cols-[52px_minmax(0,1fr)] 2xl:grid-cols-[68px_minmax(0,1fr)] 2xl:gap-3 2xl:p-3"
                >
                  <HomepageArticleMedia
                    article={article}
                    href={articleHref(article.slug)}
                    compactDots
                    sizes="80px"
                    className="relative h-[48px] w-[48px] shrink-0 rounded-xl sm:h-[56px] sm:w-[56px] 2xl:h-[68px] 2xl:w-[68px]"
                    imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <Link
                    href={articleHref(article.slug)}
                    className="flex min-w-0 flex-col"
                  >
                    <span className="break-words text-[0.8rem] font-semibold leading-[1.35] text-foreground [overflow-wrap:anywhere] group-hover:text-primary sm:text-[0.85rem] sm:leading-5 md:line-clamp-4 2xl:line-clamp-3 2xl:text-base 2xl:leading-6">
                      {article.title}
                    </span>
                    <HomepageCompactCardMobileMeta article={article} />
                  </Link>
                </HomepageHoverTitle>
              ))}
            </div>

            {crowdChoice ? (
              <div className="flex h-full min-h-0 min-w-0 flex-col rounded-card-xl border bg-[linear-gradient(180deg,rgba(220,238,255,0.9),rgba(240,247,255,1))] p-3 shadow-sm dark:bg-[linear-gradient(180deg,rgba(40,61,85,0.55),rgba(28,37,51,0.96))] sm:p-4">
                <p className="shrink-0 text-xs font-bold tracking-tight text-foreground sm:text-sm">
                  Ko&apos;pchilik tanlovi
                </p>
                <HomepageArticleLink
                  href={articleHref(crowdChoice.slug)}
                  title={crowdChoice.title}
                  hint={articleHoverHint(crowdChoice)}
                  className="group mt-2 block space-y-2 sm:mt-3 sm:space-y-2.5"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block size-2 shrink-0 rounded-full bg-primary" />
                    <span className="truncate">{crowdChoice.categories?.[0]?.name ?? "Ommabop maqola"}</span>
                  </div>
                  <h3 className="break-words text-sm font-bold leading-[1.25] text-foreground [overflow-wrap:anywhere] group-hover:text-primary sm:text-base md:text-[1.15rem] 2xl:text-[1.35rem] 2xl:leading-[1.2]">
                    {crowdChoice.title}
                  </h3>
                  {crowdChoiceText ? (
                    <p className="line-clamp-4 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere] sm:text-sm sm:leading-6 md:line-clamp-5 2xl:line-clamp-none">
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
        </div>

        <aside className="flex min-w-0 flex-col rounded-card-md border bg-card px-3 py-3 shadow-sm sm:rounded-card-xl sm:px-4 sm:py-4 lg:col-span-full xl:sticky xl:top-4 xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:self-start 2xl:top-6 2xl:col-start-3 2xl:row-span-1 2xl:px-4 2xl:py-5 2xl:h-full">
          <h2 className="shrink-0 text-base font-bold tracking-tight text-foreground sm:text-lg 2xl:text-[1.65rem]">
            So&apos;nggi maqolalar
          </h2>
          {rightLatest.length > 0 ? (
          <ul className="mt-2 grid min-h-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-2 lg:gap-3 xl:flex xl:flex-col xl:gap-0 xl:divide-y xl:divide-border/70 sm:mt-3 2xl:mt-4 2xl:flex-1 2xl:justify-between 2xl:divide-y-0">
            {rightLatest.map((article, index) => (
              <li
                key={article.id}
                className={cn(
                  "min-w-0 rounded-xl border border-border/50 px-2.5 py-2 sm:px-3 sm:py-2.5 xl:rounded-none xl:border-0 xl:px-0 xl:py-2 2xl:py-3",
                  index < rightLatest.length - 1 && "2xl:border-b 2xl:border-border/70",
                )}
              >
                <HomepageArticleLink
                  href={articleHref(article.slug)}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group block min-w-0 space-y-1.5 sm:space-y-2"
                >
                  <p className="line-clamp-2 break-words text-xs font-medium leading-5 text-foreground [overflow-wrap:anywhere] group-hover:text-primary sm:line-clamp-3 sm:text-sm 2xl:text-[0.95rem] 2xl:leading-6">
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
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Hozircha yangi maqolalar yo&apos;q.
            </p>
          )}
        </aside>
      </div>

      {urgentLead ? (
      <div className="space-y-4 sm:space-y-5">
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-[2rem] xl:text-[2.35rem]">
          Dolzarb maqolalar
        </h2>
        <div
          className={cn(
            "grid gap-4 sm:gap-5",
            urgentGrid.length > 0 &&
              "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:items-stretch",
          )}
        >
          <HomepageHoverTitle
            title={urgentLead.title}
            hint={articleHoverHint(urgentLead)}
            className="group flex min-w-0 flex-col overflow-hidden rounded-card-md border bg-card shadow-sm sm:rounded-card-xl"
          >
            <HomepageArticleMedia
              article={urgentLead}
              href={articleHref(urgentLead.slug)}
              sizes="(min-width: 1280px) 700px, 100vw"
              className="min-h-[180px] shrink-0 sm:min-h-[220px] md:min-h-[260px] xl:min-h-[300px]"
              imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <Link
              href={articleHref(urgentLead.slug)}
              className="shrink-0 space-y-1.5 p-3 sm:space-y-2 sm:p-4 xl:space-y-3 xl:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{urgentLead.categories?.[0]?.name ?? "Dolzarb"}</span>
                {articleTime(urgentLead) ? (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground/50" />
                    <span>{formatRelativeTime(articleTime(urgentLead)!)}</span>
                  </>
                ) : null}
              </div>
              <h3 className="break-words text-base font-bold leading-snug tracking-tight text-foreground [overflow-wrap:anywhere] group-hover:text-primary sm:text-lg md:text-xl xl:text-[1.75rem] xl:leading-tight 2xl:text-[2rem]">
                {urgentLead.title}
              </h3>
              {hasArticleExcerpt(urgentLead.title, urgentLead.excerpt) ? (
                <p className="line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:line-clamp-3 sm:text-sm sm:leading-6">
                  {formatArticleExcerpt(urgentLead.title, urgentLead.excerpt)}
                </p>
              ) : null}
            </Link>
          </HomepageHoverTitle>

          {urgentGrid.length > 0 ? (
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-3.5 xl:grid-cols-2 xl:grid-rows-2 xl:gap-4">
              {urgentGrid.map((article) => (
                <HomepageHoverTitle
                  key={article.id}
                  title={article.title}
                  hint={articleHoverHint(article)}
                  className="group grid min-w-0 grid-cols-[88px_minmax(0,1fr)] items-start gap-2.5 overflow-hidden rounded-card-md border bg-card p-2.5 shadow-sm transition-colors hover:bg-muted/25 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-3 sm:p-3 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:gap-0 xl:rounded-card-lg xl:p-2.5"
                >
                  <HomepageArticleMedia
                    article={article}
                    href={articleHref(article.slug)}
                    compactDots
                    sizes="(min-width: 1280px) 280px, 208px"
                    className="relative h-[88px] w-full shrink-0 overflow-hidden rounded-xl sm:h-[104px] xl:min-h-[7.5rem] xl:flex-1 xl:rounded-card-sm"
                    imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <Link
                    href={articleHref(article.slug)}
                    className="min-w-0 space-y-1 xl:mt-3 xl:space-y-2"
                  >
                    <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground sm:text-xs">
                      {articleTime(article) ? (
                        <span>{formatRelativeTime(articleTime(article)!)}</span>
                      ) : null}
                    </div>
                    <p className="line-clamp-3 break-words text-sm font-bold leading-snug text-foreground [overflow-wrap:anywhere] group-hover:text-primary sm:text-[0.95rem] xl:line-clamp-2 xl:text-base">
                      {article.title}
                    </p>
                  </Link>
                </HomepageHoverTitle>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      ) : null}

      {showcase.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-[2rem] md:text-[2.35rem]">
            Turli uslubdagi maqolalar
          </h2>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {showcase.map((article) => (
              <HomepageHoverTitle
                key={article.id}
                title={article.title}
                hint={articleHoverHint(article)}
                className="group grid h-full min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-card-xl border bg-slate-900 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <HomepageArticleMedia
                  article={article}
                  href={articleHref(article.slug)}
                  sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
                  className="h-44 w-full shrink-0 sm:h-48"
                  imageClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <Link
                  href={articleHref(article.slug)}
                  className="flex h-full min-h-[5.5rem] flex-col gap-2 p-3 text-white sm:min-h-[6rem] sm:gap-2.5 sm:p-4"
                >
                  <p className="text-[0.65rem] font-medium uppercase tracking-wide text-white/65 sm:text-xs">
                    {article.categories?.[0]?.name ?? "Saralangan"}
                  </p>
                  <p className="line-clamp-3 break-words text-sm font-bold leading-snug [overflow-wrap:anywhere] sm:text-[0.95rem] md:line-clamp-4 md:text-base">
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
              className="group flex gap-3 rounded-card-lg border bg-card p-3 shadow-sm transition-colors hover:bg-muted/25 sm:gap-4 sm:p-4"
            >
              <HomepageArticleMedia
                article={article}
                href={articleHref(article.slug)}
                compactDots
                sizes="192px"
                className="relative hidden h-36 w-48 shrink-0 rounded-card-sm sm:block"
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
                <p className="line-clamp-3 text-lg font-bold leading-tight tracking-tight text-foreground group-hover:text-primary sm:text-[1.45rem]">
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
