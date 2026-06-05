import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailBody } from "@/components/articles/article-detail-body";
import { ArticleDetailHeader } from "@/components/articles/article-detail-header";
import { ArticleEngagement } from "@/components/articles/article-engagement";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { stripArticleLeadFromHtml } from "@/lib/articles/content";
import { fetchArticleBySlug } from "@/lib/articles/server";
import { buildArticleJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: "Maqola topilmadi",
      path: `/maqola/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt ?? article.title,
    path: `/maqola/${article.slug}`,
    image: article.coverImageUrl,
    keywords: [article.title, article.author?.displayName ?? "maqola"],
  });
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const authorName = article.author?.displayName ?? "Noma'lum muallif";
  const articleBodyHtml = stripArticleLeadFromHtml(article.contentHtml);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <JsonLdScript
        data={buildArticleJsonLd({
          title: article.title,
          description: article.excerpt ?? article.title,
          slug: article.slug,
          coverImageUrl: article.coverImageUrl,
          authorName,
          publishedAt: article.createdAt,
          updatedAt: article.updatedAt,
        })}
      />

      <article itemScope itemType="https://schema.org/Article">
        <ArticleDetailHeader
          title={article.title}
          contentHtml={article.contentHtml}
          coverImageUrl={article.coverImageUrl}
          authorName={authorName}
          authorUsername={article.author?.username}
          authorAvatarUrl={article.author?.avatarUrl}
          createdAt={article.createdAt}
          categories={article.categories}
        />

        <ArticleDetailBody
          coverImageUrl={article.coverImageUrl}
          title={article.title}
          contentHtml={articleBodyHtml}
          contentClassName="mt-6"
          itemProp="articleBody"
        />

        <footer className="mt-8">
          <ArticleEngagement
            articleId={article.id}
            viewCount={article.viewCount}
            initialLikeCount={article.likeCount}
            initialCommentCount={article.commentCount}
          />
        </footer>
      </article>
    </main>
  );
}
