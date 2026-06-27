"use client";

import { Download, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type PinShareButtonProps = {
  slug: string;
  title?: string;
  imageUrl?: string;
  className?: string;
  variant?: "overlay" | "plain";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function getShareUrl(slug: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/rasm/${slug}`;
  }
  return `${siteConfig.url}/rasm/${slug}`;
}

function getDownloadFilename(title?: string) {
  const base =
    title
      ?.trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "maqolas-rasm";
  return `${base}.jpg`;
}

async function saveImage(imageUrl: string, filename: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("fetch failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export function PinShareButton({
  slug,
  title,
  imageUrl,
  className,
  variant = "plain",
  onClick,
}: PinShareButtonProps) {
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl(slug));
      toast.success("Havola nusxalandi");
    } catch {
      toast.error("Havolani nusxalab bo'lmadi");
    }
  };

  const handleSaveImage = async () => {
    if (!imageUrl) {
      toast.error("Rasm manzili topilmadi");
      return;
    }

    try {
      await saveImage(imageUrl, getDownloadFilename(title));
      toast.success("Rasm saqlandi");
    } catch {
      toast.error("Rasmni saqlab bo'lmadi");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        url: getShareUrl(slug),
        title: title ?? "Maqolas rasm",
      });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Ulashish"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClick?.(event);
          }}
          className={cn(
            variant === "overlay"
              ? "size-10 rounded-full bg-black/45 p-0 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white data-[state=open]:bg-black/60"
              : "h-10 rounded-full px-3 data-[state=open]:bg-muted",
            className,
          )}
        >
          <Share2 className="size-[18px]" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[11rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => void handleCopyLink()}>
          <Link2 className="size-4" aria-hidden />
          Havolani nusxalash
        </DropdownMenuItem>

        {imageUrl ? (
          <DropdownMenuItem onClick={() => void handleSaveImage()}>
            <Download className="size-4" aria-hidden />
            Rasmni saqlash
          </DropdownMenuItem>
        ) : null}

        {canNativeShare ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleNativeShare()}>
              <Share2 className="size-4" aria-hidden />
              Ulashish
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
