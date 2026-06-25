"use client";

import { XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiWritingStream } from "@/components/ai-article/ai-writing-stream";
import {
  AiPromptGuideButton,
  AiPromptGuideDialog,
} from "@/components/ai-article/ai-prompt-guide-dialog";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
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
  aiArticleApi,
  useGenerateAiArticleMutation,
  useGetActiveAiArticleJobQuery,
  useGetAiArticleJobQuery,
  useGetAiArticleQuotaQuery,
} from "@/features/ai-article/api/ai-article-api";
import type { AiArticleJob } from "@/features/ai-article/types";
import { toast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
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

const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_WORDS = 1000;
const JOB_POLL_INTERVAL_MS = 2000;

function isJobActive(job: AiArticleJob | null | undefined) {
  return job?.status === "pending" || job?.status === "processing";
}

function isJobFinished(job: AiArticleJob | null | undefined) {
  return job?.status === "completed" || job?.status === "failed";
}

export function AiArticleAssistant() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { chromeHidden, focusMode } = useWriteChrome();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeJob, setActiveJob] = useState<AiArticleJob | null>(null);
  const [trackedJobId, setTrackedJobId] = useState<string | null>(null);
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);
  const redirectedJobIdRef = useRef<string | null>(null);

  const skip = !mounted || !accessToken;
  const { data: quotaData } = useGetAiArticleQuotaQuery(undefined, { skip });
  const { data: activeData } = useGetActiveAiArticleJobQuery(undefined, {
    skip,
    pollingInterval: trackedJobId ? JOB_POLL_INTERVAL_MS : 0,
  });
  const { data: trackedJobData } = useGetAiArticleJobQuery(trackedJobId ?? "", {
    skip: skip || !trackedJobId,
    pollingInterval: trackedJobId ? JOB_POLL_INTERVAL_MS : 0,
  });
  const [generateArticle, { isLoading: isStarting }] =
    useGenerateAiArticleMutation();

  const quota = quotaData ?? { limit: 2, used: 0, remaining: 2 };
  const isProcessing = isJobActive(activeJob);
  const hideFloatingAssistant =
    pathname?.startsWith("/yozish") && (chromeHidden || focusMode);

  const handleCompleted = useCallback(
    (job: AiArticleJob) => {
      if (!job.articleId) return;
      if (redirectedJobIdRef.current === job.id) return;

      redirectedJobIdRef.current = job.id;
      setTrackedJobId(null);
      setShowFloatingStatus(false);
      setOpen(false);

      dispatch(
        aiArticleApi.util.invalidateTags([
          { type: "AiArticle", id: "ACTIVE" },
          { type: "AiArticle", id: "ARCHIVE" },
          { type: "Article", id: "MINE" },
        ]),
      );

      toast.success("AI maqolangiz tayyor!");
      router.push(`/yozish/${job.articleId}`);
    },
    [dispatch, router],
  );

  const handleFailed = useCallback((job: AiArticleJob) => {
    setTrackedJobId(null);
    setShowFloatingStatus(false);
    setActiveJob(job);
    toast.error(job.errorMessage ?? "Maqola yaratilmadi");
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const activeJobFromServer = activeData?.job;
    if (!activeJobFromServer || !isJobActive(activeJobFromServer)) {
      return;
    }

    setActiveJob(activeJobFromServer);
    setTrackedJobId(activeJobFromServer.id);
    setShowFloatingStatus(true);
  }, [activeData?.job]);

  useEffect(() => {
    const job = trackedJobData?.job;
    if (!job) return;

    setActiveJob(job);

    if (job.status === "completed") {
      handleCompleted(job);
      return;
    }

    if (job.status === "failed") {
      handleFailed(job);
    }
  }, [trackedJobData?.job, handleCompleted, handleFailed]);

  useEffect(() => {
    if (!activeJob || isJobActive(activeJob)) return;
    if (isJobFinished(activeJob) && activeJob.status !== "failed") {
      setTrackedJobId(null);
    }
  }, [activeJob]);

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
      setTrackedJobId(result.job.id);
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

      <div
        className={cn(
          "pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6",
          hideFloatingAssistant && "hidden",
        )}
      >
        {showFloatingStatus && isProcessing && !open ? (
          <div className="pointer-events-auto w-[min(100vw-2.5rem,20rem)] rounded-xl border bg-popover p-3 shadow-lg ring-1 ring-foreground/10">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-primary/40" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
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
            {activeJob ? <AiWritingStream job={activeJob} /> : null}
          </div>
        ) : null}

        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon-lg"
              className={cn(
                "pointer-events-auto size-12 rounded-full shadow-lg",
                isProcessing && "ring-2 ring-primary/35 ring-offset-2 ring-offset-background",
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
                  </div>
                </div>
                <Badge variant="secondary">
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
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                    {activeJob.errorMessage ?? "Maqola yaratilmadi"}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setActiveJob(null);
                      setTrackedJobId(null);
                    }}
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
                    {isStarting ? "Boshlanmoqda..." : "Maqola yozishni boshlash"}
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
