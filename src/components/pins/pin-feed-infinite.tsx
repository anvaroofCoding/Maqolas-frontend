"use client";

import { ImagesIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PinCard } from "@/components/pins/pin-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PINS_FEED_PAGE_SIZE,
  useLazyListPinsQuery,
} from "@/features/pins/api/pins-api";
import type { PinFeedResponse, PinSummary } from "@/features/pins/types";
import { cn } from "@/lib/utils";

type PinFeedInfiniteProps = {
  initialPins?: PinSummary[];
  initialPagination?: PinFeedResponse["pagination"];
};

function mergePins(current: PinSummary[], incoming: PinSummary[]) {
  const seen = new Set(current.map((pin) => pin.id));
  const next = incoming.filter((pin) => !seen.has(pin.id));
  return next.length > 0 ? [...current, ...next] : current;
}

export function PinFeedInfinite({
  initialPins,
  initialPagination,
}: PinFeedInfiniteProps) {
  const canUseInitial = Boolean(initialPins && initialPagination);
  const [pins, setPins] = useState<PinSummary[]>(
    canUseInitial ? initialPins! : [],
  );
  const [page, setPage] = useState(
    canUseInitial ? (initialPagination?.page ?? 1) : 0,
  );
  const [hasMore, setHasMore] = useState(
    canUseInitial
      ? (initialPagination?.page ?? 1) < (initialPagination?.totalPages ?? 1)
      : true,
  );
  const [loadPins, { isFetching }] = useLazyListPinsQuery();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    const nextPage = page + 1;

    try {
      const data = await loadPins({
        page: nextPage,
        limit: PINS_FEED_PAGE_SIZE,
      }).unwrap();

      setPins((current) => mergePins(current, data.pins));
      setPage(data.pagination.page);
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch {
      setHasMore(false);
    } finally {
      loadingRef.current = false;
    }
  }, [hasMore, loadPins, page]);

  useEffect(() => {
    if (canUseInitial) return;
    void loadMore();
  }, [canUseInitial, loadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (pins.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
        <ImagesIcon className="size-10 text-muted-foreground/70" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Hozircha rasmlar yo&apos;q
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Birinchi rasmni yuklang — galereya shu yerda paydo bo&apos;ladi.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/rasm/yuklash">
            <PlusIcon className="size-4" aria-hidden />
            Rasm yuklash
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pin-feed-root">
      <div
        className={cn(
          "pin-masonry columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5",
        )}
      >
        {pins.map((pin, index) => (
          <PinCard key={pin.id} pin={pin} priority={index < 8} />
        ))}
      </div>

      {isFetching ? (
        <div className="pin-masonry mt-1 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn(
                "mb-3 w-full break-inside-avoid rounded-[16px] sm:mb-4 sm:rounded-[20px]",
                index % 3 === 0 ? "h-44" : index % 3 === 1 ? "h-56" : "h-64",
              )}
            />
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-10" aria-hidden />
    </div>
  );
}
