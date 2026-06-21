"use client";

import { Maximize2Icon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ArticleAutoScrollButton } from "@/components/articles/article-auto-scroll-button";
import { ArticleFocusReader } from "@/components/articles/article-focus-reader";
import { ArticleSpeedReader } from "@/components/articles/article-speed-reader";
import { FollowButton } from "@/components/profile/follow-button";
import { DelayedHoverTooltip } from "@/components/ui/delayed-hover-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArticleCategory } from "@/features/articles/types";
import { formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";

type ArticleDetailHeaderProps = {
  title: string;
  contentHtml: string;
  coverImageUrl?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatarUrl?: string;
  createdAt?: string;
  categories?: ArticleCategory[];
};

export function ArticleDetailHeader({
  title,
  contentHtml,
  coverImageUrl,
  authorName,
  authorUsername,
  authorAvatarUrl,
  createdAt,
  categories = [],
}: ArticleDetailHeaderProps) {
  const [speedReaderOpen, setSpeedReaderOpen] = useState(false);
  const [focusReaderOpen, setFocusReaderOpen] = useState(false);
  const primaryCategory = categories[0];

  return (
    <>
      <header className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {authorUsername ? (
              <Link href={`/profil/${authorUsername}`} className="shrink-0">
                <Avatar size="sm">
                  {authorAvatarUrl ? (
                    <AvatarImage src={authorAvatarUrl} alt={authorName} />
                  ) : null}
                  <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar size="sm">
                {authorAvatarUrl ? (
                  <AvatarImage src={authorAvatarUrl} alt={authorName} />
                ) : null}
                <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
              </Avatar>
            )}

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {authorUsername ? (
                  <Link
                    href={`/profil/${authorUsername}`}
                    className="font-semibold text-foreground hover:underline"
                    itemProp="author"
                  >
                    {authorName}
                  </Link>
                ) : (
                  <p className="font-semibold text-foreground" itemProp="author">
                    {authorName}
                  </p>
                )}

                {primaryCategory ? (
                  <Badge variant="secondary">{primaryCategory.name}</Badge>
                ) : null}

                {createdAt ? (
                  <time
                    className="text-muted-foreground"
                    dateTime={createdAt}
                    itemProp="datePublished"
                  >
                    {formatRelativeTime(createdAt)}
                  </time>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DelayedHoverTooltip
              label="Tez o'qish"
              hint="So'zma-so'z tez o'qish rejimi"
              placement="below"
              delayMs={0}
              className="inline-flex"
            >
              <Button
                type="button"
                size="icon"
                className="size-10 rounded-full bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
                aria-label="Tez o'qish rejimi"
                onClick={() => setSpeedReaderOpen(true)}
              >
                <PlayIcon className="size-4" aria-hidden />
              </Button>
            </DelayedHoverTooltip>

            {authorUsername ? (
              <DelayedHoverTooltip
                label="Obuna"
                hint="Muallifga obuna bo'ling"
                placement="below"
                delayMs={0}
                className="inline-flex"
              >
                <FollowButton username={authorUsername} compact />
              </DelayedHoverTooltip>
            ) : null}

            <DelayedHoverTooltip
              label="Fokus rejim"
              hint="To'liq ekranda o'qish"
              placement="below"
              delayMs={0}
              className="inline-flex"
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="size-10 rounded-full"
                aria-label="Fokus o'qish rejimi"
                onClick={() => setFocusReaderOpen(true)}
              >
                <Maximize2Icon className="size-4" aria-hidden />
              </Button>
            </DelayedHoverTooltip>

            <ArticleAutoScrollButton
              disabled={speedReaderOpen || focusReaderOpen}
            />
          </div>
        </div>

        <h1
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          itemProp="headline"
        >
          {title}
        </h1>
      </header>

      <ArticleSpeedReader
        open={speedReaderOpen}
        onOpenChange={setSpeedReaderOpen}
        title={title}
        contentHtml={contentHtml}
      />

      <ArticleFocusReader
        open={focusReaderOpen}
        onOpenChange={setFocusReaderOpen}
        title={title}
        contentHtml={contentHtml}
        coverImageUrl={coverImageUrl}
      />
    </>
  );
}
