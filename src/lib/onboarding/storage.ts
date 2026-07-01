export const ONBOARDING_STORAGE_KEY = "maqolas_onboarding_completed";

export const ONBOARDING_COMPLETED_EVENT = "maqolas:onboarding-completed";
export const ONBOARDING_RESTART_EVENT = "maqolas:onboarding-restart";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function notifyOnboardingCompleted() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ONBOARDING_COMPLETED_EVENT));
}

export function markOnboardingCompleted() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    notifyOnboardingCompleted();
  } catch {
    // ignore
  }
}

export function requestOnboardingRestart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ONBOARDING_RESTART_EVENT));
}
