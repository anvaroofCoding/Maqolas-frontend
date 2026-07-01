import {
  feedColumnScrollClassName,
  rightSidebarWidthClass,
  sidebarWidthClass,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

type WriteLayoutSpacerProps = {
  side: "left" | "right";
};

export function WriteLayoutSpacer({ side }: WriteLayoutSpacerProps) {
  return (
    <div
      className={cn(
        feedColumnScrollClassName,
        side === "left"
          ? cn("hidden xl:block", sidebarWidthClass)
          : cn("hidden xl:block", rightSidebarWidthClass),
      )}
      aria-hidden
    />
  );
}
