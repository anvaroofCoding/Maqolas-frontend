"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Columns2Icon,
  Columns3Icon,
  Rows2Icon,
  Rows3Icon,
  TableIcon,
  Trash2Icon,
} from "lucide-react";
import {
  EditorToolbarButton,
  EditorToolbarDivider,
} from "@/components/editor/editor-toolbar-button";

interface EditorTableMenuProps {
  editor: Editor | null;
}

export function EditorTableMenu({ editor }: EditorTableMenuProps) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => ed.isActive("table")}
      className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-0.5 rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <EditorToolbarButton
        label="Ustun qo'shish (chap)"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      >
        <Columns2Icon className="rotate-180" />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Ustun qo'shish (o'ng)"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Ustunni o'chirish"
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Columns3Icon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Qator qo'shish (yuqori)"
        onClick={() => editor.chain().focus().addRowBefore().run()}
      >
        <Rows2Icon className="rotate-180" />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Qator qo'shish (past)"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Qatorni o'chirish"
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Rows3Icon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Sarlavha qatorini almashtirish"
        isActive={editor.isActive("tableHeader")}
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      >
        <TableIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Kataklarni birlashtirish"
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Columns3Icon className="scale-90" />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Katakni bo'lish"
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <Columns2Icon className="scale-90" />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Jadvalni o'chirish"
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2Icon />
      </EditorToolbarButton>
    </BubbleMenu>
  );
}
