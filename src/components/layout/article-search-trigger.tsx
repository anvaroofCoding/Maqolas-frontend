"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ArticleSearchDialog } from "@/components/layout/article-search-dialog";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { Button } from "@/components/ui/button";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ArticleSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted]);

  return (
    <>
      <NavbarTooltip label="Qidiruv" hint="Ctrl + K">
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
      </NavbarTooltip>

      {mounted ? (
        <ArticleSearchDialog open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
