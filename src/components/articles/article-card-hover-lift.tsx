"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import type { ArticleSummary } from "@/features/articles/types";
import {
  formatArticleExcerpt,
  hasArticleExcerpt,
  truncateToWords,
} from "@/lib/articles/excerpt";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import "./article-card-hover-lift.css";

const HOVER_DELAY_MS = 5000;
const ANIM_MS = 400;
const PREVIEW_WORDS = 52;

type PanelRect = {
  top: number;
  left: number;
  width: number;
};

type ArticleCardHoverLiftProps = {
  article: ArticleSummary;
  children: ReactNode;
  className?: string;
};

function canUseHoverPreview() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function computePanelRect(cardRect: DOMRect): PanelRect {
  const margin = 16;
  const width = Math.min(400, window.innerWidth - margin * 2);
  const centerX = cardRect.left + cardRect.width / 2;
  let left = centerX - width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

  const estimatedHeight = 220;
  let top = cardRect.top - estimatedHeight - 10;

  if (top < margin) {
    top = cardRect.bottom + 10;
  }

  if (top + estimatedHeight > window.innerHeight - margin) {
    top = Math.max(
      margin,
      Math.min(
        cardRect.top - estimatedHeight - 10,
        window.innerHeight - estimatedHeight - margin,
      ),
    );
  }

  return { top, left, width };
}

function buildClosedTransform(
  cardRect: DOMRect,
  panelRect: PanelRect,
  panelHeight: number,
) {
  const originX = cardRect.left + cardRect.width / 2 - panelRect.left;
  const originY = cardRect.top + cardRect.height / 2 - panelRect.top;
  const scaleX = Math.max(0.06, cardRect.width / panelRect.width);
  const scaleY = Math.max(0.06, cardRect.height / Math.max(panelHeight, 1));

  return {
    transformOrigin: `${originX}px ${originY}px`,
    transform: `scale(${scaleX}, ${scaleY})`,
  };
}

export function ArticleCardHoverLift({
  article,
  children,
  className,
}: ArticleCardHoverLiftProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [enabled] = useState(canUseHoverPreview);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelRect, setPanelRect] = useState<PanelRect | null>(null);
  const [panelStyle, setPanelStyle] = useState<{
    transformOrigin: string;
    transform: string;
  }>({ transformOrigin: "center center", transform: "scale(1)" });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const measureAndOpen = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const cardRect = wrap.getBoundingClientRect();
    const nextRect = computePanelRect(cardRect);
    const panelHeight = panelRef.current?.offsetHeight ?? 200;
    const closed = buildClosedTransform(cardRect, nextRect, panelHeight);

    setPanelRect(nextRect);
    setPanelStyle(closed);
    setVisible(true);
    setOpen(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpen(true);
        setPanelStyle({
          transformOrigin: closed.transformOrigin,
          transform: "scale(1)",
        });
      });
    });
  }, []);

  const scheduleOpen = useCallback(() => {
    if (!enabled) return;
    clearTimers();
    timerRef.current = setTimeout(measureAndOpen, HOVER_DELAY_MS);
  }, [clearTimers, enabled, measureAndOpen]);

  const closePreview = useCallback(() => {
    clearTimers();

    const wrap = wrapRef.current;
    if (!wrap || !panelRect || !visible) {
      setVisible(false);
      setOpen(false);
      setPanelRect(null);
      return;
    }

    const cardRect = wrap.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 200;
    const closed = buildClosedTransform(cardRect, panelRect, panelHeight);

    setOpen(false);
    setPanelStyle(closed);

    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setPanelRect(null);
    }, ANIM_MS + 40);
  }, [clearTimers, panelRect, visible]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (visible) {
      closePreview();
    }
  }, [closePreview, visible]);

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "transform" || open || !visible) return;
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setVisible(false);
      setPanelRect(null);
    },
    [open, visible],
  );

  useEffect(() => {
    if (!visible) return;

    function handleScroll() {
      closePreview();
    }

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [closePreview, visible]);

  const category = article.categories?.[0]?.name ?? "Maqola";
  const time = article.publishedAt ?? article.createdAt;
  const excerpt = hasArticleExcerpt(article.title, article.excerpt)
    ? truncateToWords(
        formatArticleExcerpt(article.title, article.excerpt),
        PREVIEW_WORDS,
      )
    : article.previewText
      ? truncateToWords(article.previewText, PREVIEW_WORDS)
      : "";

  const preview =
    mounted && enabled && visible && panelRect
      ? createPortal(
          <>
            <div
              className={cn(
                "article-card-hover-lift__backdrop",
                open && "article-card-hover-lift__backdrop--visible",
              )}
              aria-hidden
            />
            <div
              ref={panelRef}
              className={cn(
                "article-card-hover-lift__panel",
                open
                  ? "article-card-hover-lift__panel--open"
                  : "article-card-hover-lift__panel--closed",
              )}
              style={{
                top: panelRect.top,
                left: panelRect.left,
                width: panelRect.width,
                transformOrigin: panelStyle.transformOrigin,
                transform: panelStyle.transform,
              }}
              onTransitionEnd={handleTransitionEnd}
              role="tooltip"
              aria-label={article.title}
            >
              <div className="article-card-hover-lift__inner">
                <p className="article-card-hover-lift__meta">
                  {category}
                  {time ? ` · ${formatRelativeTime(time)}` : ""}
                </p>
                <p className="article-card-hover-lift__title">{article.title}</p>
                {excerpt ? (
                  <p className="article-card-hover-lift__excerpt">{excerpt}</p>
                ) : null}
                <p className="article-card-hover-lift__hint">O&apos;qish uchun bosing</p>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div
      ref={wrapRef}
      className={cn("min-w-0", className)}
      onMouseEnter={scheduleOpen}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {preview}
    </div>
  );
}
