import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { MyArticlesSkeleton } from "@/components/profile/my-article-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function OwnProfileHeaderSkeleton() {
  return (
    <header
      className="flex items-start gap-4 border-b border-border pb-5 sm:gap-6 sm:pb-6"
      aria-hidden
    >
      <div className="relative shrink-0">
        <Skeleton className="size-16 rounded-full sm:size-24" />
        <Skeleton className="absolute right-0 bottom-0 size-7 rounded-full border border-border sm:size-8" />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-40 rounded-md sm:h-8 sm:w-52" />
          <Skeleton className="size-7 shrink-0 rounded-md" />
        </div>

        <Skeleton className="h-4 w-48 max-w-full rounded-md" />

        <Skeleton className="h-4 w-full max-w-xl rounded-md" />

        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="size-9 shrink-0 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-4 w-52 rounded-md" />
      </div>
    </header>
  );
}

function PublicProfileHeaderSkeleton() {
  return (
    <header
      className="flex items-start gap-4 border-b border-border pb-5 sm:gap-6 sm:pb-6"
      aria-hidden
    >
      <Skeleton className="size-16 shrink-0 rounded-full sm:size-24" />

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-7 w-40 rounded-md sm:h-8 sm:w-52" />
          <Skeleton className="h-8 w-[8.5rem] rounded-full" />
        </div>

        <Skeleton className="h-4 w-28 rounded-md" />

        <Skeleton className="h-4 w-full max-w-xl rounded-md" />

        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="size-9 shrink-0 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-4 w-52 rounded-md" />
      </div>
    </header>
  );
}

type ProfileTabsSkeletonProps = {
  variant?: "own" | "public";
};

export function ProfileTabsSkeleton({ variant = "own" }: ProfileTabsSkeletonProps) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <div className="-mx-4 overflow-x-auto px-4 scrollbar-hidden touch-pan-x sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="inline-flex h-10 w-max max-w-none flex-nowrap items-center gap-1 rounded-xl bg-muted/80 p-1 sm:max-w-full">
          {variant === "own" ? (
            <>
              <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-lg" />
              <Skeleton className="h-8 w-[5.5rem] shrink-0 rounded-lg sm:w-[10.5rem]" />
              <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-lg" />
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-[5.5rem] shrink-0 rounded-lg" />
              <Skeleton className="h-8 w-[5.5rem] shrink-0 rounded-lg sm:w-[10.5rem]" />
              <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-lg" />
            </>
          )}
        </div>
      </div>

      <div className="pt-1">
        {variant === "own" ? (
          <MyArticlesSkeleton count={2} />
        ) : (
          <ArticleFeedSkeleton count={2} compact />
        )}
      </div>
    </div>
  );
}

type ProfilePageSkeletonProps = {
  variant?: "own" | "public";
};

export function ProfilePageSkeleton({ variant = "own" }: ProfilePageSkeletonProps) {
  return (
    <div
      className="w-full"
      role="status"
      aria-busy="true"
      aria-label="Profil yuklanmoqda"
    >
      <span className="sr-only">Profil yuklanmoqda</span>
      {variant === "own" ? (
        <OwnProfileHeaderSkeleton />
      ) : (
        <PublicProfileHeaderSkeleton />
      )}
      <div className={cn("pt-4")}>
        <ProfileTabsSkeleton variant={variant} />
      </div>
    </div>
  );
}
