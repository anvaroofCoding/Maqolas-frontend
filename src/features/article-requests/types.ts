export type ArticleRequestStatus = "new" | "in_progress" | "fulfilled";

export type ArticleRequestModerationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type ArticleRequestUser = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
};

export type ArticleRequest = {
  id: string;
  title: string;
  description: string;
  authorNote?: string;
  status: ArticleRequestStatus;
  moderationStatus?: ArticleRequestModerationStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  likeCount: number;
  likedByMe?: boolean;
  requester?: ArticleRequestUser;
  author?: ArticleRequestUser;
  createdAt: string;
  updatedAt: string;
};

export type TrendingArticleRequestsResponse = {
  requests: ArticleRequest[];
};

export type ArticleRequestsResponse = {
  requests: ArticleRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateArticleRequestPayload = {
  authorUsername?: string;
  title: string;
  description: string;
};
