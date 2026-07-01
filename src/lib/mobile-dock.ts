export function shouldShowMobileDock(pathname: string | null) {
  if (!pathname) return false;
  if (pathname.startsWith("/yozish")) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/auth")) return false;
  return true;
}
