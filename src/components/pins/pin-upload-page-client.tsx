"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PinUploadForm } from "@/components/pins/pin-upload-form";
import { useAppSelector } from "@/lib/store/hooks";

export function PinUploadPageClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !accessToken) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, accessToken, router]);

  if (!mounted || !accessToken) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center pb-10 pt-4">
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      </main>
    );
  }

  return (
    <main className="pb-10 pt-4 md:pt-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Rasm yuklash
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Chiroyli va sifatli rasmlarni joylang. Sarlavha va tavsif qidiruv
          tizimlarida yaxshiroq ko&apos;rinishi uchun muhim.
        </p>

        <div className="mt-8">
          <PinUploadForm />
        </div>
      </div>
    </main>
  );
}
