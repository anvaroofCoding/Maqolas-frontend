export interface PinAuthor {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
}

export interface PinSummary {
  id: string;
  title: string;
  description?: string;
  slug: string;
  imageUrl: string;
  width?: number;
  height?: number;
  dominantColor?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  likedByMe?: boolean;
  author?: PinAuthor;
}

export interface PinDetailResponse {
  pin: PinSummary;
}

export interface PinFeedResponse {
  pins: PinSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PinEngagementResponse {
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface PinCommentAuthor {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
}

export interface PinComment {
  id: string;
  content: string;
  parentId?: string;
  likeCount: number;
  createdAt?: string;
  updatedAt?: string;
  likedByMe?: boolean;
  author?: PinCommentAuthor;
  replies?: PinComment[];
}

export interface PinCommentsResponse {
  comments: PinComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePinPayload {
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  image: File;
}
