"use client";

import type { Editor } from "@tiptap/react";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  findNextMatch,
  findTextMatches,
  replaceAllMatches,
  replaceCurrentSelection,
  selectMatch,
} from "@/lib/editor/find-replace";
import { toast } from "@/lib/toast";

interface EditorFindReplaceProps {
  editor: Editor | null;
}

export function EditorFindReplace({ editor }: EditorFindReplaceProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  useEffect(() => {
    if (!editor || !search.trim()) {
      setMatchCount(0);
      return;
    }

    setMatchCount(findTextMatches(editor, search.trim(), caseSensitive).length);
  }, [editor, search, caseSensitive, open]);

  const handleFindNext = () => {
    if (!editor || !search.trim()) return;
    const match = findNextMatch(editor, search.trim(), caseSensitive, true);
    if (!match) {
      toast.info("Topilmadi");
      return;
    }
    selectMatch(editor, match);
  };

  const handleReplace = () => {
    if (!editor || !search.trim()) return;
    const count = replaceCurrentSelection(
      editor,
      search.trim(),
      replace,
      caseSensitive,
    );
    if (count === 0) {
      handleFindNext();
      return;
    }
    toast.success("Almashtirildi");
  };

  const handleReplaceAll = () => {
    if (!editor || !search.trim()) return;
    const count = replaceAllMatches(
      editor,
      search.trim(),
      replace,
      caseSensitive,
    );
    if (count === 0) {
      toast.info("Topilmadi");
      return;
    }
    toast.success(`${count} ta almashtirildi`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
          title="Qidirish va almashtirish (Ctrl+F)"
          aria-label="Qidirish va almashtirish"
        >
          <SearchIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Qidirish va almashtirish</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editor-find">Qidirish</Label>
            <Input
              id="editor-find"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Matn kiriting..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleFindNext();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editor-replace">Almashtirish</Label>
            <Input
              id="editor-replace"
              value={replace}
              onChange={(event) => setReplace(event.target.value)}
              placeholder="Yangi matn..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(event) => setCaseSensitive(event.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            Katta/kichik harfni farqlash
          </label>
          {search.trim() ? (
            <p className="text-xs text-muted-foreground">
              {matchCount > 0
                ? `${matchCount} ta moslik topildi`
                : "Moslik topilmadi"}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleFindNext}>
              Keyingisi
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleReplace}>
              Almashtirish
            </Button>
            <Button type="button" size="sm" onClick={handleReplaceAll}>
              Hammasini almashtirish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
