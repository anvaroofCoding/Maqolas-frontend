import { isAllowedProxyImageUrl } from "@/lib/articles/resolve-media-url";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url || !isAllowedProxyImageUrl(url)) {
    return new Response("Ruxsat berilmagan yoki noto'g'ri URL", { status: 400 });
  }

  try {
    const upstream = await fetch(url, { cache: "force-cache" });
    if (!upstream.ok) {
      return new Response("Rasm topilmadi", { status: upstream.status });
    }

    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Rasm yuklanmadi", { status: 502 });
  }
}
