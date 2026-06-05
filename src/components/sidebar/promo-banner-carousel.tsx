"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBannersQuery } from "@/features/banners/api/banners-api";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6000;

export function PromoBannerCarousel() {
  const { data, isLoading } = useGetBannersQuery();
  const banners = data?.banners ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div className="border-t px-4 py-3">
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </Card>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const activeBanner = banners[activeIndex] ?? banners[0];

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
      <a
        href={activeBanner.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[4/5] overflow-hidden bg-muted"
        aria-label={activeBanner.title ?? "Reklama banneri"}
      >
        <Image
          src={activeBanner.imageUrl}
          alt={activeBanner.title ?? "Reklama"}
          fill
          sizes="288px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          unoptimized
        />

        {banners.length > 1 ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`${index + 1}-banner`}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  index === activeIndex
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/70",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
              />
            ))}
          </div>
        ) : null}
      </a>

      <div className="border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {activeBanner.title ?? "Reklama"}
        </p>
      </div>
    </Card>
  );
}
