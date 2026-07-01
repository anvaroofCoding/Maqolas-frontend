"use client";

import { createContext, useContext } from "react";

export type ArticlePhraseContextValue = {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
};

const ArticlePhraseContext = createContext<ArticlePhraseContextValue | null>(
  null,
);

export function ArticlePhraseProvider({
  articleId,
  articleSlug,
  articleTitle,
  children,
}: ArticlePhraseContextValue & { children: React.ReactNode }) {
  return (
    <ArticlePhraseContext.Provider
      value={{ articleId, articleSlug, articleTitle }}
    >
      {children}
    </ArticlePhraseContext.Provider>
  );
}

export function useArticlePhrase() {
  return useContext(ArticlePhraseContext);
}
