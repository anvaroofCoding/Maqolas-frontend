"use client";

import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { useSiteFocusMode } from "@/components/layout/site-focus-mode-provider";
import { Button } from "@/components/ui/button";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

type SiteFocusToggleProps = {
  className?: string;
};

export function SiteFocusToggle({ className }: SiteFocusToggleProps) {
  const { active, toggle } = useSiteFocusMode();

  return (
    <NavbarTooltip
      label={active ? "Fokusdan chiqish" : "Fokus rejimi"}
      hint={
        active
          ? "Ekranni kichiklashtirish"
          : "Saytni butun ekranga kengaytirish"
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(navIconButtonClass, className)}
        aria-label={active ? "Fokusdan chiqish" : "Fokus rejimi"}
        aria-pressed={active}
        onClick={() => void toggle()}
      >
        {active ? (
          <Minimize2Icon className="size-4" aria-hidden />
        ) : (
          <Maximize2Icon className="size-4" aria-hidden />
        )}
      </Button>
    </NavbarTooltip>
  );
}
