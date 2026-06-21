"use client";

import {
  DropletsIcon,
  MapPinIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "@/components/providers/settings-provider";
import { useNavbarWeather } from "@/hooks/use-navbar-weather";
import { WEATHER_DETAILS } from "@/lib/weather/details";
import type { WeatherCondition, WeatherSnapshot } from "@/lib/weather/types";
import { cn } from "@/lib/utils";
import "./navbar-weather.css";

function WeatherScene({ condition }: { condition: WeatherCondition }) {
  if (condition === "sunny") {
    return (
      <div className="navbar-weather__scene" aria-hidden>
        <span className="navbar-weather__sun" />
      </div>
    );
  }

  if (condition === "cloudy") {
    return (
      <div className="navbar-weather__scene" aria-hidden>
        <span className="navbar-weather__cloud navbar-weather__cloud--back" />
        <span className="navbar-weather__cloud" />
      </div>
    );
  }

  if (condition === "rainy") {
    return (
      <div className="navbar-weather__scene" aria-hidden>
        <span className="navbar-weather__cloud navbar-weather__cloud--back" />
        <span className="navbar-weather__cloud" />
        <span className="navbar-weather__drop" />
        <span className="navbar-weather__drop" />
        <span className="navbar-weather__drop" />
        <span className="navbar-weather__drop" />
      </div>
    );
  }

  return (
    <div className="navbar-weather__scene" aria-hidden>
      <span className="navbar-weather__cloud navbar-weather__cloud--back" />
      <span className="navbar-weather__cloud" />
      <span className="navbar-weather__flake" />
      <span className="navbar-weather__flake" />
      <span className="navbar-weather__flake" />
      <span className="navbar-weather__flake" />
    </div>
  );
}

function WeatherTooltip({ weather }: { weather: WeatherSnapshot }) {
  const details = WEATHER_DETAILS[weather.condition];

  return (
    <div
      className={cn(
        "navbar-weather__tooltip",
        `navbar-weather__tooltip--${weather.condition}`,
      )}
      role="tooltip"
    >
      <div className="navbar-weather__tooltip-glow" aria-hidden />

      <div className="navbar-weather__tooltip-header">
        <span className="navbar-weather__tooltip-location">
          <MapPinIcon className="size-3 shrink-0 opacity-80" />
          {weather.locationLabel}
        </span>
        <span className="navbar-weather__tooltip-badge">{details.label}</span>
      </div>

      <div className="navbar-weather__tooltip-main">
        <p className="navbar-weather__tooltip-temp">
          {weather.temperature}
          <span className="navbar-weather__tooltip-degree">°C</span>
        </p>
        <div className="navbar-weather__tooltip-scene-wrap">
          <WeatherScene condition={weather.condition} />
        </div>
      </div>

      <p className="navbar-weather__tooltip-desc">{details.description}</p>
      <p className="navbar-weather__tooltip-tip">{details.tip}</p>

      <div className="navbar-weather__tooltip-stats">
        <span className="navbar-weather__tooltip-stat">
          <ThermometerIcon className="size-3.5 shrink-0" />
          Hiss {weather.feelsLike}°
        </span>
        <span className="navbar-weather__tooltip-stat">
          <DropletsIcon className="size-3.5 shrink-0" />
          {weather.humidity}%
        </span>
        <span className="navbar-weather__tooltip-stat">
          <WindIcon className="size-3.5 shrink-0" />
          {weather.windSpeed} km/s
        </span>
      </div>
    </div>
  );
}

function LoadingTooltip() {
  return (
    <div
      className="navbar-weather__tooltip navbar-weather__tooltip--cloudy"
      role="tooltip"
    >
      <div className="navbar-weather__tooltip-glow" aria-hidden />
      <p className="navbar-weather__tooltip-loading-title">Ob-havo yuklanmoqda</p>
      <p className="navbar-weather__tooltip-loading-text">
        Joylashuvingiz bo&apos;yicha ma&apos;lumot olinmoqda...
      </p>
    </div>
  );
}

interface TooltipPosition {
  top: number;
  right: number;
}

export function NavbarWeather({ className }: { className?: string }) {
  const { settings } = useSettings();
  const weather = useNavbarWeather(settings.navbarWeatherEnabled);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, right: 0 });

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    function handleReposition() {
      updatePosition();
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updatePosition]);

  if (!settings.navbarWeatherEnabled) return null;

  const ariaLabel = weather
    ? `${WEATHER_DETAILS[weather.condition].label}, ${weather.temperature} gradus, ${weather.locationLabel}`
    : "Ob-havo yuklanmoqda";

  const tooltip =
    mounted && open
      ? createPortal(
          <div
            className="navbar-weather__tooltip-portal"
            style={{
              top: position.top,
              right: position.right,
            }}
          >
            {weather ? <WeatherTooltip weather={weather} /> : <LoadingTooltip />}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={cn("relative", className)}>
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            "navbar-weather flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground",
            "outline-none transition-colors hover:bg-muted/70 hover:text-foreground",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
          aria-label={ariaLabel}
          onMouseEnter={() => {
            updatePosition();
            setOpen(true);
          }}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => {
            updatePosition();
            setOpen(true);
          }}
          onBlur={() => setOpen(false)}
        >
          {weather ? (
            <WeatherScene condition={weather.condition} />
          ) : (
            <div className="navbar-weather__scene opacity-60" aria-hidden>
              <span className="navbar-weather__cloud navbar-weather__cloud--back" />
              <span className="navbar-weather__cloud" />
            </div>
          )}
        </button>
      </div>
      {tooltip}
    </>
  );
}
