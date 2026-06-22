"use client";

import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import { createEditorExtensions } from "@/lib/editor/extensions";
import { isTipTapDoc } from "@/lib/articles/resolve-article-html";
import { syncFigureLayoutInHtml } from "@/lib/articles/sync-figure-layout-html";

let readExtensions: ReturnType<typeof createEditorExtensions> | null = null;

function getReadExtensions() {
  readExtensions ??= createEditorExtensions();
  return readExtensions;
}

/** Editor bilan bir xil TipTap stack orqali HTML — faqat brauzerda */
export function renderArticleHtmlFromJson(
  contentJson: Record<string, unknown>,
  fallbackHtml = "",
): string {
  if (!isTipTapDoc(contentJson)) {
    return fallbackHtml;
  }

  try {
    const html = generateHTML(contentJson as JSONContent, getReadExtensions());
    return syncFigureLayoutInHtml(html, contentJson);
  } catch {
    return syncFigureLayoutInHtml(fallbackHtml, contentJson);
  }
}
