import { FileTextIcon, LayoutGridIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { FooterPlatformStats } from "@/components/seo/footer-platform-stats";
import { primarySeoNavLinks } from "@/config/seo-navigation";
import { siteConfig } from "@/config/site";
import { feedContentInsetClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function SiteSeoFooter() {
  return (
    <footer className="mt-10 border-t border-border/60 bg-muted/15">
      <div
        className={cn(
          "w-full py-10 sm:py-12",
          feedContentInsetClassName,
        )}
      >
        <nav aria-label="Sayt bo'limlari" className="space-y-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutGridIcon className="size-4 text-primary" aria-hidden />
            {siteConfig.name} bo&apos;limlari
          </p>

          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-1">
            {primarySeoNavLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.href} className="min-w-0">
                  <Link
                    href={link.href}
                    className="group flex w-full items-start gap-3 rounded-xl px-2 py-2.5 outline-none ring-offset-background transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-3"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <FooterPlatformStats />

        <div className="mt-8 flex flex-col gap-4 border-t border-border/50 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link
              href="/foydalanish-shartlari"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <FileTextIcon className="size-3.5 shrink-0" aria-hidden />
              Foydalanish shartlari
            </Link>
            <Link
              href="/maxfiylik-siyosati"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ShieldIcon className="size-3.5 shrink-0" aria-hidden />
              Maxfiylik siyosati
            </Link>
          </div>

          <p className="shrink-0 text-xs text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} {siteConfig.name}. O&apos;zbekcha maqolalar
            platformasi.
          </p>
        </div>
      </div>
    </footer>
  );
}
