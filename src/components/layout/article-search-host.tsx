"use client";

import { useEffect, useState } from "react";
import { ArticleSearchDialog } from "@/components/layout/article-search-dialog";
import { OPEN_SEARCH_EVENT } from "@/lib/keyboard-shortcuts/types";

export function ArticleSearchHost() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleOpen = () => setOpen(true);
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, handleOpen);
  }, [mounted]);

  if (!mounted) return null;

  return <ArticleSearchDialog open={open} onOpenChange={setOpen} />;
}
