"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleFeedInfinite } from "@/components/articles/article-feed-infinite";
import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { Button } from "@/components/ui/button";
import { feedMainClassName } from "@/lib/layout";
import { useAppSelector } from "@/lib/store/hooks";

export default function SavedFeedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !accessToken) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, accessToken, router]);

  if (!mounted || !accessToken) {
    return (
      <main className={feedMainClassName}>
        <ArticleFeedSkeleton title="Mening maqolam yuklanmoqda" />
      </main>
    );
  }

  return (
    <main className={feedMainClassName}>
      <section aria-label="Mening maqolam">
        <h1 className="sr-only">Mening maqolam</h1>
        <ArticleFeedInfinite
          variant="saved"
          title="Mening maqolam"
          emptyMessage="Maqolangiz hozircha bo'sh."
          emptyFallback={
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <Bookmark className="size-10 text-muted-foreground/60" aria-hidden />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Maqolangiz hozircha bo&apos;sh
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Maqolalarni saqlash uchun maqola sahifasidagi belgi tugmasini
                  bosing. Saqlangan maqolalar shu yerda ko&apos;rinadi.
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/">Maqolalarni ko&apos;rish</Link>
              </Button>
            </div>
          }
        />
      </section>
    </main>
  );
}
