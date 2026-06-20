"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : articleUrl(slug);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Havola nusxalandi");
      window.setTimeout(() => setCopied(false), 2000);
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
      aria-label="Havolani nusxalash"
      onClick={() => void handleCopy()}
    >
      {copied ? (
        <Check className={iosIconClass} aria-hidden />
      ) : (
        <Link2 className={iosIconClass} aria-hidden />
      )}
      <span className="hidden text-sm sm:inline">Link</span>
    </Button>
  );
}
