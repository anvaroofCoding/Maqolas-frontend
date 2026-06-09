export type AiArticleJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type AiArticleJob = {
  id: string;
  prompt: string;
  status: AiArticleJobStatus;
  thinkingSteps: string[];
  currentStep: string | null;
  articleId: string | null;
  generatedTitle: string | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type AiArticleQuota = {
  limit: number;
  used: number;
  remaining: number;
};

export type AiArticleArchiveResponse = {
  items: AiArticleJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
