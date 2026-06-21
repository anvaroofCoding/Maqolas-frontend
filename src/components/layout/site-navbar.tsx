"use client";

import { PenLineIcon } from "lucide-react";
import Link from "next/link";
import { NotificationPopover } from "@/components/notifications/notification-popover";
import { ArticleSearchTrigger } from "@/components/layout/article-search-trigger";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { NavbarWeather } from "@/components/layout/navbar-weather";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { PromoReaderTrigger } from "@/components/promo-reader/promo-reader-trigger";
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
        "fixed inset-x-0 top-0 z-50 overflow-visible border-b border-navbar-border",
        "bg-navbar/90 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-navbar/75",
        "shadow-[0_1px_0_0_var(--navbar-shadow)]",
      )}
    >
      <SiteContainer className="flex h-14 w-full max-w-none items-center justify-between gap-3 px-4 md:gap-4 md:px-4 xl:px-6">
        <Link
          href="/"
          className="group rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="inline-flex items-start leading-none">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
            <Badge className="-mt-2 ml-0.5 h-4 shrink-0 border-transparent bg-nav-active px-1.5 text-[10px] font-medium text-nav-active-foreground hover:bg-nav-active-hover">
              New
            </Badge>
          </span>
        </Link>

        <nav
          className="flex items-center gap-0.5 overflow-visible sm:gap-1"
          aria-label="Asosiy navigatsiya"
        >
          <NavbarWeather />
          <PromoReaderTrigger />
          <ThemeToggle className={navIconButtonClass} />

          <ArticleSearchTrigger />

          <NavbarTooltip
            label="Yangi maqola yozish"
            hint="Maqola yaratish sahifasi"
            className="ml-1 hidden sm:inline-flex"
          >
            <Button
              variant="default"
              size="sm"
              className={writeButtonClass}
              asChild
            >
              <Link href="/yozish">
                <PenLineIcon data-icon="inline-start" />
                Yozish
              </Link>
            </Button>
          </NavbarTooltip>
          <NavbarTooltip label="Yangi maqola yozish" className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={navIconButtonClass}
              aria-label="Yozish"
              asChild
            >
              <Link href="/yozish">
                <PenLineIcon />
              </Link>
            </Button>
          </NavbarTooltip>

          <NotificationPopover />

          <ProfileMenu />
        </nav>
      </SiteContainer>
    </header>
  );
}
