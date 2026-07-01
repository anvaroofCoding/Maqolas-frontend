import { HashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ArticleHashtagsProps = {
  hashtags?: string[];
  className?: string;
};

export function ArticleHashtags({ hashtags = [], className }: ArticleHashtagsProps) {
  if (!hashtags.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <HashIcon className="size-3.5" />
        Hashtaglar
      </span>
      {hashtags.map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
