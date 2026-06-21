import Link from "next/link";
import type { ArticleCategory } from "@/features/articles/types";

type MaqolalarTopicLinksProps = {
  categories: ArticleCategory[];
};

export function MaqolalarTopicLinks({ categories }: MaqolalarTopicLinksProps) {
  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Maqola mavzulari"
      className="mb-6 rounded-xl border border-border/50 bg-muted/20 p-4 md:p-5"
    >
      <h2 className="text-sm font-semibold text-foreground sm:text-base">
        Mavzu bo&apos;yicha maqolalar
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/mavzu/${category.slug}`}
              className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              {category.name} maqolalari
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
