export const HOMEPAGE_INVITE_BANNER_STORAGE_KEY =
  "maqolas_homepage_invite_banner_dismissed";

export function isHomepageInviteBannerDismissed(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(HOMEPAGE_INVITE_BANNER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissHomepageInviteBanner() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(HOMEPAGE_INVITE_BANNER_STORAGE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}
