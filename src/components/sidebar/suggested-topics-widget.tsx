"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListTrendingArticleRequestsQuery,
  useToggleArticleRequestLikeMutation,
} from "@/features/article-requests/api/article-requests-api";
import { TopicSupportButton } from "@/components/topics/topic-support-button";
import { useAppSelector } from "@/lib/store/hooks";

function truncateTitle(title: string, maxLength = 42) {
  const normalized = title.trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

export function SuggestedTopicsWidget() {
  const [loginOpen, setLoginOpen] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  const { data, isLoading } = useListTrendingArticleRequestsQuery({ limit: 5 });
  const [toggleLike] = useToggleArticleRequestLikeMutation();
  const requests = data?.requests ?? [];

  const handleLike = (id: string) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    void toggleLike({ id });
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="px-4 pb-2 pt-4">
          <CardTitle className="text-base font-semibold tracking-tight">
            Ko&apos;p so&apos;ralgan mavzular
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-2 pb-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 px-2 py-2">
                <Skeleton className="h-4 w-8 rounded-md" />
                <Skeleton className="h-4 flex-1 rounded-md" />
              </div>
            ))
          ) : requests.length === 0 ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              Hozircha takliflar yo&apos;q.
            </p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-start gap-1 rounded-xl px-2 py-2 transition-colors hover:bg-muted/40"
              >
                <TopicSupportButton
                  size="compact"
                  likeCount={request.likeCount}
                  likedByMe={request.likedByMe}
                  onClick={() => handleLike(request.id)}
                />

                <div className="min-w-0 flex-1">
                  <Link
                    href="/mavzular"
                    className="block text-sm leading-snug text-foreground hover:text-nav-active"
                    title={request.title}
                  >
                    {truncateTitle(request.title)}
                  </Link>
                </div>
              </div>
            ))
          )}

          <Link
            href="/mavzular"
            className="mt-2 inline-flex px-2 text-sm font-medium text-nav-active hover:underline"
          >
            Mavzu taklif qilish →
          </Link>
        </CardContent>
      </Card>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
