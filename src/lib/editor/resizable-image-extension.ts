import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "@/components/editor/image-node-view";
import type { ImageAlign } from "@/lib/editor/image-constants";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setImageWidth: (width: string) => ReturnType;
      setImageAlign: (align: ImageAlign) => ReturnType;
    };
  }
}

function parseWidth(value: string | null | undefined): string {
  if (!value) return "100";
  const numeric = value.replace("%", "").trim();
  const parsed = Number.parseInt(numeric, 10);
  if (!Number.isFinite(parsed)) return "100";
  return String(Math.min(100, Math.max(20, parsed)));
}

export const ResizableImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100",
        parseHTML: (element) => {
          const dataWidth = element.getAttribute("data-width");
          if (dataWidth) return parseWidth(dataWidth);

          const styleWidth = element.style.width;
          if (styleWidth?.endsWith("%")) {
            return parseWidth(styleWidth);
          }

          return "100";
        },
        renderHTML: (attributes) => {
          const width = parseWidth(String(attributes.width ?? "100"));
          const inRow = Boolean(attributes.inRow);

          if (inRow) {
            return {
              "data-width": "100",
              style: "width: 100%",
            };
          }

          return {
            "data-width": width,
            style: `width: ${width}%`,
          };
        },
      },
      align: {
        default: "center" as ImageAlign,
        parseHTML: (element) =>
          (element.getAttribute("data-align") as ImageAlign) || "center",
        renderHTML: (attributes) => {
          if (attributes.inRow) {
            return { "data-align": "center" };
          }

          return {
            "data-align": attributes.align as ImageAlign,
          };
        },
      },
      inRow: {
        default: false,
        parseHTML: (element) =>
          Boolean(element.closest('[data-image-row="true"]')),
        renderHTML: () => ({}),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const inRow = Boolean(HTMLAttributes.inRow);
    const align = (HTMLAttributes.align as ImageAlign) ?? "center";
    const width = parseWidth(String(HTMLAttributes.width ?? "100"));

    const {
      inRow: _inRow,
      align: _align,
      width: _width,
      ...rest
    } = HTMLAttributes;

    return [
      "img",
      {
        ...rest,
        class: inRow
          ? "article-image article-image--in-row"
          : `article-image article-image--align-${align}`,
        "data-width": inRow ? "100" : width,
        "data-align": align,
        style: inRow ? "width: 100%" : `width: ${width}%`,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageWidth:
        (width: string) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, {
            width: parseWidth(width),
          }),
      setImageAlign:
        (align: ImageAlign) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align }),
    };
  },
});
