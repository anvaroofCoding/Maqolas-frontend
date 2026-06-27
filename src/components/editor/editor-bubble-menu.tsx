"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  CodeIcon,
  EyeOffIcon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import {
  EditorToolbarButton,
  EditorToolbarDivider,
} from "@/components/editor/editor-toolbar-button";

interface EditorBubbleMenuProps {
  editor: Editor | null;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  if (!editor) return null;

  const setLink = () => {
    const { from, to, empty } = editor.state.selection;
    if (empty) return;

    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Havola URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .setLink({ href: url })
      .run();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed, state }) => {
        const { empty } = state.selection;
        if (empty) return false;
        if (ed.isActive("table")) return false;
        if (ed.isActive("codeBlock")) return false;
        return true;
      }}
      className="flex items-center gap-0.5 rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
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
        label="Ajratish"
        isActive={editor.isActive("highlight")}
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
        }
      >
        <HighlighterIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Yashirin matn (spoiler)"
        isActive={editor.isActive("spoiler")}
        onClick={() => editor.chain().focus().toggleSpoiler().run()}
      >
        <EyeOffIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Havola"
        isActive={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon />
      </EditorToolbarButton>
    </BubbleMenu>
  );
}
