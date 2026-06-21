"use client";

import Link from "next/link";
import { DelayedHoverTooltip } from "@/components/ui/delayed-hover-tooltip";

type HomepageHoverTitleProps = {
  title: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function HomepageHoverTitle({
  title,
  hint,
  className,
  children,
}: HomepageHoverTitleProps) {
  return (
    <DelayedHoverTooltip
      label={title}
      hint={hint}
      delayMs={2000}
      className={className}
    >
      {children}
    </DelayedHoverTooltip>
  );
}

type HomepageArticleLinkProps = React.ComponentProps<typeof Link> & {
  title: string;
  hint?: string;
};

export function HomepageArticleLink({
  title,
  hint,
  className,
  children,
  ...props
}: HomepageArticleLinkProps) {
  return (
    <HomepageHoverTitle title={title} hint={hint}>
      <Link {...props} className={className}>
        {children}
      </Link>
    </HomepageHoverTitle>
  );
}
