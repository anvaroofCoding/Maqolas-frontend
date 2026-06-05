import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type ArticleCardSkeletonProps = {
  withCover?: boolean;
};

export function ArticleCardSkeleton({ withCover = true }: ArticleCardSkeletonProps) {
  return (
    <Card className="min-w-0 max-w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="px-4 py-4 sm:p-5" aria-hidden>
        <Skeleton className="mb-3 h-5 w-14 rounded-full" />

        <div className="mb-4 flex items-center gap-2.5">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-44 max-w-full rounded-md" />
        </div>

        <div className="flex min-w-0 gap-4 sm:gap-5">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-[92%] rounded-md sm:h-8" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-[75%] rounded-md" />
          </div>

          {withCover ? (
            <Skeleton className="hidden h-24 w-32 shrink-0 rounded-lg border sm:block sm:h-28 sm:w-36" />
          ) : null}
        </div>

        {withCover ? (
          <Skeleton className="mt-4 h-40 w-full rounded-lg border sm:hidden" />
        ) : null}

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-10 rounded-md" />
          <Skeleton className="h-4 w-8 rounded-md" />
          <Skeleton className="h-4 w-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
