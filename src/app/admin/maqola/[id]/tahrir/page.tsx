"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/components/editor/article-editor";
import { Button } from "@/components/ui/button";
import { useGetAdminArticleQuery } from "@/features/admin/api/admin-api";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";

export default function AdminEditArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const articleId = params.id;
  const [mounted, setMounted] = useState(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  const { data: meData, isLoading: isMeLoading } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const activeUser = meData?.user ?? user;
  const isSuperAdmin = activeUser?.role === "super_admin";

  const { data, isLoading, isError } = useGetAdminArticleQuery(articleId, {
    skip: !mounted || !accessToken || !isSuperAdmin,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!accessToken) {
      router.replace("/");
      return;
    }
    if (!isMeLoading && !isSuperAdmin) {
      router.replace("/");
    }
  }, [mounted, accessToken, isMeLoading, isSuperAdmin, router]);

  if (!mounted || isMeLoading || isLoading || !isSuperAdmin) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Maqola topilmadi yoki tahrirlash huquqi yo&apos;q.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">Admin panelga qaytish</Link>
        </Button>
      </div>
    );
  }

  const { article } = data;

  return (
    <ArticleEditor
      mode="admin"
      articleId={article.id}
      initialHtml={article.contentHtml}
      initialJson={article.contentJson}
    />
  );
}
