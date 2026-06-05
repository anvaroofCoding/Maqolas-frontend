export interface UserSocialLinks {
  website?: string;
  linkedin?: string;
  telegram?: string;
  instagram?: string;
}

export type UserRole = "user" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role?: UserRole;
  displayNameEdited?: boolean;
  bio?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  avatarEdited?: boolean;
  social?: UserSocialLinks;
  provider?: string;
}

export interface UserStats {
  articlesCount: number;
  followersCount: number;
}

export interface MeResponse {
  user: AuthUser;
  stats: UserStats;
}

export interface AuthTokensResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  social?: UserSocialLinks;
}
