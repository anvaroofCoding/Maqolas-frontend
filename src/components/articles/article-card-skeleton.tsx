import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type ArticleCardSkeletonProps = {
  withCover?: boolean;
};

export function ArticleCardSkeleton({ withCover = true }: ArticleCardSkeletonProps) {
  return (
    <Card className="min-w-0 max-w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="p-3 sm:p-4" aria-hidden>
        <Skeleton className="mb-2 h-5 w-14 rounded-full" />

        <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
          <Skeleton className="size-7 shrink-0 rounded-full" />
          <Skeleton className="h-3.5 w-36 max-w-full rounded-md" />
        </div>

        <div
          className={
            withCover
              ? "flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:gap-4"
              : "min-w-0"
          }
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-[92%] rounded-md sm:h-6" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[88%] rounded-md" />
          </div>

          {withCover ? (
            <Skeleton className="hidden h-16 w-20 shrink-0 rounded-lg border xl:block 2xl:h-20 2xl:w-24" />
          ) : null}
        </div>

        {withCover ? (
          <Skeleton className="mt-3 h-32 w-full rounded-lg border sm:h-36 xl:hidden" />
        ) : null}

        <Separator className="my-3 sm:my-3.5" />

        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-3.5 w-10 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
          <Skeleton className="h-3.5 w-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
