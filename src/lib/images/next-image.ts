const OPTIMIZED_IMAGE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "maqolas.tm2.uz",
  "lh3.googleusercontent.com",
  "picsum.photos",
  "c0.wallpaperflare.com",
  "uzreport.news",
  "static.norma.uz",
  "tse1.mm.bing.net",
]);

export function canOptimizeRemoteImage(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    if (OPTIMIZED_IMAGE_HOSTS.has(hostname)) {
      return true;
    }

    return hostname.endsWith(".googleusercontent.com");
  } catch {
    return false;
  }
}

export function articleImageProps(
  src: string,
  options: { priority?: boolean } = {},
) {
  const priority = options.priority ?? false;
  const unoptimized = !canOptimizeRemoteImage(src);

  if (priority) {
    return {
      unoptimized,
      priority: true,
      fetchPriority: "high" as const,
      loading: "eager" as const,
    };
  }

  return {
    unoptimized,
    loading: "lazy" as const,
  };
}
