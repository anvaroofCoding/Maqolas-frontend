"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

export const MIN_AI_PROMPT_LENGTH = 20;
export const MAX_AI_PROMPT_WORDS = 1000;
const JOB_POLL_INTERVAL_MS = 2000;

function isJobActive(job: AiArticleJob | null | undefined) {
  return job?.status === "pending" || job?.status === "processing";
}

function isJobFinished(job: AiArticleJob | null | undefined) {
  return job?.status === "completed" || job?.status === "failed";
}

export function useAiArticleGenerator() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeJob, setActiveJob] = useState<AiArticleJob | null>(null);
  const [trackedJobId, setTrackedJobId] = useState<string | null>(null);
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
  const promptWordCount = countWords(prompt);

  const handleCompleted = useCallback(
    (job: AiArticleJob) => {
      if (!job.articleId) return;
      if (redirectedJobIdRef.current === job.id) return;

      redirectedJobIdRef.current = job.id;
      setTrackedJobId(null);

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

  const resetFailedJob = useCallback(() => {
    setActiveJob(null);
    setTrackedJobId(null);
  }, []);

  const submit = useCallback(async () => {
    if (!isAuthenticated && !accessToken) {
      return { needsAuth: true as const };
    }

    const trimmed = prompt.trim();
    if (trimmed.length < MIN_AI_PROMPT_LENGTH) {
      toast.error("Maqola talabini kamida 20 ta belgidan yozing");
      return { needsAuth: false as const, ok: false as const };
    }

    if (promptWordCount > MAX_AI_PROMPT_WORDS) {
      toast.error(`Maqola talabi ${MAX_AI_PROMPT_WORDS} ta so'zdan oshmasligi kerak`);
      return { needsAuth: false as const, ok: false as const };
    }

    if (quota.remaining <= 0) {
      toast.error("Kunlik AI limiti tugadi. Ertaga qayta urinib ko'ring.");
      return { needsAuth: false as const, ok: false as const };
    }

    try {
      const result = await generateArticle({ prompt: trimmed }).unwrap();
      setActiveJob(result.job);
      setTrackedJobId(result.job.id);
      setPrompt("");
      return { needsAuth: false as const, ok: true as const };
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
      return { needsAuth: false as const, ok: false as const };
    }
  }, [
    accessToken,
    generateArticle,
    isAuthenticated,
    prompt,
    promptWordCount,
    quota.remaining,
  ]);

  return {
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
  };
}
