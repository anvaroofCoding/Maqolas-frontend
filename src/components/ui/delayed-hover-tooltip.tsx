"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import "./hover-tooltip.css";

type TooltipPlacement = "cursor" | "below";

interface DelayedHoverTooltipProps {
  label: string;
  hint?: string;
  delayMs?: number;
  placement?: TooltipPlacement;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  "data-tour"?: string;
}

export function DelayedHoverTooltip({
  label,
  hint,
  delayMs = 2000,
  placement = "cursor",
  className,
  children,
  disabled = false,
  "data-tour": dataTour,
}: DelayedHoverTooltipProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const updatePositionFromCursor = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      setPosition({ x: event.clientX, y: event.clientY });
    },
    [],
  );

  const updatePositionFromElement = useCallback(() => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setOpen(false);
  }, []);

  const scheduleShow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (placement === "below") {
        updatePositionFromElement();
      }
      setOpen(true);
    }, delayMs);
  }, [delayMs, placement, updatePositionFromElement]);

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (placement === "cursor") {
        updatePositionFromCursor(event);
      } else {
        updatePositionFromElement();
      }
      scheduleShow();
    },
    [
      disabled,
      placement,
      scheduleShow,
      updatePositionFromCursor,
      updatePositionFromElement,
    ],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (placement === "cursor") {
        updatePositionFromCursor(event);
      }
    },
    [disabled, placement, updatePositionFromCursor],
  );

  useEffect(() => {
    if (!open || placement !== "below") return;

    function handleReposition() {
      updatePositionFromElement();
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, placement, updatePositionFromElement]);

  const tooltip =
    mounted && open
      ? createPortal(
          <div
            className={cn(
              "pointer-events-none fixed z-[200]",
              placement === "below"
                ? "navbar-tip-portal -translate-x-1/2"
                : "delayed-hover-tip",
            )}
            style={
              placement === "below"
                ? { top: position.y, left: position.x }
                : {
                    left: position.x,
                    top: position.y,
                    transform: "translate(-50%, calc(-100% - 12px))",
                  }
            }
            role="tooltip"
          >
            <div
              className={
                placement === "below"
                  ? "navbar-tip-portal__card"
                  : "delayed-hover-tip__card"
              }
            >
              <p
                className={
                  placement === "below"
                    ? "navbar-tip-portal__label"
                    : "delayed-hover-tip__label"
                }
              >
                {label}
              </p>
              {hint ? (
                <p
                  className={
                    placement === "below"
                      ? "navbar-tip-portal__hint"
                      : "delayed-hover-tip__hint"
                  }
                >
                  {hint}
                </p>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={wrapRef}
      className={cn(className)}
      data-tour={dataTour}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={hide}
      onFocusCapture={(event) => {
        if (disabled) return;
        if (placement === "below") {
          updatePositionFromElement();
        } else {
          const rect = event.currentTarget.getBoundingClientRect();
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
        }
        scheduleShow();
      }}
      onBlurCapture={hide}
    >
      {children}
      {tooltip}
    </div>
  );
}
