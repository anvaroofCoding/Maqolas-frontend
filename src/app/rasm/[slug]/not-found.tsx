import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PinNotFound() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Rasm topilmadi</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Bu rasm o&apos;chirilgan yoki mavjud emas.
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/rasmlar">Rasmlarga qaytish</Link>
      </Button>
    </main>
  );
}
