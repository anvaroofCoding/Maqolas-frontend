import type { ArticleAuthor } from "@/features/articles/types";

export type NotificationType =
  | "article_liked"
  | "article_commented"
  | "comment_replied"
  | "user_followed"
  | "article_approved"
  | "article_rejected"
  | "admin_article_review"
  | "admin_topic_suggestion"
  | "admin_welcome_promo_comment"
  | "admin_comment_report"
  | "admin_new_user";

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
