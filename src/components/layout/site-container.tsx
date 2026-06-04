import { containerClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

type SiteContainerProps = React.ComponentProps<"div">;

export function SiteContainer({ className, ...props }: SiteContainerProps) {
  return (
    <div className={cn(containerClassName, className)} {...props} />
  );
}
