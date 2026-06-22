"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlockShell } from "@/components/articles/code-block-shell";
import {
  isTipTapDoc,
  resolveArticleHtml,
} from "@/lib/articles/resolve-article-html";
import { splitHtmlByCodeBlocks } from "@/lib/articles/split-html-by-code-blocks";
import { cn } from "@/lib/utils";

type ArticleContentProps = {
  html: string;
  contentJson?: Record<string, unknown> | null;
  className?: string;
  itemProp?: string;
};

export function ArticleContent({
  html,
  contentJson,
  className,
  itemProp,
}: ArticleContentProps) {
  const syncedHtml = useMemo(
    () => resolveArticleHtml(html, contentJson),
    [html, contentJson],
  );

  const [resolvedHtml, setResolvedHtml] = useState(syncedHtml);

  useEffect(() => {
    setResolvedHtml(syncedHtml);
  }, [syncedHtml]);

  useEffect(() => {
    if (!isTipTapDoc(contentJson)) return;

    let cancelled = false;

    void import("@/lib/articles/render-article-html-client").then(
      ({ renderArticleHtmlFromJson }) => {
        if (cancelled) return;
        setResolvedHtml(renderArticleHtmlFromJson(contentJson, html));
      },
    );

    return () => {
      cancelled = true;
    };
  }, [contentJson, html]);

  const parts = useMemo(
    () => splitHtmlByCodeBlocks(resolvedHtml),
    [resolvedHtml],
  );

  return (
    <div className={cn("article-editor-content", className)} itemProp={itemProp}>
      {parts.map((part, index) =>
        part.type === "pre" ? (
          <CodeBlockShell key={`pre-${index}`} html={part.content} />
        ) : (
          <div
            key={`html-${index}`}
            className="article-editor-html-part"
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        ),
      )}
    </div>
  );
}
