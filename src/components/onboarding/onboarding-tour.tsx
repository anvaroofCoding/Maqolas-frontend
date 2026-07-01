"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { OnboardingStepIconBadge } from "@/components/onboarding/onboarding-step-icon";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS } from "@/lib/onboarding/steps";
import {
  findTourTarget,
  getTourTargetRect,
  scrollTourTargetIntoView,
  type SpotlightRect,
} from "@/lib/onboarding/target";
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
  ONBOARDING_RESTART_EVENT,
} from "@/lib/onboarding/storage";
import { cn } from "@/lib/utils";

const TOOLTIP_GAP = 14;
const TOOLTIP_WIDTH = 320;

type TooltipPosition = {
  top: number;
  left: number;
  placement: "top" | "bottom";
};

function computeTooltipPosition(
  rect: SpotlightRect,
  preferred: "top" | "bottom" | "left" | "right" | "auto",
): TooltipPosition {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const tooltipHeight = 220;

  let placement: "top" | "bottom" =
    preferred === "top" ? "top" : preferred === "bottom" ? "bottom" : "bottom";

  const spaceBelow = viewportH - (rect.top + rect.height);
  const spaceAbove = rect.top;

  if (placement === "bottom" && spaceBelow < tooltipHeight && spaceAbove > spaceBelow) {
    placement = "top";
  } else if (placement === "top" && spaceAbove < tooltipHeight && spaceBelow > spaceAbove) {
    placement = "bottom";
  }

  const centerX = rect.left + rect.width / 2;
  const left = Math.min(
    Math.max(16, centerX - TOOLTIP_WIDTH / 2),
    viewportW - TOOLTIP_WIDTH - 16,
  );

  const top =
    placement === "bottom"
      ? rect.top + rect.height + TOOLTIP_GAP
      : rect.top - tooltipHeight - TOOLTIP_GAP;

  return { top, left, placement };
}

export function OnboardingTour() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null);
  const [animating, setAnimating] = useState(false);
  const [buttonPulse, setButtonPulse] = useState(false);
  const retryTimerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const pendingRestartRef = useRef(false);

  const step = ONBOARDING_STEPS[stepIndex];
  const isLastStep = stepIndex >= ONBOARDING_STEPS.length - 1;
  const isHomepage = pathname === "/";
  const isBlockedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/yozish");

  const updatePositions = useCallback(() => {
    if (!step) return;

    const target = findTourTarget(step.target);
    if (!target) {
      setSpotlight(null);
      setTooltip(null);
      return;
    }

    const rect = getTourTargetRect(target);
    setSpotlight(rect);
    setTooltip(computeTooltipPosition(rect, step.placement ?? "auto"));
  }, [step]);

  const startTour = useCallback(() => {
    setSpotlight(null);
    setTooltip(null);
    setAnimating(false);
    startedRef.current = true;
    setStepIndex(0);
    setActive(true);
  }, []);

  const finishTour = useCallback(() => {
    markOnboardingCompleted();
    setActive(false);
    setSpotlight(null);
    setTooltip(null);
  }, []);

  const goNext = useCallback(() => {
    setButtonPulse(true);
    window.setTimeout(() => setButtonPulse(false), 280);

    setAnimating(true);
    window.setTimeout(() => {
      if (isLastStep) {
        finishTour();
      } else {
        setStepIndex((current) => current + 1);
      }
      setAnimating(false);
    }, 220);
  }, [finishTour, isLastStep]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || hasCompletedOnboarding() || isBlockedRoute || !isHomepage) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (hasCompletedOnboarding() || startedRef.current) return;
      startTour();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [mounted, isBlockedRoute, isHomepage, startTour]);

  useEffect(() => {
    const onRestart = () => {
      pendingRestartRef.current = true;

      if (pathname !== "/" || isBlockedRoute) {
        router.push("/");
        return;
      }

      window.setTimeout(startTour, 300);
    };

    window.addEventListener(ONBOARDING_RESTART_EVENT, onRestart);
    return () => {
      window.removeEventListener(ONBOARDING_RESTART_EVENT, onRestart);
    };
  }, [pathname, isBlockedRoute, router, startTour]);

  useEffect(() => {
    if (!pendingRestartRef.current || pathname !== "/" || isBlockedRoute) {
      return;
    }

    pendingRestartRef.current = false;
    const timer = window.setTimeout(startTour, 400);
    return () => window.clearTimeout(timer);
  }, [pathname, isBlockedRoute, startTour]);

  useLayoutEffect(() => {
    if (!active || !step) return;

    const target = findTourTarget(step.target);

    if (!target) {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
      retryTimerRef.current = window.setTimeout(() => {
        const retryTarget = findTourTarget(step.target);
        if (!retryTarget) {
          if (stepIndex < ONBOARDING_STEPS.length - 1) {
            setStepIndex((current) => current + 1);
          } else {
            finishTour();
          }
          return;
        }
        scrollTourTargetIntoView(retryTarget);
        updatePositions();
      }, 350);
      return;
    }

    scrollTourTargetIntoView(target);
    updatePositions();

    const onLayoutChange = () => updatePositions();
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("scroll", onLayoutChange, true);

    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
    };
  }, [active, step, stepIndex, updatePositions, finishTour]);

  if (!mounted || !active || !step) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[300]"
      role="dialog"
      aria-modal="true"
      aria-label="Dastur bilan tanishish"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[1px] transition-opacity duration-300"
        aria-hidden
      />

      {spotlight ? (
        <div
          className={cn(
            "pointer-events-none absolute rounded-2xl ring-4 ring-primary/80 ring-offset-2 ring-offset-transparent transition-all duration-300 ease-out",
            animating && "scale-[0.98] opacity-80",
          )}
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
        />
      ) : null}

      {tooltip ? (
        <div
          className={cn(
            "absolute w-[min(20rem,calc(100vw-2rem))] rounded-2xl border bg-card p-4 shadow-2xl transition-all duration-300 ease-out",
            animating
              ? "translate-y-1 scale-[0.98] opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
          style={{
            top: tooltip.top,
            left: tooltip.left,
          }}
        >
          <div className="mb-3 flex items-start gap-3">
            <OnboardingStepIconBadge icon={step.icon} />
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {stepIndex + 1} / {ONBOARDING_STEPS.length}
              </p>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={finishTour}
            >
              O&apos;tkazib yuborish
            </button>

            <Button
              type="button"
              size="sm"
              className={cn(
                "min-w-[5.5rem] rounded-full font-semibold transition-transform",
                buttonPulse && "scale-95",
              )}
              onClick={goNext}
            >
              {isLastStep ? "Tushundim!" : "Ha"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
