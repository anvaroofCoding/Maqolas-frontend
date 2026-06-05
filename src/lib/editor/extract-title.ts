import type { JSONContent } from "@tiptap/react";

export function extractTitleFromJson(
  json: JSONContent,
  fallback = "Nomsiz maqola",
) {
  const walk = (node: JSONContent): string | null => {
    if (node.type === "heading" && node.attrs?.level === 1) {
      return textFromNode(node);
    }
    if (node.content) {
      for (const child of node.content) {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  };

  return walk(json)?.trim() || fallback;
}

function textFromNode(node: JSONContent): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(textFromNode).join("");
}
