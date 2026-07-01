"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mainNavItems, type NavItem } from "@/config/navigation";
import {
  applySidebarOrder,
  loadSidebarMainOrder,
  loadSidebarTopicOrder,
  saveSidebarMainOrder,
  saveSidebarTopicOrder,
} from "@/lib/navigation/sidebar-order";

export function useMainNavOrder() {
  const [order, setOrder] = useState<string[] | null>(null);

  useEffect(() => {
    setOrder(loadSidebarMainOrder());
  }, []);

  const items = useMemo(
    () => applySidebarOrder(mainNavItems, order),
    [order],
  );

  const reorder = useCallback((nextItems: NavItem[]) => {
    saveSidebarMainOrder(nextItems);
    setOrder(nextItems.map((item) => item.href));
  }, []);

  return { items, reorder };
}

export function useTopicNavOrder(sourceItems: NavItem[]) {
  const [order, setOrder] = useState<string[] | null>(null);

  useEffect(() => {
    setOrder(loadSidebarTopicOrder());
  }, []);

  const items = useMemo(
    () => applySidebarOrder(sourceItems, order),
    [order, sourceItems],
  );

  const reorder = useCallback((nextItems: NavItem[]) => {
    saveSidebarTopicOrder(nextItems);
    setOrder(nextItems.map((item) => item.href));
  }, []);

  return { items, reorder };
}
