"use client";

import { XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiArticleFormPanel } from "@/components/ai-article/ai-article-form-panel";
import {
  AiPromptGuideDialog,
} from "@/components/ai-article/ai-prompt-guide-dialog";
import { AiWritingStream } from "@/components/ai-article/ai-writing-stream";
import { useAiArticleGenerator } from "@/components/ai-article/use-ai-article-generator";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
import { AiIcon } from "@/components/icons/ai-icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AiArticleJob } from "@/features/ai-article/types";
import { cn } from "@/lib/utils";
import {
  createContext,
  useContext,
} from "react";

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

export function AiArticleAssistant() {
  const pathname = usePathname();
  const { chromeHidden, focusMode } = useWriteChrome();
  const [open, setOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);

  const {
    mounted,
    isAuthenticated,
    accessToken,
    quota,
    prompt,
    setPrompt,
    promptWordCount,
    activeJob,
    isProcessing,
    isStarting,
    submit,
    resetFailedJob,
  } = useAiArticleGenerator();

  const hideFloatingAssistant =
    pathname?.startsWith("/yozish") && (chromeHidden || focusMode);
  const hiddenRoutes =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/ai");

  useEffect(() => {
    if (isProcessing && !open) {
      setShowFloatingStatus(true);
    }
    if (!isProcessing) {
      setShowFloatingStatus(false);
    }
  }, [isProcessing, open]);

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

  const handleSubmit = async () => {
    const result = await submit();
    if (result?.needsAuth) {
      setLoginOpen(true);
      return;
    }
    if (result?.ok) {
      setShowFloatingStatus(true);
    }
  };

  return (
    <AiArticleContext.Provider value={{ activeJob, isProcessing }}>
      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <AiPromptGuideDialog open={guideOpen} onOpenChange={setGuideOpen} />

      <div
        className={cn(
          "pointer-events-none fixed bottom-5 right-5 z-50 hidden flex-col items-end gap-3 md:flex sm:bottom-6 sm:right-6",
          hideFloatingAssistant && "!hidden",
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
                isProcessing &&
                  "ring-2 ring-primary/35 ring-offset-2 ring-offset-background",
              )}
              aria-label="AI maqola yordamchisi"
              data-tour="ai-assistant"
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
            <div className="p-4">
              <AiArticleFormPanel
                quota={quota}
                prompt={prompt}
                onPromptChange={setPrompt}
                promptWordCount={promptWordCount}
                isStarting={isStarting}
                isProcessing={isProcessing}
                activeJob={activeJob}
                onSubmit={() => void handleSubmit()}
                onResetFailed={resetFailedJob}
                onOpenGuide={() => setGuideOpen(true)}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </AiArticleContext.Provider>
  );
}
