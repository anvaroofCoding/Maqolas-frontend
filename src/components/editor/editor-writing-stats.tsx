"use client";

import type { Editor } from "@tiptap/react";
import { ClockIcon, HashIcon, TypeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getWritingStats } from "@/lib/editor/writing-stats";
import { cn } from "@/lib/utils";

interface EditorWritingStatsProps {
  editor: Editor | null;
  className?: string;
}

export function EditorWritingStats({ editor, className }: EditorWritingStatsProps) {
  const [stats, setStats] = useState(() =>
    editor ? getWritingStats(editor) : null,
  );

  useEffect(() => {
    if (!editor) return;

    const update = () => setStats(getWritingStats(editor));
    update();
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  if (!stats) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1" title="So'zlar soni">
        <TypeIcon className="size-3" />
        {stats.words} so&apos;z
      </span>
      <span className="inline-flex items-center gap-1" title="Belgilar">
        <HashIcon className="size-3" />
        {stats.characters}
      </span>
      <span className="inline-flex items-center gap-1" title="Taxminiy o'qish vaqti">
        <ClockIcon className="size-3" />
        ~{stats.readingMinutes} daq
      </span>
    </div>
  );
}
