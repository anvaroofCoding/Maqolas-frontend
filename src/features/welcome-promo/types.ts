export interface WelcomePromo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  linkLabel?: string;
  isActive: boolean;
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WelcomePromoCommentAuthor {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
}

export interface WelcomePromoComment {
  id: string;
  content: string;
  parentId?: string;
  likeCount?: number;
  likedByMe?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: WelcomePromoCommentAuthor;
  replies?: WelcomePromoComment[];
}

export interface WelcomePromoResponse {
  promo: WelcomePromo | null;
}

export interface WelcomePromosResponse {
  promos: WelcomePromo[];
}

export interface WelcomePromoCommentsResponse {
  comments: WelcomePromoComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateWelcomePromoPayload {
  title: string;
  description: string;
  linkUrl?: string;
  linkLabel?: string;
  isActive?: boolean;
  image: File;
}

export interface UpdateWelcomePromoPayload {
  id: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  linkLabel?: string;
  isActive?: boolean;
  image?: File;
}

export interface WelcomePromoModerationComment {
  id: string;
  content: string;
  status?: string;
  createdAt?: string;
  author?: WelcomePromoCommentAuthor & { email?: string };
  promo?: {
    id: string;
    title: string;
  };
}

export interface WelcomePromoModerationCommentsResponse {
  comments: WelcomePromoModerationComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
