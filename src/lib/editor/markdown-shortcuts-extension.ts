import { Extension, InputRule, markInputRule } from "@tiptap/core";

export const MarkdownShortcuts = Extension.create({
  name: "markdownShortcuts",
  priority: 500,

  addInputRules() {
    const rules = [
      new InputRule({
        find: /^#\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleHeading({ level: 1 }).run();
        },
      }),
      new InputRule({
        find: /^##\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleHeading({ level: 2 }).run();
        },
      }),
      new InputRule({
        find: /^###\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleHeading({ level: 3 }).run();
        },
      }),
      new InputRule({
        find: /^[-*]\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleBulletList().run();
        },
      }),
      new InputRule({
        find: /^(\d+)\.\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleOrderedList().run();
        },
      }),
      new InputRule({
        find: /^>\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleBlockquote().run();
        },
      }),
      new InputRule({
        find: /^---$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).setHorizontalRule().run();
        },
      }),
      new InputRule({
        find: /^```$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleCodeBlock().run();
        },
      }),
      new InputRule({
        find: /^\[\s\]\s$/,
        handler: ({ chain, range }) => {
          chain().deleteRange(range).toggleTaskList().run();
        },
      }),
    ];

    const bold = this.editor.schema.marks.bold;
    const italic = this.editor.schema.marks.italic;
    const code = this.editor.schema.marks.code;
    const spoiler = this.editor.schema.marks.spoiler;

    if (bold) {
      rules.push(
        markInputRule({
          find: /\*\*([^*]+)\*\*$/,
          type: bold,
        }),
      );
    }

    if (italic) {
      rules.push(
        markInputRule({
          find: /(?:^|\s)_([^_]+)_$/,
          type: italic,
        }),
      );
    }

    if (code) {
      rules.push(
        markInputRule({
          find: /`([^`]+)`$/,
          type: code,
        }),
      );
    }

    if (spoiler) {
      rules.push(
        markInputRule({
          find: /\|\|([^|]+)\|\|$/,
          type: spoiler,
        }),
      );
    }

    return rules;
  },
});
