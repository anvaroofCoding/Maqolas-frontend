"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import {
  appShellGridStyle,
  appShellGridTwoColClassName,
  appShellGridWriteClassName,
  appShellGridWithRightSidebarClassName,
  feedColumnScrollClassName,
  feedMainColumnClassName,
  feedSidebarColumnClassName,
  rightSidebarWidthClass,
  sidebarWidthClass,
  writeColumnAlignClassName,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { shouldShowMobileDock } from "@/lib/mobile-dock";
import { SiteSeoFooter } from "@/components/seo/site-seo-footer";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
import { WriteLayoutSpacer } from "@/components/layout/write-layout-spacer";

function shouldShowSeoFooter(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname === "/maqolalar" ||
    pathname === "/rasmlar" ||
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

function isPinRoute(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/rasmlar" || pathname.startsWith("/rasm/");
}

function shouldShowMobileNav(pathname: string | null) {
  if (!pathname) return false;
  return (
    !pathname.startsWith("/yozish") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/profil") &&
    !pathname.startsWith("/maqola") &&
    !isPinRoute(pathname) &&
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
    pathname === "/rasmlar" ||
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
  const showMobileDock = shouldShowMobileDock(pathname);
  const isPinPage = isPinRoute(pathname);
  const showRightSidebar = shouldShowRightSidebar(pathname);
  const showLeftSidebar = !isWriting;
  const useWriteLayout = isWriting;
  const writeTopOffset =
    isWriting && chromeHidden ? "pt-2" : "pt-14";
  const centerScrollClassName = isWriting
    ? cn(
        "scrollbar-hidden min-w-0 md:h-full md:overflow-y-auto md:overscroll-contain",
        writeTopOffset,
      )
    : feedColumnScrollClassName;
  const centerInnerClassName = isWriting
    ? writeColumnAlignClassName
    : feedMainColumnClassName;

  const appShellGridClassName = showRightSidebar
    ? appShellGridWithRightSidebarClassName
    : appShellGridTwoColClassName;

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
        data-site-shell
        className={cn(
          "grid min-h-0 min-w-0 items-start overflow-x-hidden bg-background md:min-h-screen md:h-screen md:overflow-hidden",
          useWriteLayout ? appShellGridWriteClassName : appShellGridClassName,
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
            <div className={feedSidebarColumnClassName}>
              <SiteSidebar />
            </div>
          </div>
        ) : useWriteLayout ? (
          <WriteLayoutSpacer side="left" />
        ) : null}

        <div className={cn(centerScrollClassName, isWriting && "md:h-full")}>
          <div
            className={cn(
              centerInnerClassName,
              isPinPage && "max-md:pt-3",
              showMobileDock &&
                !showSeoFooter &&
                "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-6",
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
            <div className={feedSidebarColumnClassName}>
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
