const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/reverse";

function parseCoordinate(value: string | null, min: number, max: number) {
  if (!value) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const latitude = parseCoordinate(url.searchParams.get("latitude"), -90, 90);
  const longitude = parseCoordinate(
    url.searchParams.get("longitude"),
    -180,
    180,
  );

  if (latitude === null || longitude === null) {
    return Response.json(
      { message: "Noto'g'ri koordinatalar" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    language: url.searchParams.get("language") ?? "uz",
    count: url.searchParams.get("count") ?? "1",
  });

  try {
    const upstream = await fetch(`${GEOCODING_API}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return Response.json({ results: [] }, { status: upstream.status });
    }

    const data = await upstream.json();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json({ results: [] }, { status: 502 });
  }
}
