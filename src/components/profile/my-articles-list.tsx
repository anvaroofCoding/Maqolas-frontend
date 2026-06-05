"use client";

import {
  ClockIcon,
  ExternalLinkIcon,
  FilePenLineIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MyArticlesSkeleton } from "@/components/profile/my-article-card-skeleton";
import {
  useDeleteArticleMutation,
  useListMyArticlesQuery,
} from "@/features/articles/api/articles-api";
import type { ArticleStatus, MyArticle } from "@/features/articles/types";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Qoralama",
  review: "Ko'rib chiqilmoqda",
  published: "Nashr etilgan",
  rejected: "Rad etilgan",
};

const STATUS_VARIANTS: Record<
  ArticleStatus,
  "secondary" | "default" | "outline" | "destructive"
> = {
  draft: "secondary",
  review: "outline",
  published: "default",
  rejected: "destructive",
};

function MyArticleCard({
  article,
  onDelete,
  isDeleting,
}: {
  article: MyArticle;
  onDelete: (article: MyArticle) => void;
  isDeleting: boolean;
}) {
  const router = useRouter();
  const canEdit = article.status !== "review";
  const isPublished = article.status === "published";

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        {article.coverImageUrl ? (
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border bg-muted sm:h-24 sm:w-32">
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              sizes="128px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANTS[article.status]}>
              {STATUS_LABELS[article.status]}
            </Badge>
            {article.updatedAt ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="size-3.5" aria-hidden />
                {formatRelativeTime(article.updatedAt)}
              </span>
            ) : null}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
              {article.title}
            </h3>
            {article.excerpt ? (
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {article.excerpt}
              </p>
            ) : null}
          </div>

          {article.status === "rejected" && article.reviewNote ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <span className="font-medium">Rad etish sababi: </span>
              {article.reviewNote}
            </p>
          ) : null}

          {article.status === "review" ? (
            <p className="text-sm text-muted-foreground">
              Maqola admin tomonidan ko&apos;rib chiqilmoqda. Tahrirlash vaqtincha
              mavjud emas.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {canEdit ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => router.push(`/yozish/${article.id}`)}
              >
                <FilePenLineIcon className="size-4" aria-hidden />
                Tahrirlash
              </Button>
            ) : null}

            {isPublished ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="gap-1.5"
                asChild
              >
                <Link href={`/maqola/${article.slug}`}>
                  <ExternalLinkIcon className="size-4" aria-hidden />
                  Ko&apos;rish
                </Link>
              </Button>
            ) : null}

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
              )}
              disabled={isDeleting}
              onClick={() => onDelete(article)}
            >
              {isDeleting ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2Icon className="size-4" aria-hidden />
              )}
              O&apos;chirish
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MyArticlesList() {
  const { data, isLoading, isFetching } = useListMyArticlesQuery();
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [pendingDelete, setPendingDelete] = useState<MyArticle | null>(null);

  const articles = data?.articles ?? [];

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteArticle(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch {
      // keep dialog open on failure
    }
  };

  if (isLoading) {
    return <MyArticlesSkeleton />;
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Hozircha siz yozgan maqolalar yo&apos;q. Birinchi maqolangizni yozishni
          boshlang.
        </p>
        <Button asChild size="sm">
          <Link href="/yozish">Maqola yozish</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {isFetching && !isLoading ? (
          <p className="text-xs text-muted-foreground">Yangilanmoqda...</p>
        ) : null}

        {articles.map((article) => (
          <MyArticleCard
            key={article.id}
            article={article}
            onDelete={setPendingDelete}
            isDeleting={isDeleting && pendingDelete?.id === article.id}
          />
        ))}
      </div>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maqolani o&apos;chirish</DialogTitle>
            <DialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; butunlay o&apos;chiriladi. Bu
              amalni qaytarib bo&apos;lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDelete(null)}
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleConfirmDelete()}
            >
              {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
