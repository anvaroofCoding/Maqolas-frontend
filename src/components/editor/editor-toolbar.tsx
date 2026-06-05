"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import {
  EditorToolbarButton,
  EditorToolbarDivider,
} from "@/components/editor/editor-toolbar-button";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Havola URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Rasm URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
      <EditorToolbarButton
        label="Bekor qilish"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Qaytarish"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2Icon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Sarlavha 1"
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Sarlavha 2"
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Sarlavha 3"
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3Icon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Qalin"
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Kursiv"
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Tag chiziq"
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Chizilgan"
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Kod"
        isActive={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Chapga"
        isActive={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeftIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Markaz"
        isActive={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenterIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="O'ngga"
        isActive={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRightIcon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Ro'yxat"
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Raqamli ro'yxat"
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Iqtibos"
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Kod bloki"
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Gorizontal chiziq"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <MinusIcon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Havola"
        isActive={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon />
      </EditorToolbarButton>
      <EditorToolbarButton label="Rasm" onClick={addImage}>
        <ImageIcon />
      </EditorToolbarButton>
    </div>
  );
}
