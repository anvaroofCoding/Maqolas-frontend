"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import "@/components/ui/hover-tooltip.css";

interface NavbarTooltipProps {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

export function NavbarTooltip({
  label,
  hint,
  className,
  children,
  disabled = false,
}: NavbarTooltipProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const show = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setOpen(true);
  }, [disabled, updatePosition]);

  const hide = useCallback(() => setOpen(false), []);

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

  const tooltip =
    mounted && open
      ? createPortal(
          <div
            className="navbar-tip-portal pointer-events-none fixed z-[200] -translate-x-1/2"
            style={{ top: position.top, left: position.left }}
            role="tooltip"
          >
            <div className="navbar-tip-portal__card">
              <p className="navbar-tip-portal__label">{label}</p>
              {hint ? <p className="navbar-tip-portal__hint">{hint}</p> : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={wrapRef}
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      {tooltip}
    </div>
  );
}
