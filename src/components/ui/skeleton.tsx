import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/80",
        "after:absolute after:inset-0 after:animate-skeleton-shimmer after:bg-gradient-to-r after:from-transparent after:via-foreground/10 after:to-transparent after:content-['']",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
