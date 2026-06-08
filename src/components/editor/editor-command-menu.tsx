"use client";

import type { Editor } from "@tiptap/react";
import {
  AlertTriangleIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  LightbulbIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  SparklesIcon,
  StarIcon,
  TableIcon,
  YoutubeIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CalloutVariant } from "@/lib/editor/callout-extension";
import { insertTableOfContents } from "@/lib/editor/insert-table-of-contents";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  keywords: string[];
  icon: React.ReactNode;
  run: (editor: Editor) => void;
};

interface EditorCommandMenuProps {
  editor: Editor | null;
  onImageClick?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
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

function buildCommands(onImageClick: () => void): CommandItem[] {
  return [
    {
      id: "h1",
      label: "Sarlavha 1",
      keywords: ["sarlavha", "heading", "h1"],
      icon: <Heading1Icon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      label: "Sarlavha 2",
      keywords: ["sarlavha", "heading", "h2"],
      icon: <Heading2Icon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "h3",
      label: "Sarlavha 3",
      keywords: ["sarlavha", "heading", "h3"],
      icon: <Heading3Icon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: "bullet",
      label: "Ro'yxat",
      keywords: ["list", "ro'yxat"],
      icon: <ListIcon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      id: "ordered",
      label: "Raqamli ro'yxat",
      keywords: ["ordered", "raqam"],
      icon: <ListOrderedIcon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      id: "task",
      label: "Vazifa ro'yxati",
      keywords: ["task", "checkbox", "vazifa"],
      icon: <ListChecksIcon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
      id: "quote",
      label: "Iqtibos",
      keywords: ["blockquote", "iqtibos"],
      icon: <QuoteIcon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      id: "code",
      label: "Kod bloki",
      keywords: ["code", "kod"],
      icon: <CodeIcon className="size-4" />,
      run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      id: "hr",
      label: "Gorizontal chiziq",
      keywords: ["hr", "chiziq"],
      icon: <MinusIcon className="size-4" />,
      run: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      id: "table",
      label: "Jadval (3×3)",
      keywords: ["table", "jadval"],
      icon: <TableIcon className="size-4" />,
      run: (editor) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      id: "toc",
      label: "Avtomatik mundarija",
      keywords: ["toc", "mundarija", "index"],
      icon: <SparklesIcon className="size-4" />,
      run: (editor) => {
        const ok = insertTableOfContents(editor);
        if (!ok) toast.error("Mundarija uchun kamida bitta sarlavha kerak");
      },
    },
    {
      id: "callout-tip",
      label: "Maslahat bloki",
      keywords: ["maslahat", "tip", "callout"],
      icon: <LightbulbIcon className="size-4" />,
      run: (editor) => insertCallout(editor, "tip"),
    },
    {
      id: "callout-warning",
      label: "Ogohlantirish bloki",
      keywords: ["ogohlantirish", "warning"],
      icon: <AlertTriangleIcon className="size-4" />,
      run: (editor) => insertCallout(editor, "warning"),
    },
    {
      id: "callout-important",
      label: "Muhim bloki",
      keywords: ["muhim", "important"],
      icon: <StarIcon className="size-4" />,
      run: (editor) => insertCallout(editor, "important"),
    },
    {
      id: "youtube",
      label: "YouTube video",
      keywords: ["youtube", "video"],
      icon: <YoutubeIcon className="size-4" />,
      run: (editor) => {
        const url = window.prompt("YouTube havolasi", "https://www.youtube.com/watch?v=");
        if (!url) return;
        editor.commands.setYoutubeVideo({ src: url });
      },
    },
    {
      id: "image",
      label: "Rasm yuklash",
      keywords: ["image", "rasm"],
      icon: <ImageIcon className="size-4" />,
      run: () => onImageClick(),
    },
  ];
}

export function EditorCommandMenu({
  editor,
  onImageClick,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: EditorCommandMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const commands = useMemo(
    () => buildCommands(() => onImageClick?.()),
    [onImageClick],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.keywords.some((kw) => kw.includes(q)),
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!editor || !open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const { $from } = editor.state.selection;
        const parentText = $from.parent.textContent;
        const atParagraphStart = $from.parentOffset === 0;
        const paragraphEmpty = parentText.length === 0;

        if (atParagraphStart && paragraphEmpty) {
          event.preventDefault();
          setOpen(true);
        }
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("keydown", handleKeyDown);
    return () => dom.removeEventListener("keydown", handleKeyDown);
  }, [editor, open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const runCommand = (cmd: CommandItem) => {
    if (!editor) return;
    cmd.run(editor);
    setOpen(false);
    setQuery("");
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (!filtered.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {showTrigger ? (
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs font-medium text-muted-foreground"
            title="Tezkor buyruqlar (/)"
          >
            <span className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              /
            </span>
            <span className="hidden sm:inline">Buyruqlar</span>
          </Button>
        </PopoverTrigger>
      ) : (
        <PopoverAnchor />
      )}

      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b border-border p-2">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleListKeyDown}
            placeholder="Qidirish yoki tanlash..."
            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <ul className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              Topilmadi
            </li>
          ) : (
            filtered.map((cmd, index) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                    index === activeIndex
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runCommand(cmd)}
                >
                  {cmd.icon}
                  {cmd.label}
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
