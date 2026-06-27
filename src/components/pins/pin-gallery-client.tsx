"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { PinFeedInfinite } from "@/components/pins/pin-feed-infinite";
import { Button } from "@/components/ui/button";
import type { PinFeedResponse, PinSummary } from "@/features/pins/types";

type PinGalleryClientProps = {
  initialPins?: PinSummary[];
  initialPagination?: PinFeedResponse["pagination"];
};

export function PinGalleryClient({
  initialPins,
  initialPagination,
}: PinGalleryClientProps) {
  return (
    <>
      <div className="pin-gallery-header mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
              Rasmlar
            </h1>
            <p className="mt-1 hidden max-w-2xl text-sm text-muted-foreground sm:block sm:text-base">
              Ilhom oling va sevimli rasmlarni kashf eting — silliq Pinterest
              uslubidagi galereya.
            </p>
          </div>

          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link href="/rasm/yuklash">
              <PlusIcon className="size-4" aria-hidden />
              Rasm yuklash
            </Link>
          </Button>
        </div>
      </div>

      <PinFeedInfinite
        initialPins={initialPins}
        initialPagination={initialPagination}
      />

      <Link
        href="/rasm/yuklash"
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 sm:hidden"
        aria-label="Rasm yuklash"
      >
        <PlusIcon className="size-6" aria-hidden />
      </Link>
    </>
  );
}
