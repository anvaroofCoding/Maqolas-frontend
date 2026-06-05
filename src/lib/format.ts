const UNITS: { limit: number; divisor: number; singular: string; plural: string }[] = [
  { limit: 60, divisor: 1, singular: "soniya", plural: "soniya" },
  { limit: 3600, divisor: 60, singular: "daqiqa", plural: "daqiqa" },
  { limit: 86400, divisor: 3600, singular: "soat", plural: "soat" },
  { limit: 604800, divisor: 86400, singular: "kun", plural: "kun" },
  { limit: 2592000, divisor: 604800, singular: "hafta", plural: "hafta" },
  { limit: 31536000, divisor: 2592000, singular: "oy", plural: "oy" },
  { limit: Infinity, divisor: 31536000, singular: "yil", plural: "yil" },
];

export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "";

  const secondsAgo = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));

  if (secondsAgo < 45) {
    return "Hozirgina";
  }

  for (const unit of UNITS) {
    if (secondsAgo < unit.limit) {
      const value = Math.max(1, Math.round(secondsAgo / unit.divisor));
      return `${value} ${unit.plural} oldin`;
    }
  }

  return "Hozirgina";
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}
