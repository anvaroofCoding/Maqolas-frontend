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

          <Button asChild size="sm" className="shrink-0 rounded-full">
            <Link href="/rasm/yuklash">
              <PlusIcon className="size-4" aria-hidden />
              <span className="sm:hidden">Yuklash</span>
              <span className="hidden sm:inline">Rasm yuklash</span>
            </Link>
          </Button>
        </div>
      </div>

      <PinFeedInfinite
        initialPins={initialPins}
        initialPagination={initialPagination}
      />
    </>
  );
}
