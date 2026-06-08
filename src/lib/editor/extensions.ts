import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import { Callout } from "@/lib/editor/callout-extension";
import { HeadingWithId } from "@/lib/editor/heading-with-id";

export function createEditorExtensions() {
  return [
    StarterKit.configure({
      heading: false,
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    HeadingWithId,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Superscript,
    Subscript,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: "text-primary underline underline-offset-2" },
    }),
    Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto" } }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Callout,
    Youtube.configure({
      inline: false,
      width: 640,
      height: 360,
      HTMLAttributes: { class: "article-youtube-embed" },
    }),
    Placeholder.configure({
      placeholder: "Yozing...",
    }),
  ];
}
