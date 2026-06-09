"use client";

import {
  ExternalLinkIcon,
  FilePenLineIcon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useListAiArticleArchiveQuery } from "@/features/ai-article/api/ai-article-api";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AiArticleArchiveList() {
  const router = useRouter();
  const { data, isLoading, isError } = useListAiArticleArchiveQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-xl p-4">
            <Skeleton className="mb-2 h-5 w-2/3" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-8 w-28" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        AI arxiv yuklanmadi. Sahifani yangilab ko&apos;ring.
      </p>
    );
  }

  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <Card className="rounded-xl border-dashed p-8 text-center">
        <SparklesIcon className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">Hozircha AI arxivi bo&apos;sh</p>
        <p className="mt-1 text-xs text-muted-foreground">
          O&apos;ng pastdagi AI tugmasi orqali maqola yozing — bu yerda saqlanadi
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "overflow-hidden rounded-xl border shadow-sm transition-colors",
            item.articleId && "hover:border-primary/30",
          )}
        >
          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 shrink-0 text-primary" />
                  <h3 className="truncate text-sm font-semibold">
                    {item.generatedTitle ?? "AI maqola"}
                  </h3>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {item.prompt}
                </p>
              </div>
              <Badge variant="secondary">AI</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {item.completedAt
                  ? formatRelativeTime(item.completedAt)
                  : formatRelativeTime(item.createdAt)}
              </p>

              {item.articleId ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/yozish/${item.articleId}`)}
                  >
                    <FilePenLineIcon />
                    Tahrirlash
                  </Button>
                  <Button type="button" size="sm" asChild>
                    <Link href={`/yozish/${item.articleId}`}>
                      <ExternalLinkIcon />
                      Ochish
                    </Link>
                  </Button>
                </div>
              ) : (
                <Badge variant="outline">
                  <Loader2Icon className="animate-spin" />
                  Jarayonda
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
