"use client";

import { PenLineIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
import { NotificationPopover } from "@/components/notifications/notification-popover";
import { ArticleSearchTrigger } from "@/components/layout/article-search-trigger";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { NavbarWeather } from "@/components/layout/navbar-weather";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { PromoReaderTrigger } from "@/components/promo-reader/promo-reader-trigger";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AiIcon } from "@/components/icons/ai-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFocusToggle } from "@/components/layout/site-focus-toggle";
import { SiteContainer } from "@/components/layout/site-container";
import { siteConfig } from "@/config/site";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

const writeButtonClass =
  "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground";

export function SiteNavbar() {
  const pathname = usePathname();
  const { chromeHidden, focusMode } = useWriteChrome();
  const hideOnWrite = pathname?.startsWith("/yozish") && (chromeHidden || focusMode);

  return (
    <header
      className={cn(
        "site-navbar fixed inset-x-0 top-0 z-50 overflow-visible transition-transform duration-300",
        "border-b border-navbar-border",
        hideOnWrite && "-translate-y-full pointer-events-none",
      )}
      data-site-chrome
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
          <div className="hidden items-center gap-0.5 sm:gap-1 md:flex">
            <NavbarWeather />
            <PromoReaderTrigger />
            <ThemeToggle className={navIconButtonClass} />

            <SiteFocusToggle />

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
                <Link href="/yozish" data-tour="write-button">
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
                <Link href="/yozish" data-tour="write-button">
                  <PenLineIcon />
                </Link>
              </Button>
            </NavbarTooltip>

            <NotificationPopover />
          </div>

          <NavbarWeather className="md:hidden" />

          <Button
            variant="ghost"
            size="icon"
            className={cn(navIconButtonClass, "md:hidden")}
            aria-label="AI maqola yordamchisi"
            data-tour="ai-assistant"
            asChild
          >
            <Link href="/ai">
              <AiIcon className="size-5" />
            </Link>
          </Button>

          <SiteFocusToggle className="md:hidden" />

          <ProfileMenu />
        </nav>
      </SiteContainer>
    </header>
  );
}
