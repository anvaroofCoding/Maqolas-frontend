import { env } from "@/config/env";

function localFallback(text: string): string {
  const trimmed = text.trimEnd();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (/[.!?…]$/.test(trimmed)) {
    const starters = [
      "Bundan tashqari, ",
      "Shu bilan birga, ",
      "Muhim jihat shundaki, ",
      "Keyingi bosqichda ",
    ];
    return starters[wordCount % starters.length];
  }

  const continuations = [
    " bugun haqida gaplashamiz",
    " muhim ahamiyatga ega",
    " haqida batafsil yozamiz",
    " bo'yicha fikrlarimizni",
    " haqida o'ylab ko'ramiz",
  ];
  return continuations[wordCount % continuations.length];
}

export async function fetchAiSuggestion(
  text: string,
  accessToken: string | null,
): Promise<string> {
  if (!accessToken) return localFallback(text);

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/ai/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return localFallback(text);
    }

    const payload = (await response.json()) as { suggestion?: string };
    return payload.suggestion?.trim() || localFallback(text);
  } catch {
    return localFallback(text);
  }
}
