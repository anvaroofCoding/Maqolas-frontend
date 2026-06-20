"use client";

import { useEffect, useRef, useState } from "react";
import type { AiArticleJob } from "@/features/ai-article/types";
import { cn } from "@/lib/utils";

const AMBIENT_WORDS = [
  "tahlil",
  "mavzu",
  "struktura",
  "kirish",
  "asosiy",
  "fikr",
  "misol",
  "xulosa",
  "paragraf",
  "uslub",
  "mantiq",
  "fakt",
  "g'oya",
  "bo'lim",
  "matn",
  "yakun",
  "chuqur",
  "professional",
  "o'qilishi",
  "izchil",
];

function useTypewriter(text: string, active: boolean, speed = 24) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active || !text) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, active, speed]);

  return displayed;
}

function pickAmbientWord(seen: Set<string>): string {
  const available = AMBIENT_WORDS.filter((word) => !seen.has(word));
  const pool = available.length > 0 ? available : AMBIENT_WORDS;
  return pool[Math.floor(Math.random() * pool.length)] ?? "matn";
}

type AiWritingStreamProps = {
  job: AiArticleJob;
  className?: string;
};

export function AiWritingStream({ job, className }: AiWritingStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const seenWordsRef = useRef<Set<string>>(new Set());
  const [ambientWords, setAmbientWords] = useState<string[]>([]);

  const isActive = job.status === "pending" || job.status === "processing";
  const completedSteps = job.thinkingSteps;
  const activeStep =
    job.currentStep && !completedSteps.includes(job.currentStep)
      ? job.currentStep
      : isActive
        ? "Maqola matni shakllanmoqda..."
        : "";

  const typedActive = useTypewriter(activeStep, isActive && Boolean(activeStep));

  useEffect(() => {
    if (!isActive) {
      setAmbientWords([]);
      seenWordsRef.current.clear();
      return;
    }

    const timer = window.setInterval(() => {
      const next = pickAmbientWord(seenWordsRef.current);
      seenWordsRef.current.add(next);
      setAmbientWords((prev) => {
        const combined = [...prev, next];
        return combined.slice(-36);
      });
    }, 520);

    return () => window.clearInterval(timer);
  }, [isActive, job.id]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [completedSteps, typedActive, ambientWords]);

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-popover to-transparent" />
      <div
        ref={scrollRef}
        className="max-h-44 overflow-y-auto scroll-smooth px-0.5 pb-1 pt-2 [scrollbar-width:thin]"
      >
        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed">
          {completedSteps.map((step, index) => (
            <p
              key={`${step}-${index}`}
              className="animate-in fade-in slide-in-from-bottom-1 text-muted-foreground/75 duration-300"
            >
              {step}
            </p>
          ))}

          {isActive && activeStep ? (
            <p className="text-foreground">
              {typedActive}
              <span className="ai-cursor ml-0.5 inline-block text-primary">|</span>
            </p>
          ) : null}

          {isActive && ambientWords.length > 0 ? (
            <p className="animate-in fade-in duration-500 text-primary/55">
              {ambientWords.join(" ")}
              <span className="ai-cursor ml-0.5 inline-block opacity-60">|</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
