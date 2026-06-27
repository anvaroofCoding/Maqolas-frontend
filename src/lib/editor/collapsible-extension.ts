import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    collapsible: {
      setCollapsible: (summary?: string) => ReturnType;
      toggleCollapsible: () => ReturnType;
    };
  }
}

export const Collapsible = Node.create({
  name: "collapsible",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      summary: {
        default: "Ko'proq o'qish",
        parseHTML: (element) => {
          const summary = element.querySelector("summary");
          return summary?.textContent?.trim() || "Ko'proq o'qish";
        },
        renderHTML: () => ({}),
      },
      open: {
        default: true,
        parseHTML: (element) => element.hasAttribute("open"),
        renderHTML: (attributes) =>
          attributes.open ? { open: "open" } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "details.editor-collapsible",
        contentElement: ".editor-collapsible__body",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const summary = (node.attrs.summary as string) || "Ko'proq o'qish";
    return [
      "details",
      mergeAttributes(HTMLAttributes, {
        class: "editor-collapsible",
        ...(node.attrs.open ? { open: "open" } : {}),
      }),
      ["summary", { class: "editor-collapsible__summary" }, summary],
      ["div", { class: "editor-collapsible__body" }, 0],
    ];
  },

  addCommands() {
    return {
      setCollapsible:
        (summary = "Ko'proq o'qish") =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { summary, open: true },
            content: [{ type: "paragraph" }],
          }),
      toggleCollapsible:
        () =>
        ({ commands }) =>
          commands.toggleWrap(this.name),
    };
  },
});
