export const WELCOME_PROMO_STORAGE_KEY = "maqolas_welcome_promo";

type StoredWelcomePromo = {
  promoId: string;
};

export function shouldShowWelcomePromo(promoId: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = window.sessionStorage.getItem(WELCOME_PROMO_STORAGE_KEY);
    if (!raw) return true;

    const stored = JSON.parse(raw) as StoredWelcomePromo;
    return stored.promoId !== promoId;
  } catch {
    return true;
  }
}

export function markWelcomePromoShown(promoId: string) {
  if (typeof window === "undefined") return;

  const payload: StoredWelcomePromo = { promoId };
  window.sessionStorage.setItem(
    WELCOME_PROMO_STORAGE_KEY,
    JSON.stringify(payload),
  );
}
