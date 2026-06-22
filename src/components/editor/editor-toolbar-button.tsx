"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
  className?: string;
}

export function EditorToolbarButton({
  onClick,
  isActive,
  disabled,
  label,
  children,
  className,
}: EditorToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "size-8 shrink-0 text-muted-foreground hover:text-foreground",
        isActive && "bg-muted text-foreground",
        className,
      )}
    >
      {children}
    </Button>
  );
}

export function EditorToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-border" aria-hidden />;
}
