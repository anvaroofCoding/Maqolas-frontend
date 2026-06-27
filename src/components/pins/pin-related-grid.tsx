"use client";

import { PinCard } from "@/components/pins/pin-card";
import type { PinSummary } from "@/features/pins/types";
import { cn } from "@/lib/utils";

type PinRelatedGridProps = {
  pins: PinSummary[];
  className?: string;
};

export function PinRelatedGrid({ pins, className }: PinRelatedGridProps) {
  return (
    <div
      className={cn(
        "pin-masonry columns-2 gap-3 sm:columns-3 lg:columns-2 xl:columns-3",
        className,
      )}
    >
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} variant="compact" />
      ))}
    </div>
  );
}
