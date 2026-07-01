"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";
import type { NavItem } from "@/config/navigation";
import { moveSidebarItem } from "@/lib/navigation/sidebar-order";
import { cn } from "@/lib/utils";

type SidebarSortableListProps = {
  items: NavItem[];
  onReorder: (items: NavItem[]) => void;
  isActive: (href: string) => boolean;
};

export function SidebarSortableList({
  items,
  onReorder,
  isActive,
}: SidebarSortableListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const suppressClickRef = useRef(false);

  const finishDrag = useCallback(() => {
    document.body.classList.remove("is-sidebar-dragging");
    setDragIndex(null);
    setOverIndex(null);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }, []);

  const handleDragStart = useCallback(
    (index: number) => (event: DragEvent<HTMLDivElement>) => {
      document.body.classList.add("is-sidebar-dragging");
      suppressClickRef.current = true;
      setDragIndex(index);
      setOverIndex(index);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", items[index]?.href ?? String(index));
    },
    [items],
  );

  const handleDragOver = useCallback(
    (index: number) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (dragIndex === null || dragIndex === index) return;
      setOverIndex(index);
    },
    [dragIndex],
  );

  const handleDrop = useCallback(
    (index: number) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (dragIndex === null || dragIndex === index) {
        finishDrag();
        return;
      }

      onReorder(moveSidebarItem(items, dragIndex, index));
      finishDrag();
    },
    [dragIndex, finishDrag, items, onReorder],
  );

  const isDragging = dragIndex !== null;

  return (
    <>
      {items.map((item, index) => (
        <div
          key={item.href}
          draggable
          onDragStart={handleDragStart(index)}
          onDragEnd={finishDrag}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop(index)}
          onClickCapture={(event) => {
            if (suppressClickRef.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className={cn(
            "rounded-lg transition-[opacity,box-shadow,background-color]",
            isDragging && dragIndex === index && "opacity-50 shadow-md ring-2 ring-primary/35",
            isDragging &&
              overIndex === index &&
              dragIndex !== index &&
              "bg-muted/60",
          )}
        >
          <SidebarNavLink
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isActive(item.href)}
            badgeText={item.badgeText}
            suppressNavigation={isDragging}
          />
        </div>
      ))}
    </>
  );
}
