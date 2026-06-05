import type { UserSocialLinks } from "@/features/auth/types";

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  social?: UserSocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicUserStats {
  articlesCount: number;
  followersCount: number;
}

export interface PublicProfileResponse {
  user: PublicUser;
  stats: PublicUserStats;
  isFollowing: boolean;
}

export interface FollowersResponse {
  followers: PublicUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FollowResponse {
  following: boolean;
  followersCount: number;
}
