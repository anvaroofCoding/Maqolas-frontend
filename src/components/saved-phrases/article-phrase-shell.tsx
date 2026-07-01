"use client";

import { ArticlePhraseProvider } from "@/components/saved-phrases/article-phrase-context";

type ArticlePhraseShellProps = {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  children: React.ReactNode;
};

export function ArticlePhraseShell({
  articleId,
  articleSlug,
  articleTitle,
  children,
}: ArticlePhraseShellProps) {
  return (
    <ArticlePhraseProvider
      articleId={articleId}
      articleSlug={articleSlug}
      articleTitle={articleTitle}
    >
      {children}
    </ArticlePhraseProvider>
  );
}
