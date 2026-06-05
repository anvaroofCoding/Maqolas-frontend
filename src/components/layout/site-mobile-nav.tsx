"use client";

import { usePathname } from "next/navigation";
import { FeedTab, TopicPill } from "@/components/layout/nav-menu-styles";
import { isMainNavActive, mainNavItems, topicNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

const allTopicsHref = "/";

export function SiteMobileNav() {
  const pathname = usePathname();

  const isTopicActive = (href: string) => {
    if (href === allTopicsHref) {
      return pathname === "/" || pathname === "/yangi" || pathname === "/lenta";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isFeedActive = (href: string) => isMainNavActive(pathname, href);

  return (
    <nav
      className="sticky top-14 z-30 space-y-2 bg-background pt-3 md:hidden"
      aria-label="Mobil navigatsiya"
    >
      <div
        className={cn(
          "flex gap-2 overflow-x-auto px-4",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <TopicPill
          href={allTopicsHref}
          label="Barchasi"
          isActive={isTopicActive(allTopicsHref)}
        />
        {topicNavItems.map((item) => (
          <TopicPill
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isTopicActive(item.href)}
          />
        ))}
      </div>

      <div className="flex gap-5 px-4 pb-3">
        {mainNavItems.map((item) => (
          <FeedTab
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
