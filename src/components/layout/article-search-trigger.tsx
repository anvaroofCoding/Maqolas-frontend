"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ArticleSearchDialog } from "@/components/layout/article-search-dialog";
import { Button } from "@/components/ui/button";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ArticleSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(navIconButtonClass)}
        aria-label="Maqolalarni qidirish"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>

      <ArticleSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
