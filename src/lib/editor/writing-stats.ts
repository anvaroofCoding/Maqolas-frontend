import type { Editor } from "@tiptap/react";

export type WritingStats = {
  words: number;
  characters: number;
  paragraphs: number;
  headings: number;
  readingMinutes: number;
};

const WORDS_PER_MINUTE = 200;

export function getWritingStats(editor: Editor): WritingStats {
  const text = editor.getText();
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.replace(/\s/g, "").length;

  let paragraphs = 0;
  let headings = 0;

  editor.state.doc.descendants((node) => {
    if (node.type.name === "paragraph" && node.textContent.trim()) {
      paragraphs += 1;
    }
    if (node.type.name === "heading") {
      headings += 1;
    }
  });

  const readingMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return { words, characters, paragraphs, headings, readingMinutes };
}
