import { env } from "@/config/env";

/** API origin without /api suffix — static uploads uchun */
export function getApiOrigin() {
  return env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
}
