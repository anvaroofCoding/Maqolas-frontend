import { LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { FooterPlatformStats } from "@/components/seo/footer-platform-stats";
import { primarySeoNavLinks } from "@/config/seo-navigation";
import { siteConfig } from "@/config/site";
import { feedContentInsetClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function SiteSeoFooter() {
  return (
    <footer
      className={cn(
        "mt-4 border-t border-border bg-card pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:mt-6 md:pb-0",
      )}
      data-site-chrome
    >
      <div className={cn("w-full py-6 sm:py-8", feedContentInsetClassName)}>
        <nav aria-label="Sayt bo'limlari" className="space-y-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutGridIcon className="size-4 text-primary" aria-hidden />
            {siteConfig.name} bo&apos;limlari
          </p>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {primarySeoNavLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.href} className="min-w-0">
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2.5 rounded-xl border border-transparent bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-colors hover:border-border hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="truncate group-hover:text-primary">
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <FooterPlatformStats />

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/foydalanish-shartlari"
              className="transition-colors hover:text-foreground"
            >
              Foydalanish shartlari
            </Link>
            <Link
              href="/maxfiylik-siyosati"
              className="transition-colors hover:text-foreground"
            >
              Maxfiylik siyosati
            </Link>
          </div>

          <p className="shrink-0 sm:text-right">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
