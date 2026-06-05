"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/components/editor/article-editor";
import { useAppSelector } from "@/lib/store/hooks";

export default function WritePage() {
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      </div>
    );
  }

  return <ArticleEditor />;
}
