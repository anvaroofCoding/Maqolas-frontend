import { env } from "@/config/env";

export function getRealtimeSocketOrigin() {
  const url = new URL(env.NEXT_PUBLIC_API_URL);
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.origin;
}
