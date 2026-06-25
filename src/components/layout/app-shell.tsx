"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import {
  appShellGridClassName,
  appShellGridStyle,
  feedColumnAlignClassName,
  feedColumnScrollClassName,
  rightSidebarWidthClass,
  sidebarWidthClass,
  writeColumnAlignClassName,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { WriteLayoutSpacer } from "@/components/layout/write-layout-spacer";
import { SiteSeoFooter } from "@/components/seo/site-seo-footer";
import { useWriteChrome } from "@/components/editor/write-chrome-context";

function shouldShowSeoFooter(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname === "/maqolalar" ||
    pathname === "/yangi" ||
    pathname === "/mavzular" ||
    pathname.startsWith("/mavzu/") ||
    isLegalInfoRoute(pathname)
  );
}

function isLegalInfoRoute(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/dastur-haqida" ||
    pathname === "/foydalanish-shartlari" ||
    pathname === "/maxfiylik-siyosati"
  );
}

function shouldShowMobileNav(pathname: string | null) {
  if (!pathname) return false;
  return (
    !pathname.startsWith("/yozish") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/profil") &&
    !pathname.startsWith("/maqola") &&
    !pathname.startsWith("/auth") &&
    !isLegalInfoRoute(pathname)
  );
}

function isWriteRoute(pathname: string | null) {
  if (!pathname) return false;
  return pathname.startsWith("/yozish");
}

function shouldShowRightSidebar(pathname: string | null) {
  if (!pathname || isWriteRoute(pathname)) return false;
  return (
    pathname === "/" ||
    pathname === "/maqolalar" ||
    pathname === "/yangi" ||
    pathname === "/lenta" ||
    pathname === "/mavzular" ||
    pathname.startsWith("/mavzu/") ||
    pathname.startsWith("/maqola/")
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { chromeHidden } = useWriteChrome();
  const showSeoFooter = shouldShowSeoFooter(pathname);
  const isAdminRoute = pathname?.startsWith("/admin");
  const isWriting = isWriteRoute(pathname);
  const showMobileNav = shouldShowMobileNav(pathname);
  const showRightSidebar = shouldShowRightSidebar(pathname);
  const showLeftSidebar = !isWriting;
  const useWriteLayout = isWriting;
  const isFeedLayout = showMobileNav;
  const useFeedTopPadding = isFeedLayout || isLegalInfoRoute(pathname);
  const writeTopOffset =
    isWriting && chromeHidden ? "pt-2" : "pt-14";

  if (isAdminRoute) {
    return (
      <SiteContainer className="min-h-screen px-4 pb-6 pt-[calc(3.5rem+1.5rem)] sm:px-6 sm:pb-8 md:px-4 xl:px-6 2xl:px-8">
        {children}
      </SiteContainer>
    );
  }

  return (
    <SiteContainer>
      <div
        className={cn(
          "grid min-h-screen min-w-0 items-start overflow-x-hidden bg-background md:h-screen md:overflow-hidden",
          useWriteLayout || showRightSidebar
            ? appShellGridClassName
            : "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]",
        )}
        style={appShellGridStyle}
      >
        {showLeftSidebar ? (
          <div
            className={cn(
              feedColumnScrollClassName,
              "hidden md:block",
              sidebarWidthClass,
            )}
          >
            <div className={feedColumnAlignClassName}>
              <SiteSidebar />
            </div>
          </div>
        ) : useWriteLayout ? (
          <WriteLayoutSpacer side="left" />
        ) : null}

        <div
          className={cn(
            "scrollbar-hidden min-w-0 md:h-full md:overflow-y-auto md:overscroll-contain",
            writeTopOffset,
            isWriting && "md:h-full",
          )}
        >
          <div
            className={cn(
              useFeedTopPadding && feedColumnAlignClassName,
              isWriting && writeColumnAlignClassName,
            )}
          >
            {showMobileNav ? (
              <div className="md:hidden">
                <SiteMobileNav />
              </div>
            ) : null}
            {children}
            {showSeoFooter ? <SiteSeoFooter /> : null}
          </div>
        </div>

        {showRightSidebar ? (
          <div
            className={cn(
              feedColumnScrollClassName,
              "hidden lg:block",
              rightSidebarWidthClass,
            )}
          >
            <div className={feedColumnAlignClassName}>
              <SiteRightSidebar />
            </div>
          </div>
        ) : useWriteLayout ? (
          <WriteLayoutSpacer side="right" />
        ) : null}
      </div>
    </SiteContainer>
  );
}
