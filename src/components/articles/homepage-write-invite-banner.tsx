"use client";

import { PenLine, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  dismissHomepageInviteBanner,
  isHomepageInviteBannerDismissed,
} from "@/lib/homepage-invite-banner/storage";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type HomepageWriteInviteBannerProps = {
  className?: string;
  onDismiss?: () => void;
};

function getInviteSiteUrl() {
  const configured = siteConfig.url.replace(/\/$/, "");
  if (typeof window !== "undefined" && configured.startsWith("http://localhost")) {
    return window.location.origin;
  }
  return configured || (typeof window !== "undefined" ? window.location.origin : "");
}

export function HomepageWriteInviteBanner({
  className,
  onDismiss,
}: HomepageWriteInviteBannerProps) {
  const [visible, setVisible] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    setVisible(!isHomepageInviteBannerDismissed());
  }, []);

  const handleDismiss = () => {
    dismissHomepageInviteBanner();
    setVisible(false);
    onDismiss?.();
  };

  const handleCopyInviteLink = async () => {
    if (copying) return;

    setCopying(true);
    const url = getInviteSiteUrl();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      toast.success("Sayt havolasi nusxalandi");
    } catch {
      toast.error("Havolani nusxalash amalga oshmadi");
    } finally {
      setCopying(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-label="Maqola yozish va do'stni taklif qilish"
      className={cn(
        "pointer-events-none fixed bottom-4 left-1/2 z-40 w-[min(100%,calc(100vw-1.5rem))] max-w-3xl -translate-x-1/2 sm:bottom-6",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto relative overflow-hidden rounded-2xl border border-primary/25 shadow-lg shadow-black/10 backdrop-blur-md",
          "bg-[linear-gradient(135deg,color-mix(in_oklch,var(--card)_92%,var(--primary)_8%),color-mix(in_oklch,var(--card)_96%,transparent))]",
          "dark:border-primary/35 dark:bg-[linear-gradient(135deg,rgba(28,37,51,0.94),rgba(40,61,85,0.88))] dark:shadow-black/35",
        )}
      >
        <button
          type="button"
          aria-label="Bannerni yopish"
          className="absolute right-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          onClick={handleDismiss}
        >
          <X className="size-4" aria-hidden />
        </button>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-primary/15 blur-2xl"
        />

        <div className="relative flex flex-col items-center gap-4 px-4 py-4 pr-10 text-center sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:py-4 sm:pr-12 sm:text-left">
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/85">
              Maqolas jamoasi
            </p>
            <h2 className="text-base font-bold leading-snug tracking-tight text-foreground sm:text-lg">
              Hoziroq maqolangizni yozing va do&apos;stingizni taklif qiling
            </h2>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild size="sm" className="h-10 rounded-xl px-4 text-sm">
              <Link href="/yozish">
                <PenLine aria-hidden />
                Maqola yozish
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={copying}
              className="h-10 rounded-xl border-primary/25 bg-background/80 px-4 text-sm dark:bg-background/10"
              onClick={() => void handleCopyInviteLink()}
            >
              <UserPlus aria-hidden />
              {copying ? "Nusxalanmoqda..." : "Do'stni taklif qilish"}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
