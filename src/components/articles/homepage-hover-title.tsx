"use client";

import Link from "next/link";
import { DelayedHoverTooltip } from "@/components/ui/delayed-hover-tooltip";

type HomepageHoverTitleProps = {
  title: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
  "data-tour"?: string;
};

export function HomepageHoverTitle({
  title,
  hint,
  className,
  children,
  "data-tour": dataTour,
}: HomepageHoverTitleProps) {
  return (
    <DelayedHoverTooltip
      label={title}
      hint={hint}
      delayMs={2000}
      className={className}
      data-tour={dataTour}
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
