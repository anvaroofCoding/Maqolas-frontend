import type { ArticleAuthor } from "@/features/articles/types";

export type NotificationType =
  | "article_liked"
  | "article_commented"
  | "comment_replied"
  | "user_followed"
  | "article_approved"
  | "article_rejected";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  link?: string;
  articleId?: string;
  isRead: boolean;
  actor?: ArticleAuthor;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
