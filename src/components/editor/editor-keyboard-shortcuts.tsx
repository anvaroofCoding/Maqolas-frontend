"use client";

import { KeyboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SHORTCUTS = [
  { keys: "Ctrl + B", action: "Qalin" },
  { keys: "Ctrl + I", action: "Kursiv" },
  { keys: "Ctrl + U", action: "Tag chiziq" },
  { keys: "Ctrl + Shift + S", action: "Chizilgan" },
  { keys: "Ctrl + E", action: "Kod" },
  { keys: "Ctrl + Shift + H", action: "Ajratish (highlight)" },
  { keys: "Ctrl + Shift + P", action: "Spoiler (yashirin matn)" },
  { keys: "Ctrl + Alt + 1/2/3", action: "Sarlavha 1/2/3" },
  { keys: "Ctrl + Shift + 7", action: "Raqamli ro'yxat" },
  { keys: "Ctrl + Shift + 8", action: "Ro'yxat" },
  { keys: "Ctrl + Shift + 9", action: "Vazifa ro'yxati" },
  { keys: "Ctrl + Z", action: "Bekor qilish" },
  { keys: "Ctrl + Y", action: "Qaytarish" },
  { keys: "Ctrl + F", action: "Qidirish va almashtirish" },
  { keys: "/", action: "Tezkor buyruqlar menyusi" },
  { keys: "Tab", action: "AI taklifini qabul qilish" },
  { keys: "Esc", action: "AI taklifini yopish" },
];

const MARKDOWN_HINTS = [
  { keys: "# ", action: "Sarlavha 1" },
  { keys: "## ", action: "Sarlavha 2" },
  { keys: "### ", action: "Sarlavha 3" },
  { keys: "- yoki * ", action: "Ro'yxat" },
  { keys: "1. ", action: "Raqamli ro'yxat" },
  { keys: "> ", action: "Iqtibos" },
  { keys: "---", action: "Gorizontal chiziq" },
  { keys: "```", action: "Kod bloki" },
  { keys: "**matn**", action: "Qalin" },
  { keys: "_matn_", action: "Kursiv" },
  { keys: "`kod`", action: "Inline kod" },
  { keys: "||matn||", action: "Spoiler" },
  { keys: "[ ] ", action: "Vazifa ro'yxati" },
];

export function EditorKeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs text-muted-foreground"
          title="Klaviatura tugmalari"
        >
          <KeyboardIcon className="size-3.5" />
          <span className="hidden sm:inline">Tugmalar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Klaviatura va Markdown</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <section>
            <h3 className="mb-2 text-sm font-semibold">Tezkor tugmalar</h3>
            <ul className="space-y-2 text-sm">
              {SHORTCUTS.map((item) => (
                <li
                  key={item.keys}
                  className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                >
                  <span className="text-muted-foreground">{item.action}</span>
                  <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs">
                    {item.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-semibold">Markdown qisqa yo&apos;llar</h3>
            <ul className="space-y-2 text-sm">
              {MARKDOWN_HINTS.map((item) => (
                <li
                  key={item.keys}
                  className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                >
                  <span className="text-muted-foreground">{item.action}</span>
                  <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs">
                    {item.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
