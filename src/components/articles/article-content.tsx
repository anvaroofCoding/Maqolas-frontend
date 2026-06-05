"use client";

import { useMemo } from "react";
import { CodeBlockShell } from "@/components/articles/code-block-shell";
import { splitHtmlByCodeBlocks } from "@/lib/articles/split-html-by-code-blocks";
import { cn } from "@/lib/utils";

type ArticleContentProps = {
  html: string;
  className?: string;
  itemProp?: string;
};

export function ArticleContent({ html, className, itemProp }: ArticleContentProps) {
  const parts = useMemo(() => splitHtmlByCodeBlocks(html), [html]);

  return (
    <div className={cn("article-editor-content", className)} itemProp={itemProp}>
      {parts.map((part, index) =>
        part.type === "pre" ? (
          <CodeBlockShell key={`pre-${index}`} html={part.content} />
        ) : (
          <div
            key={`html-${index}`}
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        ),
      )}
    </div>
  );
}
