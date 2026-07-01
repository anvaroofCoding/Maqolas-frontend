"use client";

import { BookmarkIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteSavedPhraseMutation,
  useListSavedPhrasesQuery,
} from "@/features/saved-phrases/api/saved-phrases-api";
import { formatRelativeTime } from "@/lib/format";
import { feedMainClassName } from "@/lib/layout";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function SavedPhrasesPageClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data, isLoading, isFetching } = useListSavedPhrasesQuery(
    { page: 1, limit: 50 },
    { skip: !mounted || (!isAuthenticated && !accessToken) },
  );

  const [deletePhrase, { isLoading: isDeleting }] =
    useDeleteSavedPhraseMutation();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !accessToken) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, accessToken, router]);

  const handleDelete = async (id: string) => {
    try {
      await deletePhrase(id).unwrap();
      toast.success("Ibora o'chirildi");
    } catch {
      toast.error("O'chirib bo'lmadi");
    }
  };

  if (!mounted || !accessToken) {
    return (
      <main className={feedMainClassName}>
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </main>
    );
  }

  const phrases = data?.phrases ?? [];
  const loading = isLoading || isFetching;

  return (
    <main className={feedMainClassName}>
      <section aria-label="Saqlangan so'zlar" className="space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Saqlangan so&apos;zlar
          </h1>
          <p className="text-sm text-muted-foreground">
            Maqola o&apos;qish paytida belgilab saqlagan iboralaringiz.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : phrases.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border bg-card px-6 py-16 text-center">
            <BookmarkIcon
              className="size-10 text-muted-foreground/60"
              aria-hidden
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Hozircha saqlangan so&apos;zlar yo&apos;q
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Maqolada kerakli jumlani belgilang va &quot;Saqlash&quot;
                tugmasini bosing.
              </p>
            </div>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/maqolalar">Maqolalarni ko&apos;rish</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {phrases.map((phrase) => (
              <li
                key={phrase.id}
                className="rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/20"
              >
                <blockquote className="border-l-4 border-primary/50 pl-4 text-sm leading-relaxed text-foreground">
                  {phrase.text}
                </blockquote>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/maqola/${phrase.articleSlug}`}
                      className="inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <span className="truncate">{phrase.articleTitle}</span>
                      <ExternalLinkIcon className="size-3.5 shrink-0" />
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(phrase.createdAt)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "shrink-0 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive",
                    )}
                    disabled={isDeleting}
                    onClick={() => void handleDelete(phrase.id)}
                  >
                    <Trash2Icon className="size-3.5" aria-hidden />
                    O&apos;chirish
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
