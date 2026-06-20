import { env } from "@/config/env";
import { getAccessToken, getRefreshToken } from "@/features/auth/slice/auth-slice";
import { isTokenExpired } from "@/lib/auth/token";
import { wasManualLogout } from "@/lib/auth/logout-client";

/** Faqat "Kirish" tugmasi uchun — avtomatik redirect ishlatilmaydi */
export function getGoogleOAuthUrl() {
  return `${env.NEXT_PUBLIC_API_URL}/auth/google`;
}

export function shouldAttemptAutoGoogleAuth(pathname: string) {
  if (typeof window === "undefined") return false;
  if (wasManualLogout()) return false;
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return false;

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && !isTokenExpired(accessToken)) return false;
  if (
    accessToken &&
    isTokenExpired(accessToken) &&
    refreshToken &&
    !isTokenExpired(refreshToken)
  ) {
    return false;
  }

  return true;
}
