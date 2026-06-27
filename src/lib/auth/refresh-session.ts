import { env } from "@/config/env";
import { getRefreshToken } from "@/features/auth/slice/auth-slice";

export type AuthTokensPayload = {
  accessToken: string;
  refreshToken: string;
};

let refreshPromise: Promise<AuthTokensPayload | null> | null = null;

async function requestTokenRefresh(): Promise<AuthTokensPayload | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  return (await response.json()) as AuthTokensPayload;
}

/** Bir vaqtning o'zida faqat bitta refresh so'rovi yuboriladi. */
export function refreshSessionTokens(): Promise<AuthTokensPayload | null> {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
