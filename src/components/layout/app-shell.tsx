"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { SiteContainer } from "@/components/layout/site-container";
import { SiteMobileNav } from "@/components/layout/site-mobile-nav";
import { SiteRightSidebar } from "@/components/layout/site-right-sidebar";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import {
  feedColumnTopPaddingClass,
  rightSidebarWidthClass,
  sidebarWidthClass,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

function shouldShowMobileNav(pathname: string | null) {
  if (!pathname) return false;
  return (
    !pathname.startsWith("/yozish") &&
    !pathname.startsWith("/admin") &&
    pathname !== "/profil" &&
    !pathname.startsWith("/maqola") &&
    !pathname.startsWith("/auth")
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

  if (isEditorRoute || isAdminRoute) {
    return <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>;
  }

  return (
    <SiteContainer>
      <div
        className={cn(
          "grid min-h-[calc(100vh-3.5rem)] min-w-0 items-start overflow-x-hidden bg-background",
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
            "hidden min-w-0 md:block",
            isFeedLayout && feedColumnTopPaddingClass,
            sidebarWidthClass,
          )}
        >
          <SiteSidebar />
        </div>

        <div className={cn("min-w-0", isFeedLayout && feedColumnTopPaddingClass)}>
          {showMobileNav ? (
            <div className="md:hidden">
              <SiteMobileNav />
            </div>
          ) : null}
          {children}
        </div>

        {showRightSidebar ? (
          <div
            className={cn(
              "hidden min-w-0 lg:block",
              isFeedLayout && feedColumnTopPaddingClass,
              rightSidebarWidthClass,
            )}
          >
            <SiteRightSidebar />
          </div>
        ) : null}
      </div>
    </SiteContainer>
  );
}
