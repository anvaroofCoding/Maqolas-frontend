import { Skeleton } from "@/components/ui/skeleton";
import {
  homepageSeoIntroCardClassName,
  homepageSeoIntroGridClassName,
  homepageSeoIntroShellClassName,
} from "@/lib/seo/homepage-intro-copy";

type HomepageSeoIntroSkeletonProps = {
  /** Yuklanish holati e'lon qilish uchun */
  label?: string;
};

function IntroColumnSkeleton() {
  return (
    <div className={homepageSeoIntroCardClassName} aria-hidden>
      <Skeleton className="h-4 w-28" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[88%]" />
      </div>
    </div>
  );
}

export function HomepageSeoIntroSkeleton({
  label = "Maqolalar yuklanmoqda",
}: HomepageSeoIntroSkeletonProps) {
  return (
    <header
      className={homepageSeoIntroShellClassName}
      aria-busy="true"
      aria-label={label}
      role="status"
    >
      <span className="sr-only">{label}</span>

      <div className={homepageSeoIntroGridClassName}>
        <div className="space-y-3 sm:col-span-2 lg:col-span-1" aria-hidden>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-28 bg-primary/25 sm:h-8" />
            <Skeleton className="h-7 w-40 sm:h-8" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-[92%]" />
            <Skeleton className="hidden h-3.5 w-[78%] sm:block" />
          </div>
        </div>

        <IntroColumnSkeleton />
        <IntroColumnSkeleton />
        <IntroColumnSkeleton />
      </div>
    </header>
  );
}
