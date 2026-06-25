"use client";

import { useEffect, useState } from "react";
import {
  fetchWeather,
  getDefaultCoordinates,
} from "@/lib/weather/fetch-weather";
import type { WeatherSnapshot } from "@/lib/weather/types";

const REFRESH_MS = 30 * 60 * 1000;

export function useNavbarWeather(enabled: boolean) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let refreshTimer: ReturnType<typeof setInterval> | undefined;

    async function load(
      latitude: number,
      longitude: number,
      isDeviceLocation: boolean,
    ) {
      try {
        const snapshot = await fetchWeather(
          latitude,
          longitude,
          isDeviceLocation,
        );
        if (!cancelled) setWeather(snapshot);
      } catch {
        if (!cancelled) {
          const fallback = getDefaultCoordinates();
          try {
            const snapshot = await fetchWeather(
              fallback.latitude,
              fallback.longitude,
              false,
            );
            if (!cancelled) setWeather(snapshot);
          } catch {
            if (!cancelled) setWeather(null);
          }
        }
      }
    }

    function startRefresh(latitude: number, longitude: number) {
      void load(latitude, longitude, false);
      refreshTimer = setInterval(() => {
        void load(latitude, longitude, false);
      }, REFRESH_MS);
    }

    const fallback = getDefaultCoordinates();
    startRefresh(fallback.latitude, fallback.longitude);

    return () => {
      cancelled = true;
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [enabled]);

  return weather;
}
