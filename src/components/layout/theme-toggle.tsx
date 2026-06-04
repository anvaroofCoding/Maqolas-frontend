"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
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
          mounted && isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 opacity-100",
        )}
      />
      <MoonIcon
        className={cn(
          "absolute size-4 text-current transition-all",
          mounted && isDark ? "scale-100 opacity-100" : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </Button>
  );
}
