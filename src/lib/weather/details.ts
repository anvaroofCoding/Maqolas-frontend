import type { WeatherCondition } from "@/lib/weather/types";

export const WEATHER_DETAILS: Record<
  WeatherCondition,
  { label: string; description: string; tip: string }
> = {
  sunny: {
    label: "Quyoshli",
    description: "Havo ochiq va yorug'",
    tip: "Yozish va o'qish uchun ajoyib kun",
  },
  cloudy: {
    label: "Bulutli",
    description: "Osmon bulutlar bilan qoplangan",
    tip: "Sokin va qulay muhit",
  },
  rainy: {
    label: "Yomg'irli",
    description: "Hozir yomg'ir yog'moqda",
    tip: "Issiq choy bilan maqola o'qing",
  },
  snowy: {
    label: "Qorli",
    description: "Qor yog'ib turibdi",
    tip: "Uyda iliq va qulay qoling",
  },
};
