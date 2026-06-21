"use client";

import { MegaphoneIcon } from "lucide-react";
import { useState } from "react";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { PromoReaderModal } from "@/components/promo-reader/promo-reader-modal";
import { Button } from "@/components/ui/button";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function PromoReaderTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavbarTooltip label="Random maqola" hint="Tasodifiy maqola tanlash">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(navIconButtonClass, className)}
          aria-label="Mashhur maqolalarni ko'rish"
          onClick={() => setOpen(true)}
        >
          <MegaphoneIcon className="size-4" />
        </Button>
      </NavbarTooltip>

      <PromoReaderModal open={open} onOpenChange={setOpen} />
    </>
  );
}
