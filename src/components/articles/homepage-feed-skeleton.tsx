import { cn } from "@/lib/utils";

type HomepageFeedSkeletonProps = {
  title?: string;
};

export function HomepageFeedSkeleton({ title }: HomepageFeedSkeletonProps) {
  return (
    <section
      aria-label={title ?? "Maqolalar yuklanmoqda"}
      aria-busy="true"
      role="status"
      className="space-y-8"
    >
      <span className="sr-only">Maqolalar yuklanmoqda</span>

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,1.08fr)_minmax(420px,1.35fr)_minmax(260px,0.88fr)]">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={cn("space-y-3 border-border/70 pb-4", index < 3 && "border-b")}
            >
              <div className="h-3 w-20 animate-pulse rounded-md bg-muted/60" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted/80" />
              <div className="h-8 w-5/6 animate-pulse rounded-md bg-muted/75" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted/65" />
              <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted/55" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-[260px] rounded-[1.75rem] border bg-muted/80 sm:h-[340px] xl:h-[380px]" />
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 rounded-2xl border bg-card p-3 shadow-sm"
                >
                  <div className="h-[68px] rounded-xl bg-muted/80" />
                  <div className="space-y-2 self-center">
                    <div className="h-5 w-full animate-pulse rounded-md bg-muted/80" />
                    <div className="h-5 w-5/6 animate-pulse rounded-md bg-muted/70" />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.6rem] border bg-muted/40 p-5 shadow-sm">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted/80" />
              <div className="mt-5 h-3 w-24 animate-pulse rounded-md bg-muted/60" />
              <div className="mt-3 h-7 w-full animate-pulse rounded-md bg-muted/80" />
              <div className="mt-2 h-7 w-5/6 animate-pulse rounded-md bg-muted/75" />
              <div className="mt-4 h-4 w-full animate-pulse rounded-md bg-muted/60" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded-md bg-muted/50" />
            </div>
          </div>
          <div className="space-y-3 border-t border-border/70 pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 rounded-2xl border bg-card p-3 shadow-sm"
              >
                <div className="h-[84px] rounded-xl bg-muted/80" />
                <div className="space-y-2 self-center">
                  <div className="h-3 w-16 animate-pulse rounded-md bg-muted/55" />
                  <div className="h-5 w-full animate-pulse rounded-md bg-muted/80" />
                  <div className="h-3 w-20 animate-pulse rounded-md bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.6rem] border bg-card px-5 py-5 shadow-sm">
          <div className="h-8 w-44 animate-pulse rounded-md bg-muted/80" />
          <ul className="mt-4 space-y-0">
            {Array.from({ length: 7 }).map((_, index) => (
              <li
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={cn("border-border/70 py-4", index < 6 && "border-b")}
              >
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted/80" />
                  <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/70" />
                  <div className="h-3 w-28 animate-pulse rounded-md bg-muted/55" />
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-9 w-56 animate-pulse rounded-md bg-muted/80" />
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted/55" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[1.8rem] border bg-card shadow-sm">
            <div className="h-[250px] bg-muted/80 sm:h-[320px]" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-24 animate-pulse rounded-md bg-muted/60" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted/80" />
              <div className="h-8 w-5/6 animate-pulse rounded-md bg-muted/75" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted/50" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="space-y-3 rounded-[1.5rem] border bg-card p-3 shadow-sm"
              >
                <div className="h-44 rounded-[1.15rem] bg-muted/80" />
                <div className="h-3 w-20 animate-pulse rounded-md bg-muted/55" />
                <div className="h-5 w-full animate-pulse rounded-md bg-muted/80" />
                <div className="h-5 w-5/6 animate-pulse rounded-md bg-muted/70" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-9 w-64 animate-pulse rounded-md bg-muted/80" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-muted/55" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="overflow-hidden rounded-[1.6rem] border bg-card shadow-sm"
            >
              <div className="h-52 bg-muted/80" />
              <div className="space-y-3 bg-slate-900 p-4">
                <div className="h-3 w-24 animate-pulse rounded-md bg-white/20" />
                <div className="h-6 w-full animate-pulse rounded-md bg-white/25" />
                <div className="h-6 w-5/6 animate-pulse rounded-md bg-white/20" />
                <div className="h-6 w-2/3 animate-pulse rounded-md bg-white/15" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="flex gap-4 rounded-[1.5rem] border bg-card p-4 shadow-sm"
          >
            <div className="hidden h-36 w-48 rounded-[1.15rem] bg-muted/80 sm:block" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded-md bg-muted/55" />
              <div className="h-6 w-full animate-pulse rounded-md bg-muted/80" />
              <div className="h-6 w-5/6 animate-pulse rounded-md bg-muted/75" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted/50" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

