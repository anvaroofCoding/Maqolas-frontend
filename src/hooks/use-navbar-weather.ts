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

    function startRefresh(
      latitude: number,
      longitude: number,
      isDeviceLocation: boolean,
    ) {
      void load(latitude, longitude, isDeviceLocation);
      refreshTimer = setInterval(() => {
        void load(latitude, longitude, isDeviceLocation);
      }, REFRESH_MS);
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startRefresh(
            position.coords.latitude,
            position.coords.longitude,
            true,
          );
        },
        () => {
          const fallback = getDefaultCoordinates();
          startRefresh(fallback.latitude, fallback.longitude, false);
        },
        { maximumAge: REFRESH_MS, timeout: 8000 },
      );
    } else {
      const fallback = getDefaultCoordinates();
      startRefresh(fallback.latitude, fallback.longitude, false);
    }

    return () => {
      cancelled = true;
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [enabled]);

  return weather;
}
