import Link from "next/link";
import { cn } from "@/lib/utils";

export function TopicPill({
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
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "border-transparent bg-foreground text-background"
          : "border-border bg-transparent text-foreground hover:bg-muted/50",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function FeedTab({
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
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-nav-active text-nav-active-foreground"
          : "text-foreground hover:text-foreground/80",
        className,
      )}
    >
      {label}
    </Link>
  );
}
