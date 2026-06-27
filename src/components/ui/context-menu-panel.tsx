"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContextMenuPanel({
  menuRef,
  position,
  children,
}: {
  menuRef: React.RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  children: ReactNode;
}) {
  const menuStyle = {
    top: Math.min(position.y, window.innerHeight - 360),
    left: Math.min(position.x, window.innerWidth - 260),
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Kontekst menyu"
      className="fixed z-[200] min-w-[14rem] max-w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
      style={menuStyle}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}

export function ContextMenuItem({
  icon,
  label,
  hint,
  onClick,
  disabled,
  variant = "default",
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        variant === "destructive" &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      )}
      onClick={onClick}
    >
      <span
        aria-hidden
        className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
      {hint ? (
        <span className="shrink-0 text-[10px] text-muted-foreground">{hint}</span>
      ) : null}
    </button>
  );
}
