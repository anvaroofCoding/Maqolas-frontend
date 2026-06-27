"use client";

import type { LucideIcon } from "lucide-react";
import Link, { useLinkStatus } from "next/link";
import { useFeedPrefetch } from "@/lib/navigation/use-feed-prefetch";
import { cn } from "@/lib/utils";

function SidebarNavLinkInner({
  label,
  icon: Icon,
  isActive,
}: {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}) {
  const { pending } = useLinkStatus();
  const active = isActive || pending;

  return (
    <span
      className={cn(
        "group inline-flex h-10 w-full items-center justify-start gap-3 rounded-lg px-3 text-sm font-normal transition-colors outline-none select-none",
        active
          ? "bg-nav-active text-nav-active-foreground shadow-sm hover:bg-nav-active-hover hover:text-nav-active-foreground"
          : "text-nav-item hover:bg-muted/70 hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active
            ? "text-nav-active-foreground"
            : "text-nav-item group-hover:text-foreground",
        )}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function SidebarNavLink({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}) {
  const prefetch = useFeedPrefetch();

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={() => prefetch(href)}
      onFocus={() => prefetch(href)}
      onTouchStart={() => prefetch(href)}
      className="block w-full"
    >
      <SidebarNavLinkInner label={label} icon={icon} isActive={isActive} />
    </Link>
  );
}

function NavPillInner({
  label,
  isActive,
  variant,
}: {
  label: string;
  isActive: boolean;
  variant: "pill" | "tab";
}) {
  const { pending } = useLinkStatus();
  const active = isActive || pending;

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          active
            ? "border-transparent bg-foreground text-background"
            : "border-border bg-transparent text-foreground hover:bg-muted/50",
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-nav-active text-nav-active-foreground"
          : "text-foreground hover:text-foreground/80",
      )}
    >
      {label}
    </span>
  );
}

const fastNavLinkClassName =
  "inline-flex shrink-0 items-center whitespace-nowrap";

export function FastNavPill({
  href,
  label,
  isActive,
  className,
}: {
  href: string;
  label: string;
  isActive: boolean;
  className?: string;
}) {
  const prefetch = useFeedPrefetch();

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={() => prefetch(href)}
      onFocus={() => prefetch(href)}
      onTouchStart={() => prefetch(href)}
      className={cn(fastNavLinkClassName, className)}
    >
      <NavPillInner label={label} isActive={isActive} variant="pill" />
    </Link>
  );
}

export function FastNavTab({
  href,
  label,
  isActive,
  className,
}: {
  href: string;
  label: string;
  isActive: boolean;
  className?: string;
}) {
  const prefetch = useFeedPrefetch();

  return (
    <Link
      href={href}
      prefetch
      onMouseEnter={() => prefetch(href)}
      onFocus={() => prefetch(href)}
      onTouchStart={() => prefetch(href)}
      className={cn(fastNavLinkClassName, className)}
    >
      <NavPillInner label={label} isActive={isActive} variant="tab" />
    </Link>
  );
}
