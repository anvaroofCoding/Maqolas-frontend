"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";
import { isMainNavActive, mainNavItems } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sidebarWidthClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

function SidebarNavItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "group h-10 w-full justify-start gap-3 rounded-lg px-3 font-normal",
        isActive
          ? "bg-nav-active text-nav-active-foreground shadow-sm hover:bg-nav-active-hover hover:text-nav-active-foreground"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/8",
      )}
      asChild
    >
      <Link href={href}>
        <Icon
          className={cn(
            "size-[18px] shrink-0 transition-colors",
            isActive
              ? "text-nav-active-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    </Button>
  );
}

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
          <SidebarNavItem
            key={item.href}
            {...item}
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
            <SidebarNavItem
              key={item.href}
              {...item}
              isActive={isActive(item.href)}
            />
          ))
        )}
      </nav>
    </aside>
  );
}
