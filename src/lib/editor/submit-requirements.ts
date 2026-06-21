import type { Editor } from "@tiptap/react";
import { getWritingStats } from "@/lib/editor/writing-stats";

export const MIN_SUBMIT_WORDS = 200;

export function countEditorImages(editor: Editor): number {
  let count = 0;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "image") {
      count += 1;
    }
  });
  return count;
}

export function getSubmitReadiness(editor: Editor) {
  const { words } = getWritingStats(editor);
  const imageCount = countEditorImages(editor);

  return {
    words,
    imageCount,
    meetsWordCount: words >= MIN_SUBMIT_WORDS,
    hasImage: imageCount >= 1,
    canSubmit: words >= MIN_SUBMIT_WORDS && imageCount >= 1,
  };
}

export function getSubmitBlockReason(editor: Editor): string | null {
  const readiness = getSubmitReadiness(editor);
  if (readiness.canSubmit) return null;

  const missing: string[] = [];
  if (!readiness.meetsWordCount) {
    missing.push(`kamida ${MIN_SUBMIT_WORDS} ta so'z`);
  }
  if (!readiness.hasImage) {
    missing.push("kamida 1 ta rasm");
  }

  return missing.join(" va ");
}
