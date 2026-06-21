export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy";

export interface WeatherSnapshot {
  condition: WeatherCondition;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  locationLabel: string;
}

/** WMO weather interpretation codes (Open-Meteo) */
export function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "sunny";
  if (code >= 71 && code <= 77) return "snowy";
  if (code === 85 || code === 86) return "snowy";
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  ) {
    return "rainy";
  }
  return "cloudy";
}
