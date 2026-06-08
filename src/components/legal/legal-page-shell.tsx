import { Badge } from "@/components/ui/badge";
import { feedMainClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageShellProps = {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPageShell({
  title,
  description,
  updatedAt,
  sections,
}: LegalPageShellProps) {
  return (
    <main className={cn(feedMainClassName, "w-full min-w-0 pt-0 pb-6 sm:pb-8")}>
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-nav-active/10 via-card to-card p-6 shadow-sm sm:p-8">
        <Badge variant="secondary" className="mb-4 rounded-full">
          Rasmiy ma&apos;lumot
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Oxirgi yangilanish: {updatedAt}
        </p>
      </div>

      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardContent className="space-y-10 p-6 sm:p-8 lg:p-10">
          {sections.map((section, index) => (
            <section key={section.title}>
              {index > 0 ? <Separator className="mb-10" /> : null}
              <div className="flex gap-4">
                <div
                  className="mt-1 hidden w-1 shrink-0 rounded-full bg-nav-active sm:block"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="grid gap-2.5 sm:grid-cols-2">
                        {section.bullets.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-foreground/90 sm:text-[15px]"
                          >
                            <span
                              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nav-active"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
