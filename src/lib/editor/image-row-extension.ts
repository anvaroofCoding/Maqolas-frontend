import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageRow: {
      insertImageRow: (urls: string[]) => ReturnType;
    };
  }
}

export const ImageRow = Node.create({
  name: "imageRow",
  group: "block",
  content: "image{2,4}",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-cols"));
          return Number.isFinite(value) ? Math.min(4, Math.max(2, value)) : 2;
        },
        renderHTML: (attributes) => ({
          "data-cols": String(attributes.cols ?? 2),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-image-row="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-image-row": "true",
        class: "article-image-row",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertImageRow:
        (urls: string[]) =>
        ({ chain }) => {
          const uniqueUrls = urls.filter(Boolean).slice(0, 4);
          if (uniqueUrls.length < 2) return false;

          return chain()
            .insertContent({
              type: this.name,
              attrs: { cols: uniqueUrls.length },
              content: uniqueUrls.map((src) => ({
                type: "image",
                attrs: {
                  src,
                  width: "100",
                  align: "center",
                  inRow: true,
                },
              })),
            })
            .run();
        },
    };
  },
});
