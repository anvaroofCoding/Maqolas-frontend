"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isMainNavActive, mainNavItems, topicNavItems } from "@/config/navigation";
import { Button } from "@/components/ui/button";
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

  const isActive = (href: string) => {
    if (href.startsWith("/mavzu/")) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    return isMainNavActive(pathname, href);
  };

  return (
    <aside
      className={cn(
        "sticky top-14 z-40 w-full shrink-0 self-start bg-transparent",
        sidebarWidthClass,
      )}
      aria-label="Yon menyu"
    >
      <nav className="flex max-h-[calc(100vh-3.5rem)] flex-col gap-1 overflow-y-auto pb-4 pr-2">
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

        {topicNavItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            {...item}
            isActive={isActive(item.href)}
          />
        ))}
      </nav>
    </aside>
  );
}
