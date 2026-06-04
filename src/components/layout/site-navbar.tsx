"use client";

import { BellIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/config/site";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

const writeButtonClass =
  "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground";

export function SiteNavbar() {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-navbar-border",
        "bg-navbar/90 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-navbar/75",
        "shadow-[0_1px_0_0_var(--navbar-shadow)]",
      )}
    >
      <SiteContainer className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="group rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="inline-flex items-start leading-none">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
            <Badge
              className="-mt-2 ml-0.5 h-4 shrink-0 border-transparent bg-nav-active px-1.5 text-[10px] font-normal uppercase text-nav-active-foreground hover:bg-nav-active-hover"
            >
              beta
            </Badge>
          </span>
        </Link>

        <nav
          className="flex items-center gap-0.5 sm:gap-1"
          aria-label="Asosiy navigatsiya"
        >
          <ThemeToggle className={navIconButtonClass} />

          <Button
            variant="default"
            size="sm"
            className={cn("ml-1 hidden sm:inline-flex", writeButtonClass)}
          >
            <PenLineIcon data-icon="inline-start" />
            Yozish
          </Button>
          <Button
            variant="default"
            size="icon-sm"
            className={cn("ml-1 sm:hidden", writeButtonClass)}
            aria-label="Yozish"
          >
            <PenLineIcon />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("relative", navIconButtonClass)}
            aria-label="Bildirishnomalar"
          >
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-nav-active ring-2 ring-background" />
          </Button>

          <ProfileMenu />
        </nav>
      </SiteContainer>
    </header>
  );
}
