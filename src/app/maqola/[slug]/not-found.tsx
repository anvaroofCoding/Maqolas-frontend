import Link from "next/link";
import { Button } from "@/components/ui/button";
import { articleSurfaceClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function ArticleNotFound() {
  return (
    <main
      className={cn(
        articleSurfaceClassName,
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center",
      )}
    >
      <h1 className="text-2xl font-bold tracking-tight">Maqola topilmadi</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Ushbu maqola o&apos;chirilgan yoki hali nashr etilmagan bo&apos;lishi
        mumkin.
      </p>
      <Button asChild>
        <Link href="/">Bosh sahifaga qaytish</Link>
      </Button>
    </main>
  );
}
