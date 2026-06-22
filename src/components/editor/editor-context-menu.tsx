"use client";

import type { Editor } from "@tiptap/core";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CopyIcon,
  ItalicIcon,
  LinkIcon,
  PaletteIcon,
  ScissorsIcon,
  SparklesIcon,
  Trash2Icon,
  UnderlineIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { fetchAiProofread } from "@/lib/editor/fetch-ai-proofread";
import type { ImageAlign } from "@/lib/editor/image-constants";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { label: "Standart", value: "" },
  { label: "Qizil", value: "#dc2626" },
  { label: "To'q sariq", value: "#ea580c" },
  { label: "Yashil", value: "#16a34a" },
  { label: "Ko'k", value: "#2563eb" },
  { label: "Binafsha", value: "#7c3aed" },
];

interface EditorContextMenuProps {
  editor: Editor | null;
}

type SavedSelection = { from: number; to: number };

export function EditorContextMenu({ editor }: EditorContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showColors, setShowColors] = useState(false);
  const [isProofreading, setIsProofreading] = useState(false);
  const savedSelection = useRef<SavedSelection | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const close = useCallback(() => {
    setOpen(false);
    setShowColors(false);
  }, []);

  const restoreSelection = useCallback(() => {
    if (!editor || !savedSelection.current) return;
    const { from, to } = savedSelection.current;
    editor.chain().setTextSelection({ from, to }).run();
  }, [editor]);

  const runWithSelection = useCallback(
    (command: () => void) => {
      restoreSelection();
      command();
      close();
    },
    [close, restoreSelection],
  );

  const hasTextSelection =
    savedSelection.current != null &&
    savedSelection.current.from !== savedSelection.current.to;

  const isImageSelected = editor?.isActive("image") ?? false;

  useEffect(() => {
    if (!editor) return;

    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!editor.view.dom.contains(target)) return;

      event.preventDefault();

      const { from, to } = editor.state.selection;
      savedSelection.current = { from, to };
      setPosition({ x: event.clientX, y: event.clientY });
      setShowColors(false);
      setOpen(true);
    };

    const editorEl = editor.view.dom;
    editorEl.addEventListener("contextmenu", handleContextMenu);
    return () => editorEl.removeEventListener("contextmenu", handleContextMenu);
  }, [editor]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  const handleCopy = async () => {
    if (!editor || !hasTextSelection) return;
    restoreSelection();
    const text = editor.state.doc.textBetween(
      savedSelection.current!.from,
      savedSelection.current!.to,
    );
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Nusxa olindi");
    } catch {
      toast.error("Nusxa olishda xatolik");
    }
    close();
  };

  const handleCut = () => {
    if (!editor || !hasTextSelection) return;
    restoreSelection();
    const { from, to } = savedSelection.current!;
    const text = editor.state.doc.textBetween(from, to);
    void navigator.clipboard.writeText(text);
    editor.chain().focus().deleteRange({ from, to }).run();
    close();
  };

  const handleDelete = () => {
    if (!editor) return;

    if (isImageSelected) {
      editor.chain().focus().deleteSelection().run();
      close();
      return;
    }

    if (!hasTextSelection) return;
    restoreSelection();
    const { from, to } = savedSelection.current!;
    editor.chain().focus().deleteRange({ from, to }).run();
    close();
  };

  const handleSetLink = () => {
    if (!editor || !hasTextSelection) return;
    restoreSelection();
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Havola URL", prev ?? "https://");
    if (url === null) {
      close();
      return;
    }
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    close();
  };

  const handleProofread = async () => {
    if (!editor || !hasTextSelection || !settings.aiAssistEnabled) return;
    restoreSelection();
    const { from, to } = savedSelection.current!;
    const selectedText = editor.state.doc.textBetween(from, to);
    if (!selectedText.trim()) return;

    setIsProofreading(true);
    try {
      const corrected = await fetchAiProofread(selectedText, accessToken);
      if (corrected === selectedText) {
        toast.success("Imlo xatosi topilmadi");
        close();
        return;
      }
      editor
        .chain()
        .focus()
        .insertContentAt({ from, to }, corrected)
        .run();
      toast.success("Matn AI bilan to'g'rilandi");
    } catch {
      toast.error("AI to'g'rilashda xatolik");
    } finally {
      setIsProofreading(false);
      close();
    }
  };

  const setImageAlign = (align: ImageAlign) => {
    if (!editor) return;
    editor.chain().focus().setImageAlign(align).run();
    close();
  };

  if (!open || !editor) return null;

  const menuStyle = {
    top: Math.min(position.y, window.innerHeight - 320),
    left: Math.min(position.x, window.innerWidth - 240),
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] min-w-[13rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
      style={menuStyle}
      onContextMenu={(event) => event.preventDefault()}
    >
      {hasTextSelection ? (
        <>
          <ContextMenuItem
            icon={<BoldIcon />}
            label="Qalin"
            onClick={() =>
              runWithSelection(() => editor.chain().focus().toggleBold().run())
            }
          />
          <ContextMenuItem
            icon={<ItalicIcon />}
            label="Kursiv"
            onClick={() =>
              runWithSelection(() => editor.chain().focus().toggleItalic().run())
            }
          />
          <ContextMenuItem
            icon={<UnderlineIcon />}
            label="Tag chiziq"
            onClick={() =>
              runWithSelection(() =>
                editor.chain().focus().toggleUnderline().run(),
              )
            }
          />
          <ContextMenuItem
            icon={<LinkIcon />}
            label="Havola"
            onClick={handleSetLink}
          />
          <ContextMenuItem
            icon={<PaletteIcon />}
            label="Rang"
            onClick={() => setShowColors((value) => !value)}
          />
          {showColors ? (
            <div className="flex flex-wrap gap-1 px-2 py-1.5">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.label}
                  type="button"
                  title={color.label}
                  className="size-6 rounded-md border border-border transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color.value || "var(--background)",
                  }}
                  onClick={() =>
                    runWithSelection(() => {
                      if (!color.value) {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(color.value).run();
                      }
                    })
                  }
                />
              ))}
            </div>
          ) : null}
          <ContextMenuSeparator />
          <ContextMenuItem
            icon={<CopyIcon />}
            label="Nusxa olish"
            onClick={() => void handleCopy()}
          />
          <ContextMenuItem
            icon={<ScissorsIcon />}
            label="Kesib olish"
            onClick={handleCut}
          />
          {settings.aiAssistEnabled ? (
            <ContextMenuItem
              icon={<SparklesIcon />}
              label={isProofreading ? "To'g'rilanmoqda..." : "AI bilan to'g'rilash"}
              disabled={isProofreading}
              onClick={() => void handleProofread()}
            />
          ) : null}
          <ContextMenuSeparator />
          <ContextMenuItem
            icon={<Trash2Icon />}
            label="O'chirish"
            variant="destructive"
            onClick={handleDelete}
          />
        </>
      ) : isImageSelected ? (
        <>
          <ContextMenuItem
            icon={<AlignLeftIcon />}
            label="Chapga — matn o'rash"
            onClick={() => setImageAlign("left")}
          />
          <ContextMenuItem
            icon={<AlignCenterIcon />}
            label="Markazga"
            onClick={() => setImageAlign("center")}
          />
          <ContextMenuItem
            icon={<AlignRightIcon />}
            label="O'ngga — matn o'rash"
            onClick={() => setImageAlign("right")}
          />
          <ContextMenuSeparator />
          <ContextMenuItem
            icon={<Trash2Icon />}
            label="Rasmni o'chirish"
            variant="destructive"
            onClick={handleDelete}
          />
        </>
      ) : (
        <ContextMenuItem
          icon={<CopyIcon />}
          label="Nusxa olish"
          disabled
          onClick={() => undefined}
        />
      )}
    </div>
  );
}

function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  disabled,
  variant = "default",
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        variant === "destructive" &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
      onClick={onClick}
    >
      <span
        aria-hidden
        className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 leading-none">{label}</span>
    </button>
  );
}
