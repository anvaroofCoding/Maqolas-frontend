import {
  Bell,
  Heart,
  Megaphone,
  Newspaper,
  PenLine,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AiIcon } from "@/components/icons/ai-icon";
import type { OnboardingStepIcon } from "@/lib/onboarding/steps";
import { cn } from "@/lib/utils";

type StepIconConfig = {
  bgClassName: string;
  iconClassName: string;
  Icon: LucideIcon | typeof AiIcon;
};

export const ONBOARDING_STEP_ICONS: Record<OnboardingStepIcon, StepIconConfig> = {
  articles: {
    bgClassName: "bg-sky-500/12",
    iconClassName: "text-sky-600 dark:text-sky-400",
    Icon: Newspaper,
  },
  like: {
    bgClassName: "bg-rose-500/12",
    iconClassName: "text-rose-600 dark:text-rose-400",
    Icon: Heart,
  },
  profile: {
    bgClassName: "bg-violet-500/12",
    iconClassName: "text-violet-600 dark:text-violet-400",
    Icon: UserRound,
  },
  ai: {
    bgClassName: "bg-primary/12",
    iconClassName: "text-primary",
    Icon: AiIcon,
  },
  random: {
    bgClassName: "bg-amber-500/12",
    iconClassName: "text-amber-600 dark:text-amber-400",
    Icon: Megaphone,
  },
  notifications: {
    bgClassName: "bg-emerald-500/12",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    Icon: Bell,
  },
  write: {
    bgClassName: "bg-nav-active/15",
    iconClassName: "text-nav-active",
    Icon: PenLine,
  },
};

export function OnboardingStepIconBadge({ icon }: { icon: OnboardingStepIcon }) {
  const config = ONBOARDING_STEP_ICONS[icon];
  const Icon = config.Icon;

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl",
        config.bgClassName,
      )}
    >
      <Icon className={cn("size-5", config.iconClassName)} aria-hidden />
    </div>
  );
}
