"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const tooltipLabel = !mounted
    ? "Mavzu rejimi"
    : isDark
      ? "Yorug' rejim"
      : "Qorong'i rejim";

  return (
    <NavbarTooltip
      label={tooltipLabel}
      hint="Yorug' / qorong'i almashtirish"
      disabled={!mounted}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("relative", className)}
        aria-label={
          !mounted
            ? "Mavzu rejimini almashtirish"
            : isDark
              ? "Yorug‘ rejim"
              : "Qorong‘u rejim"
        }
        onClick={() => setTheme(isDark ? "light" : "dark")}
        disabled={!mounted}
      >
        <SunIcon
          className={cn(
            "size-4 text-current transition-all",
            mounted && isDark ? "scale-100 opacity-100" : "scale-0 rotate-90 opacity-0",
          )}
        />
        <MoonIcon
          className={cn(
            "absolute size-4 text-current transition-all",
            mounted && isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 opacity-100",
          )}
        />
      </Button>
    </NavbarTooltip>
  );
}
