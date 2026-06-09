"use client";

import { Link2 } from "lucide-react";
import { iosIconClass } from "@/components/articles/flying-like-heart";
import { Button } from "@/components/ui/button";
import { articleUrl } from "@/lib/seo/urls";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type ArticleShareLinkProps = {
  slug: string;
  className?: string;
};

export function ArticleShareLink({ slug, className }: ArticleShareLinkProps) {
  const handleCopy = async () => {
    const url = articleUrl(slug);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Maqola",
          url,
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        "Havola nusxalandi. Telegram kanaliga yopishtiring — sarlavha va rasm avtomatik chiqadi.",
      );
    } catch {
      toast.error("Havolani nusxalab bo'lmadi");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-10 gap-2 rounded-full border-0 bg-transparent px-3 font-normal text-muted-foreground shadow-none",
        "hover:bg-transparent hover:text-foreground",
        className,
      )}
      aria-label="Havolani ulashish"
      onClick={() => void handleCopy()}
    >
      <Link2 className={iosIconClass} aria-hidden />
      <span className="hidden text-sm sm:inline">Ulashish</span>
    </Button>
  );
}
