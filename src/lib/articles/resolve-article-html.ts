import { syncFigureLayoutInHtml } from "@/lib/articles/sync-figure-layout-html";

function isTipTapDoc(
  contentJson?: Record<string, unknown> | null,
): contentJson is Record<string, unknown> & { type: "doc" } {
  return (
    contentJson != null &&
    typeof contentJson === "object" &&
    contentJson.type === "doc"
  );
}

/** contentJson mavjud bo'lsa layoutni u yerdan, aks holda HTML dan tiklaydi */
export function resolveArticleHtml(
  contentHtml: string,
  contentJson?: Record<string, unknown> | null,
): string {
  if (isTipTapDoc(contentJson)) {
    return syncFigureLayoutInHtml(contentHtml, contentJson);
  }
  return contentHtml;
}

export { isTipTapDoc };
