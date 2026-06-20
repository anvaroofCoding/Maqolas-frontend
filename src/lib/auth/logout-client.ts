const MANUAL_LOGOUT_KEY = "maqolas_manual_logout";

export function markManualLogout() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MANUAL_LOGOUT_KEY, "1");
}

export function clearManualLogout() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
}

export function wasManualLogout() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "1";
}

export function disableGoogleAutoSelect() {
  if (typeof window === "undefined") return;

  try {
    window.google?.accounts?.id?.disableAutoSelect();
  } catch {
    // Google script yuklanmagan bo'lishi mumkin
  }
}
