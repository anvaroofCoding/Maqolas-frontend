import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailBody } from "@/components/articles/article-detail-body";
import { ArticleDetailHeader } from "@/components/articles/article-detail-header";
import { ArticleEngagement } from "@/components/articles/article-engagement";
import { ArticleHashtags } from "@/components/articles/article-hashtags";
import { ArticlePhraseShell } from "@/components/saved-phrases/article-phrase-shell";
import { PromoAutoScrollActivator } from "@/components/promo-reader/promo-auto-scroll-activator";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { stripArticleLeadFromHtml } from "@/lib/articles/content";
import { fetchArticleBySlug } from "@/lib/articles/server";
import { buildArticleDescription } from "@/lib/seo/description";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  estimateWordCount,
} from "@/lib/seo/json-ld";
import { buildArticleKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { articleSurfaceClassName } from "@/lib/layout";
import { articleOgImageUrl, resolveOgImageUrl } from "@/lib/seo/urls";
import { cn } from "@/lib/utils";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { meta: true });

  if (!article) {
    return buildPageMetadata({
      title: "Maqola topilmadi",
      path: `/maqola/${slug}`,
      noIndex: true,
    });
  }

  const authorName = article.author?.displayName ?? "Noma'lum muallif";
  const description = buildArticleDescription({
    title: article.title,
    excerpt: article.excerpt,
    categories: article.categories,
    authorName,
  });

  return buildPageMetadata({
    title: article.title,
    titleFormat: "article",
    description,
    path: `/maqola/${article.slug}`,
    image: articleOgImageUrl(article.slug, article.coverImageUrl),
    keywords: buildArticleKeywords(
      article.title,
      article.categories,
      authorName,
    ),
    type: "article",
    publishedTime: article.publishedAt ?? article.createdAt,
    modifiedTime: article.updatedAt ?? article.publishedAt ?? article.createdAt,
    authors: [authorName],
    tags: article.categories?.map((category) => category.name),
  });
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const authorName = article.author?.displayName ?? "Noma'lum muallif";
  const articleBodyHtml = stripArticleLeadFromHtml(article.contentHtml ?? "");
  const description = buildArticleDescription({
    title: article.title,
    excerpt: article.excerpt,
    categories: article.categories,
    authorName,
  });
  const primaryCategory = article.categories?.[0];
  const breadcrumbItems = [
    { name: "Bosh sahifa", path: "/" },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            path: `/mavzu/${primaryCategory.slug}`,
          },
        ]
      : []),
    { name: article.title, path: `/maqola/${article.slug}` },
  ];

  return (
    <>
    <PromoAutoScrollActivator />
    <main className={cn(articleSurfaceClassName)}>
      <JsonLdScript
        data={[
          buildArticleJsonLd({
            title: article.title,
            description,
            slug: article.slug,
            coverImageUrl: resolveOgImageUrl(article.coverImageUrl),
            authorName,
            authorUsername: article.author?.username,
            publishedAt: article.publishedAt ?? article.createdAt,
            updatedAt: article.updatedAt ?? article.publishedAt ?? article.createdAt,
            categories: article.categories,
            wordCount: estimateWordCount(article.contentHtml ?? ""),
          }),
          buildBreadcrumbJsonLd(breadcrumbItems),
        ]}
      />

      <article itemScope itemType="https://schema.org/Article">
        <ArticlePhraseShell
          articleId={article.id}
          articleSlug={article.slug}
          articleTitle={article.title}
        >
        <ArticleDetailHeader
          title={article.title}
          contentHtml={article.contentHtml ?? ""}
          contentJson={article.contentJson}
          coverImageUrl={article.coverImageUrl}
          authorName={authorName}
          authorUsername={article.author?.username}
          authorAvatarUrl={article.author?.avatarUrl}
          createdAt={article.publishedAt ?? article.createdAt}
          categories={article.categories}
        />

        <ArticleDetailBody
          articleId={article.id}
          slug={article.slug}
          coverImageUrl={article.coverImageUrl}
          title={article.title}
          excerpt={article.excerpt}
          authorName={authorName}
          authorAvatarUrl={article.author?.avatarUrl}
          categoryName={article.categories?.[0]?.name}
          contentHtml={articleBodyHtml}
          contentJson={article.contentJson}
          contentClassName="mt-6"
          itemProp="articleBody"
        />

        <ArticleHashtags hashtags={article.hashtags} className="mt-6 maqolas-no-native-select" />

        <footer className="mt-8" data-site-chrome>
          <ArticleEngagement
            articleId={article.id}
            storyData={{
              slug: article.slug,
              title: article.title,
              excerpt: article.excerpt,
              coverImageUrl: article.coverImageUrl,
              authorName,
              authorAvatarUrl: article.author?.avatarUrl,
              categoryName: article.categories?.[0]?.name,
            }}
            viewCount={article.viewCount}
            initialLikeCount={article.likeCount}
            initialCommentCount={article.commentCount}
          />
        </footer>
        </ArticlePhraseShell>
      </article>
    </main>
    </>
  );
}
