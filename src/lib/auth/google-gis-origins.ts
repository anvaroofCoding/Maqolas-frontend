import { siteConfig } from "@/config/site";
import { env } from "@/config/env";

function parseOrigin(value: string): string | null {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

/** Google Console dagi Authorized JavaScript origins bilan mos kelishi kerak */
export function resolveGoogleGisOrigins(): string[] {
  const origins = new Set<string>();

  const appOrigin = parseOrigin(env.NEXT_PUBLIC_APP_URL);
  if (appOrigin) origins.add(appOrigin);

  const host = siteConfig.host;
  if (host) {
    origins.add(`https://${host}`);
    origins.add(`https://www.${host}`);
  }

  const configured = process.env.NEXT_PUBLIC_GOOGLE_GIS_ORIGINS;
  if (configured) {
    for (const part of configured.split(",")) {
      const origin = parseOrigin(part);
      if (origin) origins.add(origin);
    }
  }

  return [...origins];
}

export function isGoogleGisOriginAllowed(): boolean {
  if (typeof window === "undefined") return false;

  const current = window.location.origin;
  const allowed = resolveGoogleGisOrigins();

  if (allowed.length === 0) return true;
  if (allowed.includes(current)) return true;

  // Joriy domen site host bilan mos kelsa — GIS urinib ko'riladi
  try {
    const host = new URL(current).hostname;
    if (host === siteConfig.host || host.endsWith(`.${siteConfig.host}`)) {
      return true;
    }
  } catch {
    /* skip */
  }

  return false;
}

export function logGoogleGisSetupHint(reason: "origin_mismatch" | "before_prompt") {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;

  const current = window.location.origin;
  const allowed = resolveGoogleGisOrigins();
  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (reason === "origin_mismatch") {
    console.warn(
      `[Maqolas] Google One Tap o'tkazib yuborildi.\n` +
        `  Joriy manzil: ${current}\n` +
        `  .env dagi ruxsat: ${allowed.join(", ") || "(bo'sh)"}\n` +
        `  Google Console → Authorized JavaScript origins ga qo'shing: ${current}`,
    );
    return;
  }

  const key = "maqolas_gis_console_hint";
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  console.info(
    `[Maqolas] Google One Tap (o'ng yuqori modal) uchun Console sozlang:\n` +
      `  1. https://console.cloud.google.com/apis/credentials\n` +
      `  2. Client ID: ${clientId || "(yo'q)"}\n` +
      `  3. Authorized JavaScript origins → ${current}`,
  );
}

const GIS_SCRIPT_ID = "google-gsi-client";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function loadGoogleGsiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window unavailable"));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GIS_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google script failed")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(script);
  });
}

function waitForPageReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      window.setTimeout(resolve, 350);
      return;
    }

    const onReady = () => {
      window.setTimeout(resolve, 350);
    };

    window.addEventListener("load", onReady, { once: true });
  });
}

export type GoogleOneTapDismissReason =
  | "unregistered_origin"
  | "not_displayed"
  | "skipped"
  | "dismissed"
  | "script_error"
  | "unknown";

export async function showGoogleOneTap(options: {
  clientId: string;
  onCredential: (idToken: string) => Promise<void>;
  onDismiss: (reason: GoogleOneTapDismissReason) => void;
}): Promise<void> {
  try {
    await loadGoogleGsiScript();
    await waitForPageReady();
  } catch {
    options.onDismiss("script_error");
    return;
  }

  const googleId = window.google?.accounts?.id;
  if (!googleId) {
    options.onDismiss("script_error");
    return;
  }

  googleId.initialize({
    client_id: options.clientId,
    auto_select: false,
    cancel_on_tap_outside: true,
    itp_support: true,
    context: "signin",
    callback: (response) => {
      void options.onCredential(response.credential);
    },
  });

  googleId.prompt((notification) => {
    if (notification.isNotDisplayed()) {
      const reason = notification.getNotDisplayedReason?.() ?? "unknown";

      if (process.env.NODE_ENV === "development") {
        console.warn(`[Maqolas] Google One Tap ko'rinmadi: ${reason}`);
      }

      if (reason === "unregistered_origin") {
        options.onDismiss("unregistered_origin");
        return;
      }

      options.onDismiss("not_displayed");
      return;
    }

    if (notification.isSkippedMoment()) {
      options.onDismiss("skipped");
      return;
    }

    if (notification.isDismissedMoment()) {
      options.onDismiss("dismissed");
    }
  });
}
