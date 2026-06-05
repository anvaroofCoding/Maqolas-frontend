"use client";

import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SkipBackIcon,
  SkipForwardIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  extractWordsFromArticle,
  getOptimalRecognitionIndex,
} from "@/lib/articles/plain-text";
import { cn } from "@/lib/utils";

type ArticleSpeedReaderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  contentHtml: string;
};

function WordDisplay({ word }: { word: string }) {
  const chars = [...word];
  const focusIndex = getOptimalRecognitionIndex(word);

  return (
    <span className="inline-flex items-baseline text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
      {chars.map((char, index) => (
        <span
          key={`${word}-${index}`}
          className={cn(index === focusIndex && "text-nav-active")}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export function ArticleSpeedReader({
  open,
  onOpenChange,
  title,
  contentHtml,
}: ArticleSpeedReaderProps) {
  const words = useMemo(
    () => extractWordsFromArticle(title, contentHtml),
    [title, contentHtml],
  );
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(250);
  const timerRef = useRef<number | null>(null);

  const currentWord = words[index] ?? "";
  const totalWords = words.length;
  const progress = totalWords > 0 ? ((index + 1) / totalWords) * 100 : 0;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const restart = useCallback(() => {
    stop();
    setIndex(0);
  }, [stop]);

  const goNext = useCallback(() => {
    setIndex((current) => Math.min(current + 1, Math.max(totalWords - 1, 0)));
  }, [totalWords]);

  const goPrev = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  const togglePlay = useCallback(() => {
    if (totalWords === 0) return;
    if (index >= totalWords - 1) {
      setIndex(0);
    }
    setIsPlaying((playing) => !playing);
  }, [index, totalWords]);

  useEffect(() => {
    if (!open) {
      stop();
      setIndex(0);
      setWpm(250);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, stop]);

  useEffect(() => {
    if (!isPlaying || totalWords === 0) {
      clearTimer();
      return;
    }

    const intervalMs = Math.max(120, Math.round(60_000 / wpm));
    timerRef.current = window.setInterval(() => {
      setIndex((current) => {
        if (current >= totalWords - 1) {
          stop();
          return current;
        }
        return current + 1;
      });
    }, intervalMs);

    return clearTimer;
  }, [clearTimer, isPlaying, stop, totalWords, wpm]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }
      if (event.code === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.code === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, onOpenChange, open, togglePlay]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Yopish"
          onClick={() => onOpenChange(false)}
        >
          <XIcon className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
        {totalWords === 0 ? (
          <p className="text-sm text-muted-foreground">O&apos;qish uchun matn topilmadi.</p>
        ) : (
          <>
            <div className="flex min-h-[5rem] items-center justify-center text-center">
              <WordDisplay word={currentWord} />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {index + 1} / {totalWords}
            </p>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Qayta boshlash"
                onClick={restart}
              >
                <RotateCcwIcon className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Oldingi so'z"
                onClick={goPrev}
                disabled={index === 0}
              >
                <SkipBackIcon className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                size="icon-lg"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                aria-label={isPlaying ? "To'xtatish" : "Boshlash"}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <PauseIcon className="size-5" aria-hidden />
                ) : (
                  <PlayIcon className="size-5" aria-hidden />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Keyingi so'z"
                onClick={goNext}
                disabled={index >= totalWords - 1}
              >
                <SkipForwardIcon className="size-4" aria-hidden />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Tezlik: {wpm} so&apos;z/daqiqa
            </p>

            <div className="w-full max-w-md space-y-2">
              <label htmlFor="speed-reader-wpm" className="sr-only">
                O&apos;qish tezligi
              </label>
              <input
                id="speed-reader-wpm"
                type="range"
                min={100}
                max={600}
                step={10}
                value={wpm}
                onChange={(event) => setWpm(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-nav-active"
              />

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Bo&apos;sh joy: to&apos;xtatish/davom · ← : orqaga · → : oldinga
            </p>
          </>
        )}
      </div>
    </div>
  );
}
