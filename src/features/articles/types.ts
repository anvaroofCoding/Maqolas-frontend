export type ArticleStatus = "draft" | "review" | "published" | "rejected";

export interface ArticleAuthor {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
  status: ArticleStatus;
  excerpt?: string;
  coverImageUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isPinned?: boolean;
  isNew?: boolean;
  categories?: ArticleCategory[];
  publishedAt?: string;
  submittedAt?: string;
  reviewNote?: string;
  author?: ArticleAuthor;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyArticle {
  id: string;
  slug: string;
  title: string;
  contentHtml: string;
  status: ArticleStatus;
  excerpt?: string;
  coverImageUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  reviewNote?: string;
  submittedAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyArticlesResponse {
  articles: MyArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ArticleSummary = Omit<Article, "contentJson" | "authorId" | "status">;

export interface ArticleFeedResponse {
  articles: ArticleSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ArticleSearchResponse {
  articles: ArticleSummary[];
}

export interface ArticleCommentAuthor {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
}

export interface ArticleComment {
  id: string;
  content: string;
  parentId?: string;
  likeCount?: number;
  likedByMe?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: ArticleCommentAuthor;
  replies?: ArticleComment[];
}

export interface PopularComment {
  id: string;
  content: string;
  likeCount: number;
  likedByMe?: boolean;
  createdAt?: string;
  author?: ArticleCommentAuthor;
  article: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface PopularCommentsResponse {
  comments: PopularComment[];
}

export interface ArticleEngagement {
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
}

export interface ArticleCommentsResponse {
  comments: ArticleComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SaveArticlePayload {
  title?: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
  status?: ArticleStatus;
}
