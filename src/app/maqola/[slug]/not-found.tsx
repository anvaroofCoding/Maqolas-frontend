import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArticleNotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 py-16 text-center">
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
