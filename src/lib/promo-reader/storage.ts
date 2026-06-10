const PROMO_AUTOSCROLL_KEY = "maqolas-promo-autoscroll";

export function markPromoAutoScroll() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROMO_AUTOSCROLL_KEY, "1");
}

export function consumePromoAutoScroll(): boolean {
  if (typeof window === "undefined") return false;
  const value = sessionStorage.getItem(PROMO_AUTOSCROLL_KEY);
  if (value !== "1") return false;
  sessionStorage.removeItem(PROMO_AUTOSCROLL_KEY);
  return true;
}
