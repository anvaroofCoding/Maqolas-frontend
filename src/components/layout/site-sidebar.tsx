"use client";



import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";

import { SidebarSortableList } from "@/components/layout/sidebar-sortable-list";

import { isMainNavActive } from "@/config/navigation";

import { useMainNavOrder, useTopicNavOrder } from "@/hooks/use-sidebar-nav-order";

import { Skeleton } from "@/components/ui/skeleton";

import { sidebarWidthClass } from "@/lib/layout";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";



export function SiteSidebar() {

  const pathname = usePathname();

  const { topicNavItems, isLoading } = useTopicNavItems();

  const { items: mainItems, reorder: reorderMain } = useMainNavOrder();

  const { items: orderedTopics, reorder: reorderTopics } =

    useTopicNavOrder(topicNavItems);



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
      data-site-chrome
    >

      <nav className="flex flex-col gap-1 pb-4 pr-2 pt-0">

        <SidebarSortableList

          items={mainItems}

          onReorder={reorderMain}

          isActive={isActive}

        />



        <p className="mb-1 mt-4 px-3 text-sm font-semibold text-muted-foreground">

          Mavzular

        </p>



        {isLoading ? (

          Array.from({ length: 6 }).map((_, index) => (

            <Skeleton key={index} className="mx-3 h-10 rounded-lg" />

          ))

        ) : orderedTopics.length === 0 ? (

          <p className="px-3 text-xs text-muted-foreground">

            Hozircha mavzular yo&apos;q.

          </p>

        ) : (

          <SidebarSortableList

            items={orderedTopics}

            onReorder={reorderTopics}

            isActive={isActive}

          />

        )}

      </nav>

    </aside>

  );

}

