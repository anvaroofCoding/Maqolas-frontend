import type { Extensions } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
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
import { AiAutocompleteExtension } from "@/lib/editor/ai-autocomplete-extension";
import { Callout } from "@/lib/editor/callout-extension";
import { HeadingWithId } from "@/lib/editor/heading-with-id";
import { ImageRow } from "@/lib/editor/image-row-extension";
import { ResizableImage } from "@/lib/editor/resizable-image-extension";

export interface EditorExtensionOptions {
  aiAutocomplete?: {
    enabled: boolean;
    fetchSuggestion: (context: string) => Promise<string>;
  };
}

export function createEditorExtensions(
  options?: EditorExtensionOptions,
): Extensions {
  const extensions: Extensions = [
    StarterKit.configure({
      heading: false,
      link: false,
      underline: false,
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
    ResizableImage,
    ImageRow,
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

  if (options?.aiAutocomplete) {
    extensions.push(
      AiAutocompleteExtension.configure({
        enabled: options.aiAutocomplete.enabled,
        fetchSuggestion: options.aiAutocomplete.fetchSuggestion,
      }),
    );
  }

  return extensions;
}
