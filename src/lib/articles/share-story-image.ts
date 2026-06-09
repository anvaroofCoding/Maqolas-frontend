function downloadStoryImage(blob: Blob, slug: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `maqolas-${slug}-story.png`;
  link.click();
  URL.revokeObjectURL(url);
}

export type StorySharePlatform = "instagram" | "telegram";
export type StoryShareResult = "opened" | "downloaded" | "cancelled";

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function createStoryFile(blob: Blob, slug: string) {
  return new File([blob], `maqolas-${slug}-story.png`, { type: "image/png" });
}

function canShareFiles(file: File) {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

async function shareFilesWithWebApi(file: File): Promise<StoryShareResult> {
  try {
    await navigator.share({ files: [file] });
    return "opened";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "cancelled";
    }
    return "downloaded";
  }
}

async function copyImageToClipboard(blob: Blob) {
  if (
    typeof navigator === "undefined" ||
    !navigator.clipboard?.write ||
    typeof ClipboardItem === "undefined"
  ) {
    return false;
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

function hasFacebookAppId() {
  return Boolean(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim());
}

function openInstagramStoriesDeepLink() {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  if (!appId) return false;

  window.location.href = `instagram-stories://share?source_application=${encodeURIComponent(appId)}`;
  return true;
}

async function openInstagramStoriesWithAppId(blob: Blob): Promise<boolean> {
  if (!hasFacebookAppId()) return false;

  const copied = await copyImageToClipboard(blob);
  if (!copied) return false;

  return openInstagramStoriesDeepLink();
}

async function shareToInstagram(blob: Blob, slug: string): Promise<StoryShareResult> {
  const file = createStoryFile(blob, slug);

  if (canShareFiles(file)) {
    const result = await shareFilesWithWebApi(file);
    if (result !== "downloaded") return result;
  }

  if (isIOS() && (await openInstagramStoriesWithAppId(blob))) {
    return "opened";
  }

  downloadStoryImage(blob, slug);

  if (isMobileDevice() && (await openInstagramStoriesWithAppId(blob))) {
    return "opened";
  }

  return "downloaded";
}

async function shareToTelegram(blob: Blob, slug: string): Promise<StoryShareResult> {
  const file = createStoryFile(blob, slug);

  if (canShareFiles(file)) {
    const result = await shareFilesWithWebApi(file);
    if (result !== "downloaded") return result;
  }

  downloadStoryImage(blob, slug);

  if (isMobileDevice()) {
    window.location.href = "tg://";
    return "opened";
  }

  return "downloaded";
}

export async function shareStoryImageToPlatform(
  blob: Blob,
  slug: string,
  platform: StorySharePlatform,
): Promise<StoryShareResult> {
  if (platform === "instagram") {
    return shareToInstagram(blob, slug);
  }

  return shareToTelegram(blob, slug);
}

export function getStoryShareFallbackMessage(platform: StorySharePlatform) {
  if (!isMobileDevice()) {
    return platform === "instagram"
      ? "Rasm yuklab olindi. Telefoningizda Instagram → Stories → galereyadan tanlang."
      : "Rasm yuklab olindi. Telefoningizda Telegram → Stories → galereyadan tanlang.";
  }

  if (platform === "instagram") {
    return "Rasm saqlandi. Instagram → Stories → galereyadan rasmni tanlang.";
  }

  return "Rasm saqlandi. Telegram → Stories → galereyadan rasmni tanlang.";
}

export function getStoryShareSuccessMessage(platform: StorySharePlatform) {
  return platform === "instagram"
    ? "Instagram story muharriri ochildi"
    : "Telegram story muharriri ochildi";
}
