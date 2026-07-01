"use client";

import { useEffect, useState } from "react";
import { PromoReaderModal } from "@/components/promo-reader/promo-reader-modal";
import { OPEN_RANDOM_ARTICLE_EVENT } from "@/lib/keyboard-shortcuts/types";

export function PromoReaderHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(OPEN_RANDOM_ARTICLE_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_RANDOM_ARTICLE_EVENT, handleOpen);
  }, []);

  return <PromoReaderModal open={open} onOpenChange={setOpen} />;
}
