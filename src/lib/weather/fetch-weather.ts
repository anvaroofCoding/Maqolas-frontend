import {
  weatherCodeToCondition,
  type WeatherSnapshot,
} from "@/lib/weather/types";

const DEFAULT_LAT = 41.2995;
const DEFAULT_LON = 69.2401;
const DEFAULT_LOCATION = "Toshkent";

interface OpenMeteoCurrent {
  weather_code: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
}

interface GeocodingResponse {
  results?: Array<{
    name: string;
    admin1?: string;
  }>;
}

export async function fetchLocationLabel(
  latitude: number,
  longitude: number,
  isDeviceLocation: boolean,
): Promise<string> {
  if (!isDeviceLocation) return DEFAULT_LOCATION;

  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      language: "uz",
      count: "1",
    });

    const response = await fetch(
      `/api/weather/reverse-geocode?${params.toString()}`,
    );

    if (!response.ok) return "Joylashuvingiz";

    const data = (await response.json()) as GeocodingResponse;
    const place = data.results?.[0];
    if (!place) return "Joylashuvingiz";

    return place.admin1 ? `${place.name}, ${place.admin1}` : place.name;
  } catch {
    return "Joylashuvingiz";
  }
}

export async function fetchWeather(
  latitude = DEFAULT_LAT,
  longitude = DEFAULT_LON,
  isDeviceLocation = false,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m",
    timezone: "auto",
  });

  const [response, locationLabel] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`),
    fetchLocationLabel(latitude, longitude, isDeviceLocation),
  ]);

  if (!response.ok) {
    throw new Error("Ob-havo ma'lumotini yuklab bo'lmadi");
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current;

  if (!current) {
    throw new Error("Ob-havo ma'lumoti topilmadi");
  }

  return {
    condition: weatherCodeToCondition(current.weather_code),
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    locationLabel,
  };
}

export function getDefaultCoordinates() {
  return { latitude: DEFAULT_LAT, longitude: DEFAULT_LON };
}
