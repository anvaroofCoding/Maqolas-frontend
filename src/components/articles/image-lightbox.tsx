"use client";

import { XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  image: LightboxImage | null;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);

  const resetZoom = useCallback(() => setScale(1), []);

  const close = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      onClose();
      resetZoom();
    }, 180);
  }, [onClose, resetZoom]);

  useEffect(() => {
    if (!image) return;
    setScale(1);
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [image]);

  useEffect(() => {
    if (!image) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        close();
      }
      if (event.code === "Equal" || event.code === "NumpadAdd") {
        setScale((current) => Math.min(current + SCALE_STEP, MAX_SCALE));
      }
      if (event.code === "Minus" || event.code === "NumpadSubtract") {
        setScale((current) => Math.max(current - SCALE_STEP, MIN_SCALE));
      }
      if (event.code === "Digit0" || event.code === "Numpad0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, image, resetZoom]);

  if (!image) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex flex-col transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Rasm ko'rinishi"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-label="Yopish"
        onClick={close}
      />

      <div className="pointer-events-none relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="pointer-events-auto max-w-[60%] truncate text-sm font-medium text-white/90">
          {image.alt}
        </p>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Kichiklashtirish"
            disabled={scale <= MIN_SCALE}
            onClick={() =>
              setScale((current) => Math.max(current - SCALE_STEP, MIN_SCALE))
            }
          >
            <ZoomOutIcon className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="min-w-14 rounded-full bg-white/10 px-2 text-xs text-white hover:bg-white/20 hover:text-white"
            aria-label="Masshtabni tiklash"
            onClick={resetZoom}
          >
            {Math.round(scale * 100)}%
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Kattalashtirish"
            disabled={scale >= MAX_SCALE}
            onClick={() =>
              setScale((current) => Math.min(current + SCALE_STEP, MAX_SCALE))
            }
          >
            <ZoomInIcon className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Yopish"
            onClick={close}
          >
            <XIcon className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div
        className="relative z-10 flex flex-1 items-center justify-center overflow-auto px-4 pb-6 sm:px-8"
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          setScale((current) => {
            const next = current + (event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
            return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
          });
        }}
      >
        <div
          className={cn(
            "relative w-full max-w-6xl transition-all duration-200 ease-out",
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <div
            className="mx-auto w-fit transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1920}
              height={1080}
              unoptimized
              className="mx-auto h-auto max-h-[calc(100vh-7rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 flex justify-center px-4 pb-4">
        <p className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
          Esc — yopish · + / - — masshtab
        </p>
      </div>
    </div>
  );
}
