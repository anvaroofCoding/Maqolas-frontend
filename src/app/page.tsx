import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Bosh sahifa",
  path: "/",
});

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Maqolas Frontend
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-muted-foreground">{siteConfig.description}</p>
      </div>

      <ul className="grid w-full gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <li>Next.js 16 — App Router</li>
        <li>TypeScript + Tailwind CSS v4</li>
        <li>Redux Toolkit + RTK Query</li>
        <li>shadcn/ui (New York)</li>
        <li>SEO: metadata, sitemap, robots, JSON-LD</li>
      </ul>

      <Button size="lg">Boshlash</Button>
    </main>
  );
}
