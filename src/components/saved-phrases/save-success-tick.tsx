"use client";

import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SaveSuccessTickProps = {
  onComplete: () => void;
};

export function SaveSuccessTick({ onComplete }: SaveSuccessTickProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[250] flex items-center justify-center"
      aria-live="polite"
      aria-label="Ibora saqlandi"
    >
      <div className="save-tick-pop flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_40px_rgba(16,185,129,0.45)] ring-4 ring-emerald-500/25">
        <CheckIcon className="size-8 stroke-[2.5]" aria-hidden />
      </div>
    </div>,
    document.body,
  );
}
