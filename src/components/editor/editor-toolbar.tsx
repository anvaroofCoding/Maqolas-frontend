"use client";

import type { Editor } from "@tiptap/react";
import {
  AlertTriangleIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  Columns2Icon,
  EraserIcon,
  EyeOffIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ItalicIcon,
  LightbulbIcon,
  LinkIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  QuoteIcon,
  Redo2Icon,
  SparklesIcon,
  StarIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TableIcon,
  UnderlineIcon,
  Undo2Icon,
  YoutubeIcon,
} from "lucide-react";
import { EditorCommandMenu } from "@/components/editor/editor-command-menu";
import { EditorFindReplace } from "@/components/editor/editor-find-replace";
import { EditorImageToolbarActions } from "@/components/editor/editor-image-toolbar-actions";
import { EditorKeyboardShortcuts } from "@/components/editor/editor-keyboard-shortcuts";
import {
  EditorToolbarButton,
  EditorToolbarDivider,
} from "@/components/editor/editor-toolbar-button";
import { EditorWritingStats } from "@/components/editor/editor-writing-stats";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CalloutVariant } from "@/lib/editor/callout-extension";
import { FONT_SIZE_OPTIONS } from "@/lib/editor/font-size-extension";
import { insertTableOfContents } from "@/lib/editor/insert-table-of-contents";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { label: "Standart", value: "" },
  { label: "Qizil", value: "#dc2626" },
  { label: "To'q sariq", value: "#ea580c" },
  { label: "Yashil", value: "#16a34a" },
  { label: "Ko'k", value: "#2563eb" },
  { label: "Binafsha", value: "#7c3aed" },
];

const HIGHLIGHT_COLORS = [
  { label: "Sariq", value: "#fef08a" },
  { label: "Yashil", value: "#bbf7d0" },
  { label: "Ko'k", value: "#bfdbfe" },
  { label: "Pushti", value: "#fbcfe8" },
  { label: "Kulrang", value: "#e5e7eb" },
];

interface EditorToolbarProps {
  editor: Editor | null;
}

function insertCallout(editor: Editor, variant: CalloutVariant) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "callout",
      attrs: { variant },
      content: [{ type: "paragraph" }],
    })
    .run();
}

type ToolbarActions = {
  setLink: () => void;
  addImage: () => void;
  addImageRow: () => void;
  addYoutube: () => void;
  insertToc: () => void;
  clearFormatting: () => void;
};

function createToolbarActions(editor: Editor): ToolbarActions {
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

  const addImage = () => {
    document.getElementById("editor-single-image-input")?.click();
  };

  const addImageRow = () => {
    document.getElementById("editor-row-image-input")?.click();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube havolasi", "https://www.youtube.com/watch?v=");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  const insertToc = () => {
    const ok = insertTableOfContents(editor);
    if (!ok) toast.error("Mundarija uchun kamida bitta sarlavha kerak");
  };

  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return { setLink, addImage, addImageRow, addYoutube, insertToc, clearFormatting };
}

function EditorToolbarMobile({
  editor,
  actions,
}: {
  editor: Editor;
  actions: ToolbarActions;
}) {
  const mobileBtnClass = "size-9 shrink-0";

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 scrollbar-hidden touch-pan-x">
      <EditorToolbarButton
        label="Bekor qilish"
        className={mobileBtnClass}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Qaytarish"
        className={mobileBtnClass}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2Icon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Qalin"
        className={mobileBtnClass}
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Kursiv"
        className={mobileBtnClass}
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Tag chiziq"
        className={mobileBtnClass}
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </EditorToolbarButton>

      <EditorToolbarDivider />

      <EditorToolbarButton
        label="Sarlavha 2"
        className={mobileBtnClass}
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Ro'yxat"
        className={mobileBtnClass}
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Havola"
        className={mobileBtnClass}
        isActive={editor.isActive("link")}
        onClick={actions.setLink}
      >
        <LinkIcon />
      </EditorToolbarButton>
      <EditorImageToolbarActions editor={editor} />

      <EditorToolbarDivider />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(mobileBtnClass, "text-muted-foreground hover:text-foreground")}
            aria-label="Barcha formatlash"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[75dvh] overflow-y-auto rounded-t-2xl px-4 pb-6">
          <SheetHeader className="px-0">
            <SheetTitle>Formatlash</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-4">
            <EditorCommandMenu
              editor={editor}
              onImageClick={actions.addImage}
              onImageRowClick={actions.addImageRow}
            />

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sarlavhalar</p>
              <div className="flex flex-wrap gap-1">
                <EditorToolbarButton
                  label="Sarlavha 1"
                  className={mobileBtnClass}
                  isActive={editor.isActive("heading", { level: 1 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                  <Heading1Icon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Sarlavha 2"
                  className={mobileBtnClass}
                  isActive={editor.isActive("heading", { level: 2 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  <Heading2Icon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Sarlavha 3"
                  className={mobileBtnClass}
                  isActive={editor.isActive("heading", { level: 3 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                  <Heading3Icon />
                </EditorToolbarButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Matn</p>
              <div className="flex flex-wrap gap-1">
                <EditorToolbarButton
                  label="Chizilgan"
                  className={mobileBtnClass}
                  isActive={editor.isActive("strike")}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <StrikethroughIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Kod"
                  className={mobileBtnClass}
                  isActive={editor.isActive("code")}
                  onClick={() => editor.chain().focus().toggleCode().run()}
                >
                  <CodeIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Yashirin matn"
                  className={mobileBtnClass}
                  isActive={editor.isActive("spoiler")}
                  onClick={() => editor.chain().focus().toggleSpoiler().run()}
                >
                  <EyeOffIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Formatni tozalash"
                  className={mobileBtnClass}
                  onClick={actions.clearFormatting}
                >
                  <EraserIcon />
                </EditorToolbarButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Joylash</p>
              <div className="flex flex-wrap gap-1">
                <EditorToolbarButton
                  label="Chapga"
                  className={mobileBtnClass}
                  isActive={editor.isActive({ textAlign: "left" })}
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                  <AlignLeftIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Markaz"
                  className={mobileBtnClass}
                  isActive={editor.isActive({ textAlign: "center" })}
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                >
                  <AlignCenterIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="O'ngga"
                  className={mobileBtnClass}
                  isActive={editor.isActive({ textAlign: "right" })}
                  onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                  <AlignRightIcon />
                </EditorToolbarButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Bloklar</p>
              <div className="flex flex-wrap gap-1">
                <EditorToolbarButton
                  label="Raqamli ro'yxat"
                  className={mobileBtnClass}
                  isActive={editor.isActive("orderedList")}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrderedIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Vazifa ro'yxati"
                  className={mobileBtnClass}
                  isActive={editor.isActive("taskList")}
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                >
                  <ListChecksIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Iqtibos"
                  className={mobileBtnClass}
                  isActive={editor.isActive("blockquote")}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                  <QuoteIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Kod bloki"
                  className={mobileBtnClass}
                  isActive={editor.isActive("codeBlock")}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                  <CodeIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Gorizontal chiziq"
                  className={mobileBtnClass}
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                  <MinusIcon />
                </EditorToolbarButton>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Media va boshqalar</p>
              <div className="flex flex-wrap gap-1">
                <EditorToolbarButton
                  label="YouTube video"
                  className={mobileBtnClass}
                  onClick={actions.addYoutube}
                >
                  <YoutubeIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Jadval"
                  className={mobileBtnClass}
                  isActive={editor.isActive("table")}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <TableIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Avtomatik mundarija"
                  className={mobileBtnClass}
                  onClick={actions.insertToc}
                >
                  <SparklesIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Maslahat bloki"
                  className={mobileBtnClass}
                  isActive={editor.isActive("callout", { variant: "tip" })}
                  onClick={() => insertCallout(editor, "tip")}
                >
                  <LightbulbIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Ogohlantirish bloki"
                  className={mobileBtnClass}
                  isActive={editor.isActive("callout", { variant: "warning" })}
                  onClick={() => insertCallout(editor, "warning")}
                >
                  <AlertTriangleIcon />
                </EditorToolbarButton>
                <EditorToolbarButton
                  label="Muhim bloki"
                  className={mobileBtnClass}
                  isActive={editor.isActive("callout", { variant: "important" })}
                  onClick={() => insertCallout(editor, "important")}
                >
                  <StarIcon />
                </EditorToolbarButton>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const actions = createToolbarActions(editor);

  return (
    <div className="border-t border-border/60">
      <div className="md:hidden">
        <EditorToolbarMobile editor={editor} actions={actions} />
      </div>

      <div className="hidden md:block">
        <EditorToolbarDesktop editor={editor} actions={actions} />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/40 px-3 py-1.5">
        <EditorWritingStats editor={editor} className="min-w-0" />
        <div className="flex shrink-0 items-center gap-1">
          <EditorFindReplace editor={editor} />
          <EditorKeyboardShortcuts />
        </div>
      </div>
    </div>
  );
}

function EditorToolbarDesktop({
  editor,
  actions,
}: {
  editor: Editor;
  actions: ToolbarActions;
}) {
  const { setLink, addImage, addImageRow, addYoutube, insertToc, clearFormatting } = actions;

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
        <EditorCommandMenu
          editor={editor}
          onImageClick={addImage}
          onImageRowClick={addImageRow}
        />

        <EditorToolbarDivider />

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

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Shrift o'lchami"
              title="Shrift o'lchami"
              onMouseDown={(event) => event.preventDefault()}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span>Aa</span>
              <ChevronDownIcon className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1" align="start">
            {FONT_SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                style={{ fontSize: option.value }}
                onClick={() => {
                  if (option.value === "16px") {
                    editor.chain().focus().unsetFontSize().run();
                  } else {
                    editor.chain().focus().setFontSize(option.value).run();
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <EditorToolbarButton
          label="Yashirin matn (spoiler)"
          isActive={editor.isActive("spoiler")}
          onClick={() => editor.chain().focus().toggleSpoiler().run()}
        >
          <EyeOffIcon />
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
        <EditorToolbarButton
          label="Yuqori indeks"
          isActive={editor.isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperscriptIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Pastki indeks"
          isActive={editor.isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubscriptIcon />
        </EditorToolbarButton>

        <EditorToolbarDivider />

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Matn rangi"
              title="Matn rangi"
              onMouseDown={(event) => event.preventDefault()}
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <PaletteIcon className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="flex gap-1">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.label}
                  type="button"
                  title={color.label}
                  className="size-7 rounded-md border border-border transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color.value || "var(--background)",
                  }}
                  onClick={() => {
                    if (!color.value) {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.value).run();
                    }
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Ajratish"
              title="Ajratish (highlight)"
              onMouseDown={(event) => event.preventDefault()}
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
                editor.isActive("highlight") && "bg-muted text-foreground",
              )}
            >
              <HighlighterIcon className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="flex gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.label}
                  type="button"
                  title={color.label}
                  className="size-7 rounded-md border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: color.value }}
                  onClick={() =>
                    editor.chain().focus().toggleHighlight({ color: color.value }).run()
                  }
                />
              ))}
              <button
                type="button"
                title="Olib tashlash"
                className="size-7 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
              >
                ×
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <EditorToolbarButton
          label="Formatni tozalash"
          onClick={clearFormatting}
        >
          <EraserIcon />
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
          label="Vazifa ro'yxati"
          isActive={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListChecksIcon />
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
        <EditorImageToolbarActions editor={editor} />
        <EditorToolbarButton label="YouTube video" onClick={addYoutube}>
          <YoutubeIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Jadval"
          isActive={editor.isActive("table")}
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon />
        </EditorToolbarButton>
        <EditorToolbarButton label="Avtomatik mundarija" onClick={insertToc}>
          <SparklesIcon />
        </EditorToolbarButton>

        <EditorToolbarDivider />

        <EditorToolbarButton
          label="Maslahat bloki"
          isActive={editor.isActive("callout", { variant: "tip" })}
          onClick={() => insertCallout(editor, "tip")}
        >
          <LightbulbIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Ogohlantirish bloki"
          isActive={editor.isActive("callout", { variant: "warning" })}
          onClick={() => insertCallout(editor, "warning")}
        >
          <AlertTriangleIcon />
        </EditorToolbarButton>
        <EditorToolbarButton
          label="Muhim bloki"
          isActive={editor.isActive("callout", { variant: "important" })}
          onClick={() => insertCallout(editor, "important")}
        >
          <StarIcon />
        </EditorToolbarButton>
      </div>
    </>
  );
}
