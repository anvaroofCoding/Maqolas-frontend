import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutVariant = "tip" | "warning" | "important";

export const CALLOUT_LABELS: Record<CalloutVariant, string> = {
  tip: "Maslahat",
  warning: "Ogohlantirish",
  important: "Muhim",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (variant?: CalloutVariant) => ReturnType;
      toggleCallout: (variant?: CalloutVariant) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: "tip" as CalloutVariant,
        parseHTML: (element) =>
          (element.getAttribute("data-variant") as CalloutVariant) || "tip",
        renderHTML: (attributes) => ({
          "data-variant": attributes.variant as CalloutVariant,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout="true"]',
        contentElement: ".article-callout__body",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const variant = (node.attrs.variant as CalloutVariant) || "tip";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-callout": "true",
        "data-variant": variant,
        class: `article-callout article-callout--${variant}`,
      }),
      [
        "div",
        { class: "article-callout__label", contenteditable: "false" },
        CALLOUT_LABELS[variant],
      ],
      ["div", { class: "article-callout__body" }, 0],
    ];
  },

  addCommands() {
    return {
      setCallout:
        (variant: CalloutVariant = "tip") =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant }),
      toggleCallout:
        (variant: CalloutVariant = "tip") =>
        ({ commands }) =>
          commands.toggleWrap(this.name, { variant }),
      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
