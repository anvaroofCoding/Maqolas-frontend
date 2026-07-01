"use client";

import { useState } from "react";
import { AiArticleFormPanel } from "@/components/ai-article/ai-article-form-panel";
import { AiPromptGuideDialog } from "@/components/ai-article/ai-prompt-guide-dialog";
import { useAiArticleGenerator } from "@/components/ai-article/use-ai-article-generator";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Button } from "@/components/ui/button";
import { feedMainClassName } from "@/lib/layout";

export function AiArticlePageClient() {
  const [guideOpen, setGuideOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const {
    mounted,
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

  if (!mounted) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center pb-10 pt-4">
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      </main>
    );
  }

  const handleSubmit = async () => {
    const result = await submit();
    if (result?.needsAuth) {
      setLoginOpen(true);
    }
  };

  return (
    <main className={feedMainClassName}>
      <div className="mx-auto w-full max-w-2xl px-1 pt-2 sm:px-0 sm:pt-4">
        {!accessToken ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              AI maqola yordamchisidan foydalanish uchun tizimga kiring.
            </p>
            <Button
              type="button"
              className="mt-4 rounded-full"
              onClick={() => setLoginOpen(true)}
            >
              Kirish
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
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
        )}
      </div>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <AiPromptGuideDialog open={guideOpen} onOpenChange={setGuideOpen} />
    </main>
  );
}
