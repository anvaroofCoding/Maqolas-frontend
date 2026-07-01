"use client";

import { AiWritingStream } from "@/components/ai-article/ai-writing-stream";
import {
  AiPromptGuideButton,
} from "@/components/ai-article/ai-prompt-guide-dialog";
import {
  MAX_AI_PROMPT_WORDS,
  MIN_AI_PROMPT_LENGTH,
} from "@/components/ai-article/use-ai-article-generator";
import { AiIcon } from "@/components/icons/ai-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { AiArticleJob, AiArticleQuota } from "@/features/ai-article/types";
import { cn } from "@/lib/utils";

type AiArticleFormPanelProps = {
  quota: AiArticleQuota;
  prompt: string;
  onPromptChange: (value: string) => void;
  promptWordCount: number;
  isStarting: boolean;
  isProcessing: boolean;
  activeJob: AiArticleJob | null;
  onSubmit: () => void;
  onResetFailed: () => void;
  onOpenGuide: () => void;
  className?: string;
};

export function AiArticleFormPanel({
  quota,
  prompt,
  onPromptChange,
  promptWordCount,
  isStarting,
  isProcessing,
  activeJob,
  onSubmit,
  onResetFailed,
  onOpenGuide,
  className,
}: AiArticleFormPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AiIcon className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              AI maqola yordamchisi
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Talabingizni yozing — AI maqola tayyorlab beradi.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {quota.remaining}/{quota.limit}
        </Badge>
      </div>

      {isProcessing && activeJob ? (
        <div className="space-y-3">
          <Separator />
          <AiWritingStream job={activeJob} />
        </div>
      ) : activeJob?.status === "failed" ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {activeJob.errorMessage ?? "Maqola yaratilmadi"}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={onResetFailed}
          >
            Yangi so&apos;rov yuborish
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Maqola talabi</p>
            <AiPromptGuideButton onClick={onOpenGuide} />
          </div>
          <Textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            rows={6}
            disabled={isStarting}
            placeholder="Masalan: Startaplar uchun marketing bo'yicha qisqa va amaliy maqola yoz..."
            className="min-h-[140px] resize-none rounded-xl"
          />
          <p
            className={cn(
              "text-right text-xs",
              promptWordCount > MAX_AI_PROMPT_WORDS
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {promptWordCount}/{MAX_AI_PROMPT_WORDS} so&apos;z
          </p>
          <Button
            type="button"
            className="w-full rounded-full"
            disabled={
              isStarting ||
              quota.remaining <= 0 ||
              prompt.trim().length < MIN_AI_PROMPT_LENGTH ||
              promptWordCount > MAX_AI_PROMPT_WORDS
            }
            onClick={onSubmit}
          >
            {isStarting ? "Boshlanmoqda..." : "Maqola yozishni boshlash"}
          </Button>
        </>
      )}
    </div>
  );
}
