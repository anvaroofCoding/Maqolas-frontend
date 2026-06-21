import type { ArticleAuthor } from "@/features/articles/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModerationArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
  coverImageUrl?: string;
  status: string;
  isPinned?: boolean;
  author?: ArticleAuthor & { email?: string };
  submittedAt?: string;
  publishedAt?: string;
  reviewNote?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export interface ReviewQueueResponse {
  articles: ModerationArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PublishedArticlesResponse {
  articles: ModerationArticle[];
  pagination: ReviewQueueResponse["pagination"];
}

export interface AdminUpdateArticlePayload {
  title?: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
}

export type BanUnit = "hours" | "days" | "months" | "permanent";

export interface AdminBan {
  id: string;
  targetUserId?: string;
  ipAddress?: string;
  reason: string;
  bannedBy: string;
  expiresAt?: string | null;
  isPermanent: boolean;
  isActive: boolean;
  durationAmount?: number;
  durationUnit?: BanUnit;
  createdAt?: string;
}

export interface ReportedComment {
  id: string;
  content?: string;
  authorIp?: string;
  createdAt?: string;
}

export interface ReportedArticleRef {
  id: string;
  title?: string;
  slug?: string;
}

export interface CommentReportItem {
  id: string;
  status: "pending" | "reviewed" | "dismissed";
  reason?: string;
  reporterIp?: string;
  reportedUserIp?: string;
  reporter?: ArticleAuthor & { email?: string };
  reportedUser?: ArticleAuthor & { email?: string };
  comment?: ReportedComment;
  article?: ReportedArticleRef;
  createdAt?: string;
  reviewedAt?: string;
}

export interface ReportsResponse {
  reports: CommentReportItem[];
  pagination: ReviewQueueResponse["pagination"];
}

export interface AdminUserItem {
  id: string;
  displayName?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
  lastLoginAt?: string;
  activeBan?: AdminBan | null;
}

export interface AdminUsersResponse {
  users: AdminUserItem[];
  pagination: ReviewQueueResponse["pagination"];
}

export type AdminEmailRecipientMode = "all" | "selected";

export interface SendAdminEmailPayload {
  subject: string;
  message: string;
  recipientMode: AdminEmailRecipientMode;
  userIds?: string[];
}

export interface SendAdminEmailResponse {
  success: boolean;
  sent: number;
  failed: number;
  total: number;
}

export interface CreateBanPayload {
  reason: string;
  durationUnit: BanUnit;
  durationAmount?: number;
  ipAddress?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type CommentModerationStatus = "pending" | "approved" | "rejected";

export interface ModerationCommentItem {
  id: string;
  content: string;
  status: CommentModerationStatus;
  parentId?: string;
  rejectReason?: string;
  createdAt?: string;
  reviewedAt?: string;
  author?: ArticleAuthor & { email?: string };
  article?: ReportedArticleRef;
}

export interface CommentModerationResponse {
  comments: ModerationCommentItem[];
  pagination: ReviewQueueResponse["pagination"];
}

export type ArticleRequestModerationStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ModerationArticleRequestItem {
  id: string;
  title: string;
  description: string;
  moderationStatus: ArticleRequestModerationStatus;
  rejectionReason?: string;
  reviewedAt?: string;
  likeCount: number;
  createdAt?: string;
  requester?: {
    id: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
  };
  author?: {
    id: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
  };
}

export interface ArticleRequestModerationResponse {
  requests: ModerationArticleRequestItem[];
  pagination: ReviewQueueResponse["pagination"];
}

export interface PlatformStats {
  totalUsers: number;
  totalFollows: number;
  publishedArticles: number;
  approvedComments: number;
  newUsersLast7Days: number;
  newFollowsLast7Days: number;
  generatedAt: string;
}
