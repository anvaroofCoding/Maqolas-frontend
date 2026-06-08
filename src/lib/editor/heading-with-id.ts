import Heading from "@tiptap/extension-heading";
import { slugifyHeading } from "@/lib/editor/slugify";

export const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = this.options.levels.includes(node.attrs.level)
      ? node.attrs.level
      : this.options.levels[0];

    const id = slugifyHeading(node.textContent);

    return [
      `h${level}`,
      { ...HTMLAttributes, id },
      0,
    ];
  },
}).configure({ levels: [1, 2, 3] });
