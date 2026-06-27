"use client";

import type { LucideIcon } from "lucide-react";
import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import { isMainNavActive, mainNavItems } from "@/config/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { sidebarWidthClass } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function SiteSidebar() {
  const pathname = usePathname();
  const { topicNavItems, isLoading } = useTopicNavItems();

  const isActive = (href: string) => {
    if (href.startsWith("/mavzu/")) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return isMainNavActive(pathname, href);
  };

  return (
    <aside
      className={cn("w-full shrink-0 bg-transparent", sidebarWidthClass)}
      aria-label="Yon menyu"
    >
      <nav className="flex flex-col gap-1 pb-4 pr-2 pt-0">
        {mainNavItems.map((item) => (
          <SidebarNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isActive(item.href)}
          />
        ))}

        <p className="mb-1 mt-4 px-3 text-sm font-semibold text-muted-foreground">
          Mavzular
        </p>

        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mx-3 h-10 rounded-lg" />
          ))
        ) : topicNavItems.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground">
            Hozircha mavzular yo&apos;q.
          </p>
        ) : (
          topicNavItems.map((item) => (
            <SidebarNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.href)}
            />
          ))
        )}
      </nav>
    </aside>
  );
}
