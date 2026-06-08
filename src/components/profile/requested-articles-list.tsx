"use client";

import { Heart, Loader2Icon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  useListArticleRequestsQuery,
  useToggleArticleRequestLikeMutation,
  useUpdateArticleRequestNoteMutation,
} from "@/features/article-requests/api/article-requests-api";
import type {
  ArticleRequest,
  ArticleRequestStatus,
} from "@/features/article-requests/types";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ArticleRequestStatus, string> = {
  new: "Yangi",
  in_progress: "Jarayonda",
  fulfilled: "Bajarildi",
};

type RequestedArticlesListProps = {
  authorUsername: string;
  isOwnProfile?: boolean;
};

function RequestedArticlesSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index} className="rounded-xl border p-4 sm:p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-3/4 max-w-md rounded-md" />
              <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-8 w-12 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ArticleRequestCard({
  request,
  authorUsername,
  isOwnProfile,
  onRequireLogin,
}: {
  request: ArticleRequest;
  authorUsername: string;
  isOwnProfile?: boolean;
  onRequireLogin: () => void;
}) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [toggleLike, { isLoading: isTogglingLike }] =
    useToggleArticleRequestLikeMutation();
  const [updateNote, { isLoading: isUpdatingNote }] =
    useUpdateArticleRequestNoteMutation();
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(request.authorNote ?? "");
  const [likedByMe, setLikedByMe] = useState(request.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(request.likeCount);

  useEffect(() => {
    setLikedByMe(request.likedByMe ?? false);
    setLikeCount(request.likeCount);
  }, [request.likedByMe, request.likeCount]);

  const handleToggleLike = async () => {
    if (!accessToken) {
      onRequireLogin();
      return;
    }

    try {
      const result = await toggleLike({
        id: request.id,
        authorUsername,
      }).unwrap();
      setLikedByMe(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      // keep current state on failure
    }
  };

  const handleSaveNote = async () => {
    try {
      await updateNote({
        id: request.id,
        authorUsername,
        authorNote: noteText.trim(),
      }).unwrap();
      setNoteOpen(false);
    } catch {
      // keep dialog open on failure
    }
  };

  const requesterName =
    request.requester?.displayName ?? request.requester?.username ?? "Foydalanuvchi";

  return (
    <>
      <Card className="rounded-xl border shadow-sm">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
              {request.title}
            </h3>
            <Badge className="shrink-0 rounded-full border-transparent bg-nav-active px-2.5 py-0.5 text-xs font-medium text-nav-active-foreground hover:bg-nav-active">
              {STATUS_LABELS[request.status]}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {request.description}
          </p>

          {request.authorNote ? (
            <div className="rounded-lg border border-border/80 bg-muted/50 px-4 py-3">
              <div className="border-l-2 border-nav-active pl-3">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-medium">Muallif izohi: </span>
                  {request.authorNote}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="size-7 shrink-0">
                {request.requester?.avatarUrl ? (
                  <AvatarImage
                    src={request.requester.avatarUrl}
                    alt={requesterName}
                  />
                ) : null}
                <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                  {getUserInitials(requesterName)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium text-foreground/80">
                {request.requester?.username ?? "foydalanuvchi"}
              </span>
              {request.createdAt ? (
                <span className="shrink-0 text-xs">
                  {formatRelativeTime(request.createdAt)}
                </span>
              ) : null}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 gap-1.5 rounded-full px-3 text-muted-foreground",
                likedByMe && "text-nav-active",
              )}
              disabled={isTogglingLike}
              aria-label="Yoqtirish"
              aria-pressed={likedByMe}
              onClick={() => void handleToggleLike()}
            >
              <Heart
                className={cn(
                  "size-4",
                  likedByMe && "fill-nav-active text-nav-active",
                )}
                aria-hidden
              />
              <span className="text-sm tabular-nums">{formatCount(likeCount)}</span>
            </Button>
          </div>

          {isOwnProfile ? (
            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setNoteText(request.authorNote ?? "");
                  setNoteOpen(true);
                }}
              >
                {request.authorNote ? "Izohni tahrirlash" : "Izoh qoldirish"}
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Muallif izohi</DialogTitle>
            <DialogDescription>
              O&apos;quvchilarga bu so&apos;rov bo&apos;yicha javobingizni yozing.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Masalan: Ha, shuni harakat qilaman. Yaqinda chiqaraman..."
            rows={4}
            maxLength={1000}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNoteOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              type="button"
              disabled={isUpdatingNote}
              onClick={() => void handleSaveNote()}
            >
              {isUpdatingNote ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function RequestedArticlesList({
  authorUsername,
  isOwnProfile = false,
}: RequestedArticlesListProps) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data, isLoading, isFetching } = useListArticleRequestsQuery({
    author: authorUsername,
  });
  const [createRequest, { isLoading: isCreating }] =
    useCreateArticleRequestMutation();
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
        authorUsername,
        title: trimmedTitle,
        description: trimmedDescription,
      }).unwrap();
      setTitle("");
      setDescription("");
      setCreateOpen(false);
      toast.success(
        "So'rov yuborildi. Admin tasdiqlagach, muallif va boshqalar ko'radi.",
      );
    } catch {
      toast.error("So'rov yuborilmadi. Qayta urinib ko'ring.");
    }
  };

  if (isLoading) {
    return <RequestedArticlesSkeleton />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            So&apos;ralgan maqolalar
          </h2>
          {!isOwnProfile ? (
            <Button
              type="button"
              size="sm"
              className="w-fit shrink-0 rounded-full bg-nav-active px-4 text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
              onClick={handleOpenCreate}
            >
              <PlusIcon className="size-4" aria-hidden />
              Maqola so&apos;rash
            </Button>
          ) : null}
        </div>

        {isFetching && !isLoading ? (
          <p className="text-xs text-muted-foreground">Yangilanmoqda...</p>
        ) : null}

        {requests.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {isOwnProfile
                ? "Hozircha sizga maqola so'ralmagan."
                : "Hozircha so'ralgan maqolalar yo'q. Birinchi bo'lib mavzu taklif qiling."}
            </p>
            {!isOwnProfile ? (
              <Button
                type="button"
                size="sm"
                className="mt-4 rounded-full bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground"
                onClick={handleOpenCreate}
              >
                <PlusIcon className="size-4" aria-hidden />
                Maqola so&apos;rash
              </Button>
            ) : null}
          </div>
        ) : (
          requests.map((request) => (
            <ArticleRequestCard
              key={request.id}
              request={request}
              authorUsername={authorUsername}
              isOwnProfile={isOwnProfile}
              onRequireLogin={() => setLoginOpen(true)}
            />
          ))
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maqola so&apos;rash</DialogTitle>
            <DialogDescription>
              Qanday mavzuda maqola yozilishini xohlaysiz? So&apos;rov avval
              admin tomonidan ko&apos;rib chiqiladi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="request-title" className="text-sm font-medium">
                Mavzu sarlavhasi
              </label>
              <Input
                id="request-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Masalan: Dasturlashda patternlar mavzusini davom etiring"
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="request-description" className="text-sm font-medium">
                Tavsif
              </label>
              <Textarea
                id="request-description"
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
                isCreating || !title.trim() || description.trim().length < 5
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
