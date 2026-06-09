"use client";

import { CheckCircle2Icon, Loader2Icon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AiPromptGuideButton,
  AiPromptGuideDialog,
} from "@/components/ai-article/ai-prompt-guide-dialog";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { AiIcon } from "@/components/icons/ai-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  useGenerateAiArticleMutation,
  useGetActiveAiArticleJobQuery,
  useGetAiArticleQuotaQuery,
  useLazyGetAiArticleJobQuery,
} from "@/features/ai-article/api/ai-article-api";
import type { AiArticleJob } from "@/features/ai-article/types";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { countWords } from "@/lib/text/count-words";
import { cn } from "@/lib/utils";

type AiArticleContextValue = {
  activeJob: AiArticleJob | null;
  isProcessing: boolean;
};

const AiArticleContext = createContext<AiArticleContextValue>({
  activeJob: null,
  isProcessing: false,
});

export function useAiArticle() {
  return useContext(AiArticleContext);
}

const POLL_INTERVAL_MS = 2000;
const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_WORDS = 1000;

function isJobActive(job: AiArticleJob | null | undefined) {
  return job?.status === "pending" || job?.status === "processing";
}

function ThinkingSteps({ job }: { job: AiArticleJob }) {
  const steps = job.thinkingSteps;
  const current = job.currentStep;

  return (
    <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
      {steps.map((step, index) => (
        <div
          key={`${step}-${index}`}
          className="flex items-start gap-2 text-xs text-muted-foreground"
        >
          <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>{step}</span>
        </div>
      ))}
      {current && !steps.includes(current) ? (
        <div className="flex items-start gap-2 text-xs text-foreground">
          <Loader2Icon className="mt-0.5 size-3.5 shrink-0 animate-spin text-primary" />
          <span>{current}</span>
        </div>
      ) : isJobActive(job) ? (
        <div className="flex items-start gap-2 text-xs text-foreground">
          <Loader2Icon className="mt-0.5 size-3.5 shrink-0 animate-spin text-primary" />
          <span>AI o&apos;ylamoqda...</span>
        </div>
      ) : null}
    </div>
  );
}

export function AiArticleAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeJob, setActiveJob] = useState<AiArticleJob | null>(null);
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);
  const redirectedJobIdRef = useRef<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const skip = !mounted || !accessToken;
  const { data: quotaData } = useGetAiArticleQuotaQuery(undefined, { skip });
  const { data: activeData, refetch: refetchActive } =
    useGetActiveAiArticleJobQuery(undefined, { skip });
  const [generateArticle, { isLoading: isStarting }] =
    useGenerateAiArticleMutation();
  const [fetchJob] = useLazyGetAiArticleJobQuery();

  const quota = quotaData ?? { limit: 2, used: 0, remaining: 2 };
  const isProcessing = isJobActive(activeJob);

  const handleCompleted = useCallback(
    (job: AiArticleJob) => {
      if (!job.articleId) return;
      if (redirectedJobIdRef.current === job.id) return;

      redirectedJobIdRef.current = job.id;
      toast.success("AI maqolangiz tayyor!");
      router.push(`/yozish/${job.articleId}`);
    },
    [router],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!activeData) return;

    if (activeData.job) {
      setActiveJob(activeData.job);
      if (activeData.job.status === "completed") {
        handleCompleted(activeData.job);
      }
      return;
    }

    if (!isStarting) {
      setActiveJob((prev) => {
        if (!prev) return null;
        if (isJobActive(prev)) return prev;
        return prev.status === "failed" ? prev : null;
      });
    }
  }, [activeData, handleCompleted, isStarting]);

  useEffect(() => {
    if (!skip) {
      void refetchActive();
    }
  }, [skip, refetchActive]);

  useEffect(() => {
    if (!activeJob?.id || !isJobActive(activeJob)) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        const result = await fetchJob(activeJob.id).unwrap();
        setActiveJob(result.job);

        if (result.job.status === "completed") {
          handleCompleted(result.job);
        } else if (result.job.status === "failed") {
          toast.error(result.job.errorMessage ?? "Maqola yaratilmadi");
        }
      } catch {
        // Polling xatosi — keyingi urinishda davom etadi
      }
    };

    if (!pollTimerRef.current) {
      pollTimerRef.current = setInterval(() => {
        void poll();
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [activeJob?.id, activeJob?.status, fetchJob, handleCompleted]);

  useEffect(() => {
    if (isProcessing && !open) {
      setShowFloatingStatus(true);
    }
    if (!isProcessing) {
      setShowFloatingStatus(false);
    }
  }, [isProcessing, open]);

  const hiddenRoutes =
    pathname?.startsWith("/auth") || pathname?.startsWith("/admin");

  if (!mounted || hiddenRoutes) {
    return null;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !isAuthenticated && !accessToken) {
      setLoginOpen(true);
      return;
    }
    setOpen(nextOpen);
  };

  const promptWordCount = countWords(prompt);

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (trimmed.length < MIN_PROMPT_LENGTH) {
      toast.error("Maqola talabini kamida 20 ta belgidan yozing");
      return;
    }

    if (promptWordCount > MAX_PROMPT_WORDS) {
      toast.error(`Maqola talabi ${MAX_PROMPT_WORDS} ta so'zdan oshmasligi kerak`);
      return;
    }

    if (quota.remaining <= 0) {
      toast.error("Kunlik AI limiti tugadi. Ertaga qayta urinib ko'ring.");
      return;
    }

    try {
      const result = await generateArticle({ prompt: trimmed }).unwrap();
      setActiveJob(result.job);
      setPrompt("");
      setShowFloatingStatus(true);
    } catch (error) {
      const message =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "So'rov yuborilmadi";
      toast.error(message);
    }
  };

  return (
    <AiArticleContext.Provider value={{ activeJob, isProcessing }}>
      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <AiPromptGuideDialog open={guideOpen} onOpenChange={setGuideOpen} />

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {showFloatingStatus && isProcessing && !open ? (
          <div className="pointer-events-auto w-[min(100vw-2.5rem,20rem)] rounded-xl border bg-popover p-3 shadow-lg ring-1 ring-foreground/10">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Loader2Icon className="size-4 animate-spin text-primary" />
                <p className="text-sm font-medium">AI maqola yozmoqda</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Yopish"
                onClick={() => setShowFloatingStatus(false)}
              >
                <XIcon />
              </Button>
            </div>
            {activeJob ? <ThinkingSteps job={activeJob} /> : null}
            <p className="mt-2 text-[11px] text-muted-foreground">
              Oynani yopsangiz ham jarayon davom etadi
            </p>
          </div>
        ) : null}

        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon-lg"
              className={cn(
                "pointer-events-auto size-12 rounded-full shadow-lg",
                isProcessing && "animate-pulse",
              )}
              aria-label="AI maqola yordamchisi"
            >
              <AiIcon className="size-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-[min(100vw-2.5rem,22rem)] p-0"
          >
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <AiIcon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI maqola yordamchisi</p>
                    <p className="text-xs text-muted-foreground">
                      Mavzuni yozing — AI maqolani tayyorlab beradi
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {quota.remaining}/{quota.limit}
                </Badge>
              </div>

              {isProcessing && activeJob ? (
                <div className="space-y-3">
                  <Separator />
                  <ThinkingSteps job={activeJob} />
                  <p className="text-[11px] text-muted-foreground">
                    Bu oynani yopsangiz ham AI yozishni davom ettiradi
                  </p>
                </div>
              ) : activeJob?.status === "failed" ? (
                <div className="space-y-3">
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                    {activeJob.errorMessage ?? "Maqola yaratilmadi"}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveJob(null)}
                  >
                    Yangi so&apos;rov yuborish
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-foreground">
                      Maqola talabi
                    </p>
                    <AiPromptGuideButton onClick={() => setGuideOpen(true)} />
                  </div>
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={5}
                    disabled={isStarting}
                    className="min-h-[120px] resize-none"
                  />
                  <p
                    className={cn(
                      "text-right text-[11px]",
                      promptWordCount > MAX_PROMPT_WORDS
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {promptWordCount}/{MAX_PROMPT_WORDS} so&apos;z
                  </p>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={
                      isStarting ||
                      quota.remaining <= 0 ||
                      prompt.trim().length < MIN_PROMPT_LENGTH ||
                      promptWordCount > MAX_PROMPT_WORDS
                    }
                    onClick={() => void handleSubmit()}
                  >
                    {isStarting ? (
                      <>
                        <Loader2Icon className="animate-spin" />
                        Boshlanmoqda...
                      </>
                    ) : (
                      "Maqola yozishni boshlash"
                    )}
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </AiArticleContext.Provider>
  );
}
