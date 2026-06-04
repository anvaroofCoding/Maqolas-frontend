export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  provider?: string;
}

export interface AuthTokensResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
