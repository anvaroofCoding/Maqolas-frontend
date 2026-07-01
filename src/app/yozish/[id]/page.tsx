"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleEditor } from "@/components/editor/article-editor";
import { useGetArticleQuery } from "@/features/articles/api/articles-api";
import { useAppSelector } from "@/lib/store/hooks";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const articleId = params.id;
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { data, isLoading, isError } = useGetArticleQuery(articleId, {
    skip: !mounted || !accessToken,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !accessToken) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, accessToken, router]);

  if (!mounted || !accessToken || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Maqola yuklanmoqda...</p>
      </div>
    );
  }

  if (isError || !data?.article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Maqola topilmadi yoki tahrirlash huquqi yo&apos;q.
        </p>
      </div>
    );
  }

  const { article } = data;

  if (article.status === "review") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          Bu maqola hozir admin tomonidan ko&apos;rib chiqilmoqda. Tahrirlash
          vaqtincha mavjud emas.
        </p>
      </div>
    );
  }

  return (
    <ArticleEditor
      articleId={article.id}
      initialHtml={article.contentHtml}
      initialJson={article.contentJson}
      initialHashtags={article.hashtags}
      reviewNote={article.reviewNote}
    />
  );
}
