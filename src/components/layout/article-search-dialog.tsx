"use client";

import { FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useLazySearchArticlesQuery } from "@/features/articles/api/articles-api";
import type { ArticleSummary } from "@/features/articles/types";
import { getUserInitials } from "@/lib/user";

type ArticleSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;

function SearchResultItem({ article }: { article: ArticleSummary }) {
  const authorName = article.author?.displayName ?? "Noma'lum muallif";

  return (
    <>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {article.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt=""
            className="size-9 rounded-lg object-cover"
          />
        ) : (
          <FileTextIcon className="size-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{article.title}</p>
        {article.excerpt ? (
          <p className="truncate text-xs text-muted-foreground">
            {article.excerpt}
          </p>
        ) : null}
      </div>
      <Avatar size="sm" className="shrink-0">
        {article.author?.avatarUrl ? (
          <AvatarImage src={article.author.avatarUrl} alt={authorName} />
        ) : null}
        <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
      </Avatar>
    </>
  );
}

function SearchSkeletonList() {
  return (
    <div className="space-y-2 px-3 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="size-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ArticleSearchDialog({
  open,
  onOpenChange,
}: ArticleSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchArticles, { data, isFetching }] = useLazySearchArticlesQuery();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
      return;
    }

    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [open, query]);

  useEffect(() => {
    if (!open || debouncedQuery.length < MIN_QUERY_LENGTH) {
      return;
    }

    void searchArticles({ q: debouncedQuery, limit: 10 });
  }, [debouncedQuery, open, searchArticles]);

  const handleSelect = useCallback(
    (slug: string) => {
      onOpenChange(false);
      router.push(`/maqola/${slug}`);
    },
    [onOpenChange, router],
  );

  const articles = data?.articles ?? [];
  const trimmedQuery = query.trim();
  const showLoading =
    debouncedQuery.length >= MIN_QUERY_LENGTH && isFetching;
  const showHint =
    trimmedQuery.length > 0 && trimmedQuery.length < MIN_QUERY_LENGTH;
  const showEmpty =
    debouncedQuery.length >= MIN_QUERY_LENGTH &&
    !showLoading &&
    articles.length === 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Maqolalarni qidirish"
      description="Sarlavha, matn va muallif bo'yicha qidirish"
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Maqola qidirish..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {showLoading ? <SearchSkeletonList /> : null}

        {!showLoading && trimmedQuery.length === 0 ? (
          <CommandEmpty>Qidirish uchun matn yozing</CommandEmpty>
        ) : null}

        {!showLoading && showHint ? (
          <CommandEmpty>Kamida {MIN_QUERY_LENGTH} ta belgi kiriting</CommandEmpty>
        ) : null}

        {!showLoading && showEmpty ? (
          <CommandEmpty>Mos maqola topilmadi</CommandEmpty>
        ) : null}

        {!showLoading && articles.length > 0 ? (
          <CommandGroup heading="Natijalar">
            {articles.map((article) => (
              <CommandItem
                key={article.id}
                value={article.slug}
                onSelect={() => handleSelect(article.slug)}
              >
                <SearchResultItem article={article} />
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
