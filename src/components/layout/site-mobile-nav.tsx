"use client";

import { usePathname } from "next/navigation";
import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";
import { FastNavPill, FastNavTab } from "@/components/layout/sidebar-nav-link";
import { isMainNavActive } from "@/config/navigation";
import { useMainNavOrder } from "@/hooks/use-sidebar-nav-order";
import { feedMobileInsetClassName } from "@/lib/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const allTopicsHref = "/";

export function SiteMobileNav() {
  const pathname = usePathname();
  const { topicNavItems, isLoading } = useTopicNavItems();
  const { items: mainItems } = useMainNavOrder();

  const isTopicActive = (href: string) => {
    if (href === allTopicsHref) {
      return pathname === "/" || pathname === "/yangi" || pathname === "/lenta" || pathname === "/maqolalar";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isFeedActive = (href: string) => isMainNavActive(pathname, href);
  const hideTopicPills = pathname === "/maqolalar";

  return (
    <nav
      className="sticky top-14 z-30 space-y-2 bg-background pt-3 md:hidden"
      aria-label="Mobil navigatsiya"
    >
      {!hideTopicPills ? (
      <div
        className={cn(
          "flex gap-2 overflow-x-auto",
          feedMobileInsetClassName,
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <FastNavPill
          href={allTopicsHref}
          label="Barchasi"
          isActive={isTopicActive(allTopicsHref)}
        />
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 shrink-0 rounded-full" />
          ))
        ) : (
          topicNavItems.map((item) => (
            <FastNavPill
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isTopicActive(item.href)}
            />
          ))
        )}
      </div>
      ) : null}

      <div
        className={cn(
          "flex gap-5 overflow-x-auto pb-3",
          feedMobileInsetClassName,
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {mainItems.map((item) => (
          <FastNavTab
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isFeedActive(item.href)}
          />
        ))}
      </div>
    </nav>
  );
}
