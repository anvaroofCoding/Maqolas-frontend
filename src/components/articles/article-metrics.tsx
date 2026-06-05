import { Eye, Heart, MessageSquare } from "lucide-react";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

type ArticleMetricsProps = {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  className?: string;
};

export function ArticleMetrics({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  className,
}: ArticleMetricsProps) {
  const hasLikes = likeCount > 0;
  const hasComments = commentCount > 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5" aria-label="Ko'rishlar">
        <Eye className="size-4 shrink-0" aria-hidden />
        <span>{formatCount(viewCount)}</span>
      </span>

      <span className="inline-flex items-center gap-1.5" aria-label="Yoqtirishlar">
        <Heart
          className={cn(
            "size-4 shrink-0",
            hasLikes ? "fill-primary text-primary" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <span>{formatCount(likeCount)}</span>
      </span>

      {hasComments ? (
        <span className="inline-flex items-center gap-1.5" aria-label="Izohlar">
          <MessageSquare className="size-4 shrink-0" aria-hidden />
          <span>{formatCount(commentCount)}</span>
        </span>
      ) : null}
    </div>
  );
}
