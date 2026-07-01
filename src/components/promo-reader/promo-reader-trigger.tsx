"use client";

import { MegaphoneIcon } from "lucide-react";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { Button } from "@/components/ui/button";
import { OPEN_RANDOM_ARTICLE_EVENT } from "@/lib/keyboard-shortcuts/types";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function PromoReaderTrigger({ className }: { className?: string }) {
  return (
    <>
      <NavbarTooltip label="Random maqola" hint="Alt + Shift + R">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(navIconButtonClass, className)}
          aria-label="Mashhur maqolalarni ko'rish"
          data-tour="random-article"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(OPEN_RANDOM_ARTICLE_EVENT))
          }
        >
          <MegaphoneIcon className="size-4" />
        </Button>
      </NavbarTooltip>
    </>
  );
}
