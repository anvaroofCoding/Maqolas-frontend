import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type MyArticleCardSkeletonProps = {
  withCover?: boolean;
};

export function MyArticleCardSkeleton({ withCover = false }: MyArticleCardSkeletonProps) {
  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        {withCover ? (
          <Skeleton className="h-28 w-full shrink-0 rounded-lg border sm:h-24 sm:w-32" />
        ) : null}

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-3.5 w-20 rounded-full" />
          </div>

          <div>
            <Skeleton className="h-5 w-[85%] rounded-md sm:h-6" />
            <div className="mt-1.5 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-[6.5rem] rounded-md" />
            <Skeleton className="h-8 w-[5.5rem] rounded-md" />
            <Skeleton className="h-8 w-[5.75rem] rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  );
}

type MyArticlesSkeletonProps = {
  count?: number;
};

export function MyArticlesSkeleton({ count = 3 }: MyArticlesSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, index) => (
        <MyArticleCardSkeleton key={index} withCover={index % 2 === 0} />
      ))}
    </div>
  );
}
