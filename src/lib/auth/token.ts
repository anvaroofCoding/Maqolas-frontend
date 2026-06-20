export function isTokenExpired(
  token: string | null | undefined,
  skewSeconds = 30,
): boolean {
  if (!token) return true;

  try {
    const segment = token.split(".")[1];
    if (!segment) return true;

    const payload = JSON.parse(atob(segment)) as { exp?: number };
    if (typeof payload.exp !== "number") return true;

    return Date.now() >= (payload.exp - skewSeconds) * 1000;
  } catch {
    return true;
  }
}
