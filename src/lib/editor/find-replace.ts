import type { Editor } from "@tiptap/core";

export type TextMatch = {
  from: number;
  to: number;
};

function normalizeForSearch(value: string, caseSensitive: boolean) {
  return caseSensitive ? value : value.toLowerCase();
}

export function findTextMatches(
  editor: Editor,
  search: string,
  caseSensitive = false,
): TextMatch[] {
  if (!search) return [];

  const needle = normalizeForSearch(search, caseSensitive);
  const matches: TextMatch[] = [];

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;

    const haystack = normalizeForSearch(node.text, caseSensitive);
    let startIndex = 0;

    while (startIndex < haystack.length) {
      const index = haystack.indexOf(needle, startIndex);
      if (index === -1) break;

      matches.push({
        from: pos + index,
        to: pos + index + search.length,
      });
      startIndex = index + needle.length;
    }
  });

  return matches;
}

export function findNextMatch(
  editor: Editor,
  search: string,
  caseSensitive = false,
  wrap = true,
): TextMatch | null {
  const matches = findTextMatches(editor, search, caseSensitive);
  if (matches.length === 0) return null;

  const cursor = editor.state.selection.from;
  const next = matches.find((match) => match.from >= cursor);
  if (next) return next;
  return wrap ? matches[0] : null;
}

export function selectMatch(editor: Editor, match: TextMatch) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from: match.from, to: match.to })
    .scrollIntoView()
    .run();
}

export function replaceCurrentSelection(
  editor: Editor,
  search: string,
  replace: string,
  caseSensitive = false,
): number {
  const { from, to, empty } = editor.state.selection;
  if (empty) return 0;

  const selected = editor.state.doc.textBetween(from, to, " ");
  const matches =
    normalizeForSearch(selected, caseSensitive) ===
    normalizeForSearch(search, caseSensitive);

  if (!matches) return 0;

  editor.chain().focus().insertContentAt({ from, to }, replace).run();
  return 1;
}

export function replaceAllMatches(
  editor: Editor,
  search: string,
  replace: string,
  caseSensitive = false,
): number {
  const matches = findTextMatches(editor, search, caseSensitive);
  if (matches.length === 0) return 0;

  let tr = editor.state.tr;
  for (const match of [...matches].reverse()) {
    tr = tr.insertText(replace, match.from, match.to);
  }
  editor.view.dispatch(tr);
  return matches.length;
}
