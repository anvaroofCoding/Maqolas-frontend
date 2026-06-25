import Link from "next/link";
import { primarySeoNavLinks } from "@/config/seo-navigation";
import { siteConfig } from "@/config/site";

export function SiteSeoFooter() {
  return (
    <footer className="mt-10 border-t border-border/60 bg-muted/15">
      <div className="mx-auto w-full max-w-full px-4 py-8 md:px-6 xl:px-8">
        <nav aria-label="Sayt bo'limlari">
          <p className="text-sm font-semibold text-foreground">
            {siteConfig.name} bo&apos;limlari
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {primarySeoNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group block rounded-lg outline-none ring-offset-background focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    {link.label}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Link href="/foydalanish-shartlari" className="hover:text-foreground">
            Foydalanish shartlari
          </Link>
          <Link href="/maxfiylik-siyosati" className="hover:text-foreground">
            Maxfiylik siyosati
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. O&apos;zbekcha maqolalar
          platformasi.
        </p>
      </div>
    </footer>
  );
}
