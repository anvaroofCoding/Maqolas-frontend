"use client";

import { SearchIcon } from "lucide-react";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { Button } from "@/components/ui/button";
import { OPEN_SEARCH_EVENT } from "@/lib/keyboard-shortcuts/types";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ArticleSearchTrigger() {
  return (
    <NavbarTooltip label="Qidiruv" hint="Ctrl + K">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(navIconButtonClass)}
        aria-label="Maqolalarni qidirish"
        onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))}
      >
        <SearchIcon />
      </Button>
    </NavbarTooltip>
  );
}
