import { env } from "@/config/env";

export async function fetchAiProofread(
  text: string,
  accessToken: string | null,
): Promise<string> {
  if (!accessToken) return text;

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/ai/proofread`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return text;
    }

    const payload = (await response.json()) as { text?: string };
    return payload.text?.trim() || text;
  } catch {
    return text;
  }
}
