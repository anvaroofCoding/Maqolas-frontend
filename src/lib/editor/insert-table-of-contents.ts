import type { Editor } from "@tiptap/react";
import { slugifyHeading } from "@/lib/editor/slugify";

export function insertTableOfContents(editor: Editor): boolean {
  const headings: { level: number; text: string; id: string }[] = [];

  editor.state.doc.descendants((node) => {
    if (node.type.name !== "heading") return;
    const text = node.textContent.trim();
    if (!text) return;
    headings.push({
      level: node.attrs.level as number,
      text,
      id: slugifyHeading(text),
    });
  });

  if (headings.length === 0) return false;

  const listItems = headings.map((heading) => ({
    type: "listItem",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "link", attrs: { href: `#${heading.id}` } }],
            text: heading.text,
          },
        ],
      },
    ],
  }));

  editor
    .chain()
    .focus()
    .insertContent([
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Mundarija" }],
      },
      {
        type: "bulletList",
        content: listItems,
      },
    ])
    .run();

  return true;
}
