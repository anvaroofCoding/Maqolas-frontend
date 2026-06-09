import { cn } from "@/lib/utils";

type AiIconProps = {
  className?: string;
};

/** Professional AI icon — neural network / processor motif */
export function AiIcon({ className }: AiIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path
        d="M12 4.5V7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 17V19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4.5 12H7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17 12H19.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <rect
        x="8.25"
        y="8.25"
        width="7.5"
        height="7.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="6" cy="6" r="1.35" fill="currentColor" />
      <circle cx="18" cy="6" r="1.35" fill="currentColor" />
      <circle cx="6" cy="18" r="1.35" fill="currentColor" />
      <circle cx="18" cy="18" r="1.35" fill="currentColor" />
      <path
        d="M7.4 7.4L9.1 9.1M16.6 7.4L14.9 9.1M7.4 16.6L9.1 14.9M16.6 16.6L14.9 14.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
