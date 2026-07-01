"use client";

import { usePathname } from "next/navigation";
import { FastNavPill } from "@/components/layout/sidebar-nav-link";
import type { ArticleCategory } from "@/features/articles/types";
import { cn } from "@/lib/utils";

type MaqolalarTopicLinksProps = {
  categories: ArticleCategory[];
};

export function MaqolalarTopicLinks({ categories }: MaqolalarTopicLinksProps) {
  const pathname = usePathname();

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Mavzu bo'yicha maqolalar"
      className="mb-4 pt-2 md:mb-5 md:pt-3"
    >
      <p className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground">
        Mavzu bo&apos;yicha maqolalar
      </p>

      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {categories.map((category) => {
          const href = `/mavzu/${category.slug}`;
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <FastNavPill
              key={category.slug}
              href={href}
              label={category.name}
              isActive={isActive}
            />
          );
        })}
      </div>
    </nav>
  );
}
