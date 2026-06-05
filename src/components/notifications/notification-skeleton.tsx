import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="flex gap-2.5 px-1 py-1">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-16 w-full rounded-2xl rounded-tl-sm" />
      </div>
    </div>
  );
}

export function NotificationSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 px-3 py-2">
      {Array.from({ length: count }).map((_, index) => (
        <NotificationSkeleton key={index} />
      ))}
    </div>
  );
}
