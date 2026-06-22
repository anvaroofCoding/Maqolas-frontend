import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "@/components/editor/image-node-view";
import type { ImageAlign } from "@/lib/editor/image-constants";
import {
  figureAlignClass,
  parseImageWidth,
  readAlignFromAttrs,
  readAlignFromElement,
  readWidthFromAttrs,
  readWidthFromElement,
} from "@/lib/editor/image-figure-utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setImageWidth: (width: string) => ReturnType;
      setImageAlign: (align: ImageAlign) => ReturnType;
    };
  }
}

function readImageSrc(element: Element): string | null {
  if (element.tagName === "IMG") {
    return element.getAttribute("src");
  }

  const img = element.querySelector("img");
  return img?.getAttribute("src") ?? null;
}

function readImageAlt(element: Element): string {
  if (element.tagName === "IMG") {
    return element.getAttribute("alt") ?? "";
  }

  const img = element.querySelector("img");
  return img?.getAttribute("alt") ?? "";
}

function buildFigureHtml(attrs: Record<string, unknown>) {
  const inRow = Boolean(attrs.inRow);
  const align = readAlignFromAttrs(attrs);
  const width = readWidthFromAttrs(attrs);
  const src = String(attrs.src ?? "");
  const alt = String(attrs.alt ?? "");

  if (inRow) {
    return [
      "figure",
      {
        class: figureAlignClass(align, true),
        "data-align": align,
        "data-width": "100",
        "data-in-row": "true",
        style: "width: 100%",
      },
      ["img", { src, alt, class: "article-image", draggable: "false" }],
    ] as const;
  }

  return [
    "figure",
    {
      class: figureAlignClass(align),
      "data-align": align,
      "data-width": width,
      style: `width: ${width}%`,
    },
    ["img", { src, alt, class: "article-image", draggable: "false" }],
  ] as const;
}

export const ResizableImage = Image.extend({
  name: "image",

  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "50",
        parseHTML: (element) => readWidthFromElement(element),
        renderHTML: (attributes) => {
          const width = parseImageWidth(String(attributes.width ?? "50"));
          if (attributes.inRow) {
            return { "data-width": "100", style: "width: 100%" };
          }
          return { "data-width": width, style: `width: ${width}%` };
        },
      },
      align: {
        default: "right" as ImageAlign,
        parseHTML: (element) => readAlignFromElement(element),
        renderHTML: (attributes) => ({
          "data-align": attributes.align as ImageAlign,
        }),
      },
      inRow: {
        default: false,
        parseHTML: (element) =>
          Boolean(
            element.closest('[data-image-row="true"]') ||
              element.getAttribute("data-in-row") === "true",
          ),
        renderHTML: (attributes) =>
          attributes.inRow ? { "data-in-row": "true" } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[class*='article-figure']",
        getAttrs: (element) => {
          if (!(element instanceof Element)) return false;
          const src = readImageSrc(element);
          if (!src) return false;

          return {
            src,
            alt: readImageAlt(element),
            width: readWidthFromElement(element),
            align: readAlignFromElement(element),
            inRow: element.classList.contains("article-figure--in-row"),
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (!(element instanceof Element)) return false;
          const src = element.getAttribute("src");
          if (!src) return false;

          return {
            src,
            alt: element.getAttribute("alt") ?? "",
            width: readWidthFromElement(element),
            align: readAlignFromElement(element),
            inRow: Boolean(element.closest('[data-image-row="true"]')),
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return buildFigureHtml({ ...node.attrs, ...HTMLAttributes });
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView, {
      stopEvent: ({ event }) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return true;

        if (
          target.closest(
            ".article-figure__drag-handle, .article-figure__resize-handle, .article-image-toolbar",
          )
        ) {
          return true;
        }

        return false;
      },
    });
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageWidth:
        (width: string) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, {
            width: parseImageWidth(width),
          }),
      setImageAlign:
        (align: ImageAlign) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { align }),
    };
  },
});
