"use client";

import { ChevronUp, Loader2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateArticleRequestMutation,
  useListAllArticleRequestsQuery,
  useToggleArticleRequestLikeMutation,
} from "@/features/article-requests/api/article-requests-api";
import type { ArticleRequest } from "@/features/article-requests/types";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { useAppSelector } from "@/lib/store/hooks";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

const DESCRIPTION_PREVIEW_LENGTH = 180;

function TopicSuggestionsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="rounded-xl border p-4 sm:p-5">
          <div className="flex gap-4">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-6 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function TopicSuggestionCard({
  request,
  onRequireLogin,
}: {
  request: ArticleRequest;
  onRequireLogin: () => void;
}) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [expanded, setExpanded] = useState(false);
  const [likedByMe, setLikedByMe] = useState(request.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(request.likeCount);
  const [toggleLike, { isLoading }] = useToggleArticleRequestLikeMutation();

  const requesterName =
    request.requester?.displayName ?? request.requester?.username ?? "Foydalanuvchi";
  const isLong = request.description.length > DESCRIPTION_PREVIEW_LENGTH;
  const description = expanded || !isLong
    ? request.description
    : `${request.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;

  const handleVote = async () => {
    if (!accessToken) {
      onRequireLogin();
      return;
    }

    try {
      const result = await toggleLike({
        id: request.id,
      }).unwrap();
      setLikedByMe(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      // keep state on failure
    }
  };

  return (
    <Card className="min-w-0 max-w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="flex gap-4 p-4 sm:p-5">
        <button
          type="button"
          className={cn(
            "inline-flex size-12 shrink-0 flex-col items-center justify-center rounded-full border transition-colors",
            likedByMe || likeCount > 0
              ? "border-nav-active/40 text-nav-active"
              : "border-border text-muted-foreground hover:border-nav-active/30 hover:text-nav-active",
          )}
          aria-label="Ovoz berish"
          disabled={isLoading}
          onClick={() => void handleVote()}
        >
          <ChevronUp className="size-4" aria-hidden />
          <span className="text-sm font-semibold tabular-nums">
            {formatCount(likeCount)}
          </span>
        </button>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
              {request.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
              {isLong && !expanded ? (
                <>
                  {" "}
                  <button
                    type="button"
                    className="font-medium text-nav-active hover:underline"
                    onClick={() => setExpanded(true)}
                  >
                    Batafsil
                  </button>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="size-7 shrink-0">
              {request.requester?.avatarUrl ? (
                <AvatarImage src={request.requester.avatarUrl} alt={requesterName} />
              ) : null}
              <AvatarFallback className="bg-muted text-xs font-medium">
                {getUserInitials(requesterName)}
              </AvatarFallback>
            </Avatar>
            {request.requester?.username ? (
              <Link
                href={`/profil/${request.requester.username}`}
                className="font-medium text-foreground/80 hover:text-nav-active hover:underline"
              >
                {request.requester.username}
              </Link>
            ) : (
              <span className="font-medium text-foreground/80">{requesterName}</span>
            )}
            {request.createdAt ? (
              <span className="text-xs">{formatRelativeTime(request.createdAt)}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TopicSuggestionsPage() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data, isLoading, isFetching } = useListAllArticleRequestsQuery({ limit: 50 });
  const [createRequest, { isLoading: isCreating }] = useCreateArticleRequestMutation();
  const [createOpen, setCreateOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const requests = data?.requests ?? [];

  const handleOpenCreate = () => {
    if (!accessToken) {
      setLoginOpen(true);
      return;
    }
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    try {
      await createRequest({
        title: trimmedTitle,
        description: trimmedDescription,
      }).unwrap();
      setTitle("");
      setDescription("");
      setCreateOpen(false);
    } catch {
      // keep dialog open on failure
    }
  };

  return (
    <>
      <div className="space-y-6 py-4 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Qaysi mavzuda yozaylik?
            </h1>
            <p className="text-sm text-muted-foreground">
              Qiziq mavzularni taklif qiling yoki mavjudlariga ovoz bering
            </p>
          </div>
          <Button
            type="button"
            className="rounded-full bg-nav-active px-4 text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
            onClick={handleOpenCreate}
          >
            <PlusIcon className="size-4" aria-hidden />
            Mavzu taklif qilish
          </Button>
        </div>

        {isLoading ? (
          <TopicSuggestionsSkeleton />
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Hozircha taklif qilingan mavzular yo&apos;q. Birinchi bo&apos;lib taklif
              qiling.
            </p>
            <Button
              type="button"
              className="mt-4 rounded-full bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
              onClick={handleOpenCreate}
            >
              <PlusIcon className="size-4" aria-hidden />
              Mavzu taklif qilish
            </Button>
          </div>
        ) : (
          <>
            {isFetching && !isLoading ? (
              <p className="text-xs text-muted-foreground">Yangilanmoqda...</p>
            ) : null}
            <div className="space-y-4">
              {requests.map((request) => (
                <TopicSuggestionCard
                  key={request.id}
                  request={request}
                  onRequireLogin={() => setLoginOpen(true)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mavzu taklif qilish</DialogTitle>
            <DialogDescription>
              Qaysi mavzuda maqola yozilishini xohlaysiz? Taklif barcha foydalanuvchilar
              uchun ko&apos;rinadi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="topic-title" className="text-sm font-medium">
                Mavzu sarlavhasi
              </label>
              <Input
                id="topic-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Masalan: Startap boshlash bo'yicha amaliy qo'llanma"
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="topic-description" className="text-sm font-medium">
                Tavsif
              </label>
              <Textarea
                id="topic-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Nima haqida yozilishini batafsil yozing..."
                rows={4}
                maxLength={2000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              type="button"
              className="bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
              disabled={
                isCreating ||
                !title.trim() ||
                description.trim().length < 5
              }
              onClick={() => void handleCreate()}
            >
              {isCreating ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  Yuborilmoqda...
                </>
              ) : (
                "Yuborish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
