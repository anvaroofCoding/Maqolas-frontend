"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import {
  feedColumnScrollClassName,
  feedColumnTopPaddingClass,
  rightSidebarWidthClass,
  sidebarWidthClass,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

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

function shouldShowRightSidebar(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname === "/yangi" ||
    pathname === "/lenta" ||
    pathname === "/mavzular" ||
    pathname.startsWith("/mavzu/")
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditorRoute = pathname?.startsWith("/yozish");
  const isAdminRoute = pathname?.startsWith("/admin");
  const showMobileNav = shouldShowMobileNav(pathname);
  const showRightSidebar = shouldShowRightSidebar(pathname);
  const isFeedLayout = showMobileNav;
  const useFeedTopPadding = isFeedLayout || isLegalInfoRoute(pathname);

  if (isAdminRoute) {
    return (
      <SiteContainer className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6 sm:py-8 md:px-4 xl:px-6 2xl:px-8">
        {children}
      </SiteContainer>
    );
  }

  if (isEditorRoute) {
    return <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>;
  }

  return (
    <SiteContainer>
      <div
        className={cn(
          "grid min-h-[calc(100vh-3.5rem)] min-w-0 items-start overflow-x-hidden bg-background md:h-[calc(100vh-3.5rem)] md:overflow-hidden",
          showRightSidebar
            ? "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)_var(--right-sidebar-width)]"
            : "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]",
        )}
        style={
          {
            "--sidebar-width": "14rem",
            "--right-sidebar-width": "18rem",
          } as CSSProperties
        }
      >
        <div
          className={cn(
            feedColumnScrollClassName,
            "hidden md:block",
            sidebarWidthClass,
          )}
        >
          <div className={feedColumnTopPaddingClass}>
            <SiteSidebar />
          </div>
        </div>

        <div className={feedColumnScrollClassName}>
          <div className={cn(useFeedTopPadding && feedColumnTopPaddingClass)}>
            {showMobileNav ? (
              <div className="md:hidden">
                <SiteMobileNav />
              </div>
            ) : null}
            {children}
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
            <div className={feedColumnTopPaddingClass}>
              <SiteRightSidebar />
            </div>
          </div>
        ) : null}
      </div>
    </SiteContainer>
  );
}
