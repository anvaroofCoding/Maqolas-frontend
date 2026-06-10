"use client";

import { Loader2Icon, SparklesIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListArticlesQuery } from "@/features/articles/api/articles-api";
import type { ArticleSummary } from "@/features/articles/types";
import { extractImageColors } from "@/lib/promo-reader/extract-image-colors";
import { markPromoAutoScroll } from "@/lib/promo-reader/storage";
import { cn } from "@/lib/utils";

type PromoReaderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Phase = "idle" | "spinning" | "selected" | "entering";

function getExcerpt(article: ArticleSummary) {
  if (article.excerpt?.trim()) return article.excerpt.trim();
  return "Eng mashhur maqolalardan biri.";
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function PromoReaderModal({ open, onOpenChange }: PromoReaderModalProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [borderColors, setBorderColors] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleSummary | null>(
    null,
  );

  const spinLockRef = useRef(false);
  const cancelledRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useListArticlesQuery(
    { sort: "popular", page: 1, limit: 10 },
    { skip: !open },
  );

  const articles = data?.articles ?? [];

  const resetState = useCallback(() => {
    setPhase("idle");
    setActiveIndex(0);
    setSlideDirection("right");
    setBorderColors([]);
    setSelectedArticle(null);
    spinLockRef.current = false;
    cancelledRef.current = false;
  }, []);

  const close = useCallback(() => {
    cancelledRef.current = true;
    resetState();
    onOpenChange(false);
  }, [onOpenChange, resetState]);

  const goToIndex = useCallback((index: number) => {
    setActiveIndex((prev) => {
      if (index !== prev) {
        setSlideDirection(index > prev ? "right" : "left");
      }
      return index;
    });
  }, []);

  const navigateToArticle = useCallback(
    (article: ArticleSummary) => {
      markPromoAutoScroll();
      close();
      router.push(`/maqola/${article.slug}`);
    },
    [close, router],
  );

  const runSpin = useCallback(async () => {
    if (spinLockRef.current || articles.length === 0) return;
    spinLockRef.current = true;
    setPhase("spinning");

    const targetIndex = Math.floor(Math.random() * articles.length);
    const totalSteps = 10 + Math.floor(Math.random() * 6);
    let currentIndex = 0;

    await sleep(400);
    goToIndex(0);

    for (let step = 0; step < totalSteps; step += 1) {
      if (cancelledRef.current) return;

      const isLast = step === totalSteps - 1;
      const nextIndex = isLast
        ? targetIndex
        : (() => {
            let candidate = Math.floor(Math.random() * articles.length);
            let attempts = 0;
            while (candidate === currentIndex && attempts < 4) {
              candidate = Math.floor(Math.random() * articles.length);
              attempts += 1;
            }
            return candidate;
          })();

      goToIndex(nextIndex);
      currentIndex = nextIndex;

      const delay = isLast ? 520 : 90 + step * 42;
      await sleep(delay);
    }

    if (cancelledRef.current) return;

    const article = articles[targetIndex];
    if (!article) return;

    setSelectedArticle(article);
    setPhase("selected");

    const colors = article.coverImageUrl
      ? await extractImageColors(article.coverImageUrl)
      : ["#4f46e5", "#7c3aed", "#2563eb"];

    if (cancelledRef.current) return;
    setBorderColors(colors);

    await sleep(1100);
    if (cancelledRef.current) return;

    setPhase("entering");
    await sleep(750);
    if (cancelledRef.current) return;

    navigateToArticle(article);
  }, [articles, goToIndex, navigateToArticle]);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    cancelledRef.current = false;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, resetState]);

  useEffect(() => {
    if (!open || isLoading || articles.length === 0 || phase !== "idle") return;
    void runSpin();
  }, [open, isLoading, articles.length, phase, runSpin]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && phase !== "entering") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, open, phase]);

  if (!open || !mounted) return null;

  const isSpinning = phase === "spinning";
  const isSelected = phase === "selected" || phase === "entering";
  const isEntering = phase === "entering";

  const displayIndex =
    isSelected && selectedArticle
      ? articles.findIndex((a) => a.id === selectedArticle.id)
      : activeIndex;
  const displayArticle = articles[displayIndex >= 0 ? displayIndex : activeIndex];
  const gradientBorder =
    borderColors.length >= 2
      ? `linear-gradient(135deg, ${borderColors.join(", ")})`
      : "linear-gradient(135deg, #4f46e5, #7c3aed)";

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center p-4",
        "transition-opacity duration-500",
        isEntering ? "bg-background opacity-100" : "bg-background/50 backdrop-blur-md",
      )}
      role="dialog"
      aria-modal
      aria-label="Mashhur maqolalar tanlash"
    >
      {phase !== "entering" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-background/70 text-muted-foreground shadow-sm backdrop-blur-sm hover:text-foreground"
          aria-label="Yopish"
          onClick={close}
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin" />
          <span className="text-sm">Maqolalar yuklanmoqda...</span>
        </div>
      ) : articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Hozircha mashhur maqolalar topilmadi.
        </p>
      ) : displayArticle ? (
        <div
          className={cn(
            "mx-auto w-full max-w-md transition-all duration-700 ease-out",
            isEntering && "scale-[1.35] opacity-0",
            isSelected && !isEntering && "scale-105",
          )}
        >
          <div
            key={`${displayArticle.id}-${isSpinning ? activeIndex : "selected"}`}
            className={cn(
              "overflow-hidden rounded-2xl bg-card text-left shadow-xl",
              isSpinning &&
                (slideDirection === "right"
                  ? "animate-in fade-in slide-in-from-right-8 duration-300"
                  : "animate-in fade-in slide-in-from-left-8 duration-300"),
              !isSpinning && "animate-in fade-in zoom-in-95 duration-500",
              isSelected && !isEntering && "shadow-2xl",
              isEntering && "scale-110",
            )}
            style={
              isSelected
                ? {
                    border: "3px solid transparent",
                    backgroundImage: `linear-gradient(var(--card), var(--card)), ${gradientBorder}`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    boxShadow: `0 0 0 1px ${borderColors[0] ?? "#4f46e5"}33, 0 20px 50px -12px ${borderColors[0] ?? "#4f46e5"}55`,
                  }
                : { border: "1px solid var(--border)" }
            }
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              {displayArticle.coverImageUrl ? (
                <Image
                  src={displayArticle.coverImageUrl}
                  alt={displayArticle.title}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 640px) 90vw, 448px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-nav-active/20 to-muted">
                  <SparklesIcon className="size-10 text-nav-active/40" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
              <Badge className="absolute left-3 top-3 border-transparent bg-black/50 text-white backdrop-blur-sm">
                #{(displayIndex >= 0 ? displayIndex : activeIndex) + 1}
              </Badge>
            </div>

            <div className="space-y-1.5 p-4">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                {displayArticle.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {getExcerpt(displayArticle)}
              </p>
              {isSelected && phase === "selected" ? (
                <p
                  className="pt-1 text-xs font-medium animate-pulse"
                  style={{ color: borderColors[0] ?? "var(--nav-active)" }}
                >
                  O&apos;qishga kirilmoqda...
                </p>
              ) : null}
            </div>
          </div>

        </div>
      ) : null}
    </div>,
    document.body,
  );
}
