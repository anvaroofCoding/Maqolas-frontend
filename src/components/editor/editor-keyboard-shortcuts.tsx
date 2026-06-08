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
  { keys: "Ctrl + Alt + 1/2/3", action: "Sarlavha 1/2/3" },
  { keys: "Ctrl + Shift + 7", action: "Raqamli ro'yxat" },
  { keys: "Ctrl + Shift + 8", action: "Ro'yxat" },
  { keys: "Ctrl + Shift + 9", action: "Vazifa ro'yxati" },
  { keys: "Ctrl + Z", action: "Bekor qilish" },
  { keys: "Ctrl + Y", action: "Qaytarish" },
  { keys: "/", action: "Tezkor buyruqlar menyusi" },
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Klaviatura tugmalari</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
