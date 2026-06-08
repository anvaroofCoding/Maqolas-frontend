"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  ImageIcon,
  Lightbulb,
  Loader2,
  MessageSquare,
  Pencil,
  Pin,
  PinOff,
  ShieldBan,
  ShieldCheck,
  Trash2,
  Users2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveArticleRequestMutation,
  useApproveCommentsMutation,
  useApproveArticleMutation,
  useBanIpMutation,
  useBanUserMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCommentsAdminMutation,
  useGetAdminCategoriesQuery,
  useGetPublishedArticlesQuery,
  useGetReviewQueueQuery,
  useListArticleRequestsForModerationQuery,
  useListCommentsForModerationQuery,
  useListReportsQuery,
  useListUsersQuery,
  useDismissReportMutation,
  useRejectArticleRequestMutation,
  useRejectCommentsMutation,
  useRejectArticleMutation,
  useTogglePinArticleMutation,
  useUnbanUserMutation,
  useUpdateCategoryMutation,
} from "@/features/admin/api/admin-api";
import type {
  ArticleRequestModerationStatus,
  BanUnit,
  Category,
  CommentModerationStatus,
  CommentReportItem,
  CreateBanPayload,
  ModerationArticle,
  ModerationArticleRequestItem,
  ModerationCommentItem,
} from "@/features/admin/types";
import { BannersPanel } from "@/components/admin/banners-panel";
import { PlatformStatsDashboard } from "@/components/admin/platform-stats-dashboard";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";
import { formatRelativeTime } from "@/lib/format";
import { toast } from "@/lib/toast";

function ReviewQueuePanel() {
  const { data, isLoading, isFetching } = useGetReviewQueueQuery();
  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const [approveArticle, { isLoading: isApproving }] =
    useApproveArticleMutation();
  const [rejectArticle, { isLoading: isRejecting }] =
    useRejectArticleMutation();

  const [rejectTarget, setRejectTarget] = useState<ModerationArticle | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [previewArticle, setPreviewArticle] = useState<ModerationArticle | null>(
    null,
  );
  const [approveTarget, setApproveTarget] = useState<ModerationArticle | null>(
    null,
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const articles = data?.articles ?? [];
  const categories = categoriesData?.categories ?? [];
  const isBusy = isApproving || isRejecting;

  function openApproveDialog(article: ModerationArticle) {
    setApproveTarget(article);
    setSelectedCategoryIds([]);
  }

  async function handleApprove() {
    if (!approveTarget || selectedCategoryIds.length === 0) return;
    await approveArticle({
      id: approveTarget.id,
      categoryIds: selectedCategoryIds,
    });
    setApproveTarget(null);
    setSelectedCategoryIds([]);
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  async function handleReject() {
    if (!rejectTarget || rejectReason.trim().length < 10) return;
    await rejectArticle({ id: rejectTarget.id, reason: rejectReason.trim() });
    setRejectTarget(null);
    setRejectReason("");
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle2 className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Ko&apos;rib chiqish navbatida maqolalar yo&apos;q.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg leading-snug">
                    {article.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {article.author?.displayName ?? "Noma'lum muallif"}
                    {article.submittedAt
                      ? ` · ${formatRelativeTime(article.submittedAt)}`
                      : article.createdAt
                        ? ` · ${formatRelativeTime(article.createdAt)}`
                        : ""}
                  </p>
                </div>
                <Badge variant="secondary">Ko&apos;rib chiqilmoqda</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.excerpt ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewArticle(article)}
                >
                  Ko&apos;rish
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/maqola/${article.id}/tahrir`}>
                    <Pencil className="size-4" />
                    Tahrirlash
                  </Link>
                </Button>
                <Button
                  size="sm"
                  disabled={isBusy}
                  onClick={() => openApproveDialog(article)}
                >
                  {isApproving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  Tasdiqlash
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => {
                    setRejectTarget(article);
                    setRejectReason("");
                  }}
                >
                  <XCircle className="size-4" />
                  Rad etish
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isFetching && !isLoading ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Yangilanmoqda...
        </p>
      ) : null}

      <Dialog
        open={Boolean(previewArticle)}
        onOpenChange={(open) => !open && setPreviewArticle(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title}</DialogTitle>
            <DialogDescription>
              {previewArticle?.author?.displayName}
              {previewArticle?.author?.email
                ? ` · ${previewArticle.author.email}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {previewArticle ? (
            <div
              className="article-editor-content max-h-[50vh] overflow-y-auto rounded-lg border bg-muted/20 p-4"
              dangerouslySetInnerHTML={{ __html: previewArticle.contentHtml }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setApproveTarget(null);
            setSelectedCategoryIds([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Maqolani tasdiqlash</DialogTitle>
            <DialogDescription>
              Kamida bitta mavzu tanlang. Bir nechta mavzuda ham chiqishi mumkin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Mavzular</Label>
            <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto rounded-lg border p-3">
              {categories.map((category) => {
                const selected = selectedCategoryIds.includes(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-transparent bg-nav-active text-nav-active-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApproveTarget(null);
                setSelectedCategoryIds([]);
              }}
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              disabled={selectedCategoryIds.length === 0 || isApproving}
              onClick={() => void handleApprove()}
            >
              {isApproving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Tasdiqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Maqolani rad etish</DialogTitle>
            <DialogDescription>
              Muallifga ko&apos;rinadigan rad etish sababini yozing (kamida 10
              belgi).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Sabab</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Masalan: mavzu platforma qoidalariga mos kelmaydi..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {rejectReason.trim().length}/500 belgi
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
              }}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              disabled={rejectReason.trim().length < 10 || isRejecting}
              onClick={() => void handleReject()}
            >
              {isRejecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Rad etish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CategoryRow({
  category,
  onUpdated,
}: {
  category: Category;
  onUpdated: () => void;
}) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder));
  const [isActive, setIsActive] = useState(category.isActive);

  async function handleSave() {
    await updateCategory({
      id: category.id,
      body: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        sortOrder: Number(sortOrder) || 0,
        isActive,
      },
    });
    onUpdated();
  }

  async function handleDelete() {
    if (!confirm(`"${category.name}" mavzusini o'chirasizmi?`)) return;
    await deleteCategory(category.id);
    onUpdated();
  }

  return (
    <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1fr_80px_100px_auto] sm:items-end">
      <div className="space-y-1.5">
        <Label>Nomi</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Slug</Label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Tartib</Label>
        <Input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Holat</Label>
        <Button
          type="button"
          variant={isActive ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={() => setIsActive((value) => !value)}
        >
          {isActive ? "Faol" : "Yashirin"}
        </Button>
      </div>
      <div className="flex gap-2 sm:flex-col">
        <Button size="sm" disabled={isLoading} onClick={() => void handleSave()}>
          Saqlash
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={isDeleting}
          onClick={() => void handleDelete()}
        >
          O&apos;chirish
        </Button>
      </div>
    </div>
  );
}

function CategoriesPanel() {
  const { data, isLoading, refetch } = useGetAdminCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const categories = data?.categories ?? [];

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    await createCategory({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sortOrder: categories.length + 1,
      isActive: true,
    });

    setName("");
    setSlug("");
    refetch();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yangi mavzu</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => void handleCreate(event)}
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Nomi</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Texnologiya"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="texnologiya"
              />
            </div>
            <Button
              type="submit"
              className="self-end"
              disabled={isCreating || !name.trim() || !slug.trim()}
            >
              Qo&apos;shish
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onUpdated={() => void refetch()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PublishedArticlesPanel() {
  const { data, isLoading, isFetching } = useGetPublishedArticlesQuery();
  const [togglePin] = useTogglePinArticleMutation();
  const [pinningId, setPinningId] = useState<string | null>(null);

  const articles = data?.articles ?? [];

  async function handleTogglePin(articleId: string, isPinned: boolean) {
    setPinningId(articleId);
    try {
      await togglePin({ id: articleId, isPinned: !isPinned }).unwrap();
    } finally {
      setPinningId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Pin className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Nashr etilgan maqolalar yo&apos;q.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Qadalgan maqolalar lentada yuqorida ko&apos;rinadi. Faqat nashr etilgan
        maqolalarni qadash mumkin.
      </p>

      {articles.map((article) => (
        <Card
          key={article.id}
          className={
            article.isPinned ? "border-primary/40 ring-1 ring-primary/20" : undefined
          }
        >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg leading-snug">
                  {article.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {article.author?.displayName ?? "Noma'lum muallif"}
                  {article.publishedAt
                    ? ` · ${formatRelativeTime(article.publishedAt)}`
                    : ""}
                </p>
              </div>
              {article.isPinned ? (
                <Badge className="gap-1">
                  <Pin className="size-3 fill-current" />
                  Qadalgan
                </Badge>
              ) : (
                <Badge variant="secondary">Nashr etilgan</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/maqola/${article.slug}`} target="_blank">
                  <ExternalLink className="size-4" />
                  Ko&apos;rish
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/maqola/${article.id}/tahrir`}>
                  <Pencil className="size-4" />
                  Tahrirlash
                </Link>
              </Button>
              <Button
                size="sm"
                variant={article.isPinned ? "outline" : "default"}
                disabled={pinningId !== null}
                onClick={() =>
                  void handleTogglePin(article.id, Boolean(article.isPinned))
                }
              >
                {pinningId === article.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : article.isPinned ? (
                  <PinOff className="size-4" />
                ) : (
                  <Pin className="size-4" />
                )}
                {article.isPinned ? "Qadashni olib tashlash" : "Qadash"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {isFetching && !isLoading ? (
        <p className="text-center text-xs text-muted-foreground">
          Yangilanmoqda...
        </p>
      ) : null}
    </div>
  );
}

function CommentsPanel() {
  const [status, setStatus] = useState<CommentModerationStatus>("pending");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useListCommentsForModerationQuery({
      status,
      page,
      limit: 50,
    });
  const [approveComments, { isLoading: approving }] =
    useApproveCommentsMutation();
  const [rejectComments, { isLoading: rejecting }] =
    useRejectCommentsMutation();
  const [deleteComments, { isLoading: deleting }] =
    useDeleteCommentsAdminMutation();

  const comments = data?.comments ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const isBusy = approving || rejecting || deleting;

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    setSelectedIds([]);
  }, [status, page, data?.comments]);

  function toggleSelected(commentId: string) {
    setSelectedIds((current) =>
      current.includes(commentId)
        ? current.filter((id) => id !== commentId)
        : [...current, commentId],
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === comments.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(comments.map((comment) => comment.id));
  }

  async function handleApprove(commentIds: string[]) {
    if (commentIds.length === 0) return;
    try {
      const result = await approveComments({ commentIds }).unwrap();
      toast.success(`${result.approved} ta izoh tasdiqlandi`);
      setSelectedIds([]);
    } catch {
      toast.error("Izohlarni tasdiqlashda xatolik");
    }
  }

  async function handleReject(commentIds: string[], reason?: string) {
    if (commentIds.length === 0) return;
    try {
      const result = await rejectComments({
        commentIds,
        reason: reason?.trim() || undefined,
      }).unwrap();
      toast.success(`${result.rejected} ta izoh rad etildi`);
      setSelectedIds([]);
      setRejectOpen(false);
      setRejectReason("");
    } catch {
      toast.error("Izohlarni rad etishda xatolik");
    }
  }

  async function handleDelete(commentIds: string[]) {
    if (commentIds.length === 0) return;
    try {
      const result = await deleteComments({ commentIds }).unwrap();
      toast.success(`${result.deleted} ta izoh o'chirildi`);
      setSelectedIds([]);
    } catch {
      toast.error("Izohlarni o'chirishda xatolik");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <MessageSquare className="size-10 text-destructive/50" />
          <p className="text-sm text-muted-foreground">
            Izohlarni yuklab bo&apos;lmadi. Backend ishlayotganini tekshiring.
          </p>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Qayta urinish
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["pending", "approved", "rejected"] as const).map((item) => (
            <Button
              key={item}
              size="sm"
              variant={status === item ? "default" : "outline"}
              onClick={() => setStatus(item)}
            >
              {item === "pending"
                ? "Kutilmoqda"
                : item === "approved"
                  ? "Tasdiqlangan"
                  : "Rad etilgan"}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground">
            Jami: {total} ta
          </span>
        </div>

        {comments.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={toggleSelectAll}>
              {selectedIds.length === comments.length
                ? "Tanlovni bekor qilish"
                : "Hammasini tanlash"}
            </Button>
            {status === "pending" ? (
              <>
                <Button
                  size="sm"
                  disabled={isBusy || selectedIds.length === 0}
                  onClick={() => void handleApprove(selectedIds)}
                >
                  {approving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  Tanlanganlarni tasdiqlash
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isBusy || selectedIds.length === 0}
                  onClick={() => setRejectOpen(true)}
                >
                  <XCircle className="size-4" />
                  Tanlanganlarni rad etish
                </Button>
              </>
            ) : null}
            <Button
              size="sm"
              variant="destructive"
              disabled={isBusy || selectedIds.length === 0}
              onClick={() => void handleDelete(selectedIds)}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Tanlanganlarni o&apos;chirish
            </Button>
          </div>
        ) : null}
      </div>

      {comments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <MessageSquare className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {status === "pending"
                ? "Moderatsiya kutayotgan izohlar yo'q."
                : status === "approved"
                  ? "Tasdiqlangan izohlar yo'q."
                  : "Rad etilgan izohlar yo'q."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentModerationCard
              key={comment.id}
              comment={comment}
              selected={selectedIds.includes(comment.id)}
              isBusy={isBusy}
              onToggleSelected={() => toggleSelected(comment.id)}
              onApprove={() => void handleApprove([comment.id])}
              onReject={() => {
                setSelectedIds([comment.id]);
                setRejectOpen(true);
              }}
              onDelete={() => void handleDelete([comment.id])}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Oldingi
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || isFetching}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          >
            Keyingi
          </Button>
        </div>
      ) : null}

      {isFetching && !isLoading ? (
        <p className="text-center text-xs text-muted-foreground">
          Yangilanmoqda...
        </p>
      ) : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Izohlarni rad etish</DialogTitle>
            <DialogDescription>
              Tanlangan izohlar saytda ko&apos;rinmaydi. Sabab ixtiyoriy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Rad etish sababi</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Masalan: haqoratli so'zlar ishlatilgan"
              rows={4}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              disabled={rejecting || selectedIds.length === 0}
              onClick={() => void handleReject(selectedIds, rejectReason)}
            >
              {rejecting ? "Rad etilmoqda..." : "Rad etish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TopicSuggestionsPanel() {
  const [status, setStatus] =
    useState<ArticleRequestModerationStatus>("pending");
  const [page, setPage] = useState(1);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useListArticleRequestsForModerationQuery({
      status,
      page,
      limit: 20,
    });
  const [approveRequest, { isLoading: approving }] =
    useApproveArticleRequestMutation();
  const [rejectRequest, { isLoading: rejecting }] =
    useRejectArticleRequestMutation();

  const requests = data?.requests ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [status]);

  async function handleApprove(id: string) {
    try {
      await approveRequest(id).unwrap();
      toast.success("Mavzu taklifi tasdiqlandi");
    } catch {
      toast.error("Tasdiqlashda xatolik");
    }
  }

  async function handleReject() {
    if (!rejectingId) return;
    try {
      await rejectRequest({
        id: rejectingId,
        reason: rejectReason.trim() || undefined,
      }).unwrap();
      toast.success("Mavzu taklifi rad etildi");
      setRejectOpen(false);
      setRejectReason("");
      setRejectingId(null);
    } catch {
      toast.error("Rad etishda xatolik");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Lightbulb className="size-10 text-destructive/50" />
          <p className="text-sm text-muted-foreground">
            Takliflarni yuklab bo&apos;lmadi. Backend ishlayotganini tekshiring.
          </p>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Qayta urinish
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["pending", "approved", "rejected"] as const).map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "default" : "outline"}
            onClick={() => setStatus(item)}
          >
            {item === "pending"
              ? "Kutilmoqda"
              : item === "approved"
                ? "Tasdiqlangan"
                : "Rad etilgan"}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground">Jami: {total} ta</span>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Lightbulb className="size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {status === "pending"
                ? "Ko'rib chiqish kutayotgan mavzu takliflari yo'q."
                : status === "approved"
                  ? "Tasdiqlangan mavzu takliflari yo'q."
                  : "Rad etilgan mavzu takliflari yo'q."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <TopicSuggestionModerationCard
              key={request.id}
              request={request}
              isBusy={approving || rejecting}
              onApprove={() => void handleApprove(request.id)}
              onReject={() => {
                setRejectingId(request.id);
                setRejectOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Oldingi
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || isFetching}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          >
            Keyingi
          </Button>
        </div>
      ) : null}

      {isFetching && !isLoading ? (
        <p className="text-center text-xs text-muted-foreground">
          Yangilanmoqda...
        </p>
      ) : null}

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mavzu taklifini rad etish</DialogTitle>
            <DialogDescription>
              Rad etilgan taklif foydalanuvchilarga ko&apos;rinmaydi. Sabab
              ixtiyoriy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="topic-reject-reason">Rad etish sababi</Label>
            <Textarea
              id="topic-reject-reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Masalan: mavzu platforma qoidalariga mos kelmaydi"
              rows={4}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              disabled={rejecting || !rejectingId}
              onClick={() => void handleReject()}
            >
              {rejecting ? "Rad etilmoqda..." : "Rad etish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TopicSuggestionModerationCard({
  request,
  isBusy,
  onApprove,
  onReject,
}: {
  request: ModerationArticleRequestItem;
  isBusy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const requesterName =
    request.requester?.displayName ??
    request.requester?.username ??
    "Foydalanuvchi";

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold text-foreground">{request.title}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
          <Badge
            variant={
              request.moderationStatus === "approved"
                ? "default"
                : request.moderationStatus === "rejected"
                  ? "destructive"
                  : "secondary"
            }
          >
            {request.moderationStatus === "pending"
              ? "Kutilmoqda"
              : request.moderationStatus === "approved"
                ? "Tasdiqlangan"
                : "Rad etilgan"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{requesterName}</span>
          {request.author?.username ? (
            <span>· @{request.author.username} uchun</span>
          ) : null}
          {request.createdAt ? (
            <span>· {formatRelativeTime(request.createdAt)}</span>
          ) : null}
          {request.likeCount > 0 ? <span>· {request.likeCount} ovoz</span> : null}
        </div>

        {request.rejectionReason ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Sabab: {request.rejectionReason}
          </p>
        ) : null}

        {request.moderationStatus === "pending" ? (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={isBusy} onClick={onApprove}>
              {isBusy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              Tasdiqlash
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isBusy}
              onClick={onReject}
            >
              <XCircle className="size-4" />
              Rad etish
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function CommentModerationCard({
  comment,
  selected,
  isBusy,
  onToggleSelected,
  onApprove,
  onReject,
  onDelete,
}: {
  comment: ModerationCommentItem;
  selected: boolean;
  isBusy: boolean;
  onToggleSelected: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const authorName =
    comment.author?.displayName ?? comment.author?.username ?? "Foydalanuvchi";
  const articleTitle = comment.article?.title ?? "Maqola";
  const articleSlug = comment.article?.slug;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelected}
            className="mt-1 size-4 rounded border-input"
            aria-label="Izohni tanlash"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-base leading-snug">
              {authorName} izohi
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {articleTitle}
              {comment.createdAt
                ? ` · ${formatRelativeTime(comment.createdAt)}`
                : ""}
            </p>
          </div>
          <Badge
            variant={
              !comment.status || comment.status === "pending"
                ? "secondary"
                : comment.status === "approved"
                  ? "outline"
                  : "destructive"
            }
          >
            {!comment.status || comment.status === "pending"
              ? "Kutilmoqda"
              : comment.status === "approved"
                ? "Tasdiqlangan"
                : "Rad etilgan"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="rounded-lg border bg-muted/20 p-3 text-sm text-foreground/90">
          {comment.content}
        </p>
        {comment.rejectReason ? (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Rad sababi:</span>{" "}
            {comment.rejectReason}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {articleSlug ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/maqola/${articleSlug}`} target="_blank">
                <ExternalLink className="size-4" />
                Maqola
              </Link>
            </Button>
          ) : null}

          {!comment.status || comment.status === "pending" ? (
            <>
              <Button size="sm" disabled={isBusy} onClick={onApprove}>
                <CheckCircle2 className="size-4" />
                Tasdiqlash
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={onReject}
              >
                <XCircle className="size-4" />
                Rad etish
              </Button>
            </>
          ) : null}

          <Button
            size="sm"
            variant="destructive"
            disabled={isBusy}
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            O&apos;chirish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportedContentPlaceholder() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <AlertTriangle className="size-10 text-muted-foreground/50" />
        <div className="space-y-1">
          <p className="font-medium">Shikoyatlar (v2)</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Foydalanuvchilar tomonidan shikoyat qilingan kontentlar keyingi
            versiyada shu yerda ko&apos;rinadi.
          </p>
        </div>
        <Badge variant="outline">Tez orada</Badge>
      </CardContent>
    </Card>
  );
}

const banUnitLabels: Record<BanUnit, string> = {
  hours: "Soat",
  days: "Kun",
  months: "Oy",
  permanent: "Doimiy",
};

function ReportsPanel() {
  const { data, isLoading, isFetching, refetch } = useListReportsQuery();
  const [dismissReport, { isLoading: dismissing }] = useDismissReportMutation();
  const [banUser, { isLoading: banningUser }] = useBanUserMutation();
  const [banIp, { isLoading: banningIp }] = useBanIpMutation();

  const [banTarget, setBanTarget] = useState<{
    report: CommentReportItem;
    mode: "user" | "ip";
  } | null>(null);
  const [banReason, setBanReason] = useState("Qoidabuzarlik");
  const [banUnit, setBanUnit] = useState<BanUnit>("days");
  const [banAmount, setBanAmount] = useState("1");
  const [ipAddress, setIpAddress] = useState<string>("");

  const reports = data?.reports ?? [];
  const isBusy = dismissing || banningUser || banningIp;

  function openBanDialog(report: CommentReportItem, mode: "user" | "ip") {
    setBanTarget({ report, mode });
    setBanReason(
      report.reason?.trim() ? `Shikoyat: ${report.reason.trim()}` : "Shikoyat asosida bloklandi",
    );
    setBanUnit("days");
    setBanAmount("1");
    setIpAddress(report.reportedUserIp ?? report.comment?.authorIp ?? "");
  }

  async function handleDismiss(reportId: string) {
    try {
      await dismissReport(reportId).unwrap();
      toast.info("Shikoyat bekor qilindi");
    } catch {
      toast.error("Amal bajarilmadi");
    }
  }

  async function handleBan() {
    if (!banTarget) return;

    const payload: CreateBanPayload = {
      reason: banReason.trim() || "Qoidabuzarlik",
      durationUnit: banUnit,
      durationAmount: banUnit === "permanent" ? undefined : Number(banAmount) || 1,
      ipAddress:
        banTarget.mode === "ip" ? (ipAddress.trim() || undefined) : ipAddress.trim() || undefined,
    };

    try {
      if (banTarget.mode === "user") {
        const userId = banTarget.report.reportedUser?.id;
        if (!userId) return;
        await banUser({
          id: userId,
          body: payload,
          reportId: banTarget.report.id,
        }).unwrap();
        toast.success("Foydalanuvchi bloklandi");
      } else {
        if (!payload.ipAddress) return;
        await banIp({ body: payload, reportId: banTarget.report.id }).unwrap();
        toast.success("IP bloklandi");
      }
      setBanTarget(null);
    } catch {
      toast.error("Bloklash bajarilmadi");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertTriangle className="size-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Hozircha shikoyatlar yo&apos;q.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => {
          const commentPreview = report.comment?.content
            ? String(report.comment.content).slice(0, 220)
            : "";
          const articleSlug = report.article?.slug;
          const reportedUserName =
            report.reportedUser?.displayName ?? report.reportedUser?.username ?? "Foydalanuvchi";
          const reporterName =
            report.reporter?.displayName ?? report.reporter?.username ?? "Foydalanuvchi";

          return (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-base leading-snug">
                      {reportedUserName} izohi bo&apos;yicha shikoyat
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {reporterName}
                      {report.createdAt ? ` · ${formatRelativeTime(report.createdAt)}` : ""}
                    </p>
                  </div>
                  <Badge variant={report.status === "pending" ? "secondary" : "outline"}>
                    {report.status === "pending"
                      ? "Kutilmoqda"
                      : report.status === "reviewed"
                        ? "Ko'rildi"
                        : "Bekor qilindi"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {commentPreview ? (
                  <p className="rounded-lg border bg-muted/20 p-3 text-sm text-foreground/90">
                    {commentPreview}
                  </p>
                ) : null}
                {report.reason ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Sabab:</span>{" "}
                    {report.reason}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {articleSlug ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/maqola/${articleSlug}`} target="_blank">
                        <ExternalLink className="size-4" />
                        Maqola
                      </Link>
                    </Button>
                  ) : null}

                  <Button
                    size="sm"
                    disabled={isBusy}
                    onClick={() => openBanDialog(report, "user")}
                  >
                    <ShieldBan className="size-4" />
                    User bloklash
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => openBanDialog(report, "ip")}
                  >
                    <ShieldBan className="size-4" />
                    IP bloklash
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isBusy}
                    onClick={() => void handleDismiss(report.id)}
                  >
                    <XCircle className="size-4" />
                    Bekor qilish
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isFetching && !isLoading ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Yangilanmoqda...
        </p>
      ) : null}

      <Dialog open={Boolean(banTarget)} onOpenChange={(open) => !open && setBanTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {banTarget?.mode === "ip" ? "IP bloklash" : "Foydalanuvchini bloklash"}
            </DialogTitle>
            <DialogDescription>
              Bloklash muddatini va sababini kiriting. Admin o&apos;zi sonini yozadi.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Sabab</Label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            {banTarget?.mode === "ip" ? (
              <div className="grid gap-1.5">
                <Label>IP</Label>
                <Input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="Masalan: 185.XX.XX.XX"
                />
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Muddat birligi</Label>
                <div className="flex flex-wrap gap-2">
                  {(["hours", "days", "months", "permanent"] as BanUnit[]).map((unit) => (
                    <Button
                      key={unit}
                      type="button"
                      size="sm"
                      variant={banUnit === unit ? "default" : "outline"}
                      onClick={() => setBanUnit(unit)}
                    >
                      {banUnitLabels[unit]}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Soni</Label>
                <Input
                  type="number"
                  value={banAmount}
                  onChange={(e) => setBanAmount(e.target.value)}
                  disabled={banUnit === "permanent"}
                  min={1}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBanTarget(null)}>
              Bekor qilish
            </Button>
            <Button type="button" disabled={isBusy} onClick={() => void handleBan()}>
              Bloklash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function UsersPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, refetch } = useListUsersQuery(
    search.trim() ? { search: search.trim() } : undefined,
  );
  const [banUser, { isLoading: banning }] = useBanUserMutation();
  const [unbanUser, { isLoading: unbanning }] = useUnbanUserMutation();

  const [banUserTarget, setBanUserTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [banReason, setBanReason] = useState("Qoidabuzarlik");
  const [banUnit, setBanUnit] = useState<BanUnit>("days");
  const [banAmount, setBanAmount] = useState("1");

  const users = data?.users ?? [];
  const isBusy = banning || unbanning;

  function openBan(user: { id: string; displayName?: string; username?: string }) {
    const label = user.displayName ?? user.username ?? "Foydalanuvchi";
    setBanUserTarget({ id: user.id, label });
    setBanReason("Qoidabuzarlik");
    setBanUnit("days");
    setBanAmount("1");
  }

  async function handleBan() {
    if (!banUserTarget) return;
    try {
      await banUser({
        id: banUserTarget.id,
        body: {
          reason: banReason.trim() || "Qoidabuzarlik",
          durationUnit: banUnit,
          durationAmount: banUnit === "permanent" ? undefined : Number(banAmount) || 1,
        },
      }).unwrap();
      toast.success("Foydalanuvchi bloklandi");
      setBanUserTarget(null);
    } catch {
      toast.error("Bloklash bajarilmadi");
    }
  }

  async function handleUnban(id: string) {
    try {
      await unbanUser(id).unwrap();
      toast.info("Blok olib tashlandi");
    } catch {
      toast.error("Amal bajarilmadi");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PlatformStatsDashboard />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Foydalanuvchilar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism, username yoki email..."
              className="min-w-[220px] flex-1"
            />
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Qidirish
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 space-y-3">
        {users.map((user) => {
          const name = user.displayName ?? user.username ?? "Foydalanuvchi";
          const banned = Boolean(user.activeBan && user.activeBan.isActive);

          return (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-base leading-snug">{name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      @{user.username ?? "-"} · {user.email ?? "-"}
                    </p>
                  </div>
                  {banned ? (
                    <Badge variant="destructive">Bloklangan</Badge>
                  ) : (
                    <Badge variant="secondary">Faol</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {banned ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Sabab:</span>{" "}
                    {user.activeBan?.reason}
                    {user.activeBan?.isPermanent
                      ? " · doimiy"
                      : user.activeBan?.expiresAt
                        ? ` · tugash: ${formatRelativeTime(user.activeBan.expiresAt)}`
                        : ""}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {banned ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => void handleUnban(user.id)}
                    >
                      Blokni olib tashlash
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy}
                      onClick={() => openBan(user)}
                    >
                      <ShieldBan className="size-4" />
                      Bloklash
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {isFetching && !isLoading ? (
          <p className="text-center text-xs text-muted-foreground">
            Yangilanmoqda...
          </p>
        ) : null}
      </div>

      <Dialog open={Boolean(banUserTarget)} onOpenChange={(open) => !open && setBanUserTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Foydalanuvchini bloklash</DialogTitle>
            <DialogDescription>
              {banUserTarget?.label}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Sabab</Label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Muddat birligi</Label>
                <div className="flex flex-wrap gap-2">
                  {(["hours", "days", "months", "permanent"] as BanUnit[]).map((unit) => (
                    <Button
                      key={unit}
                      type="button"
                      size="sm"
                      variant={banUnit === unit ? "default" : "outline"}
                      onClick={() => setBanUnit(unit)}
                    >
                      {banUnitLabels[unit]}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Soni</Label>
                <Input
                  type="number"
                  value={banAmount}
                  onChange={(e) => setBanAmount(e.target.value)}
                  disabled={banUnit === "permanent"}
                  min={1}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBanUserTarget(null)}>
              Bekor qilish
            </Button>
            <Button type="button" disabled={isBusy} onClick={() => void handleBan()}>
              Bloklash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminPanel() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [mounted, setMounted] = useState(false);

  const { data: meData, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const activeUser = meData?.user ?? user;
  const isSuperAdmin = activeUser?.role === "super_admin";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!accessToken) {
      router.replace("/");
      return;
    }
    if (!isLoading && (isError || !isSuperAdmin)) {
      router.replace("/");
    }
  }, [mounted, accessToken, isLoading, isError, isSuperAdmin, router]);

  if (!mounted || isLoading || !isSuperAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Admin panel
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Moderatsiya, mavzular va platforma boshqaruvi — faqat super admin
            uchun.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ExternalLink className="size-4" />
            Saytga qaytish
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="review" className="gap-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1">
          <TabsTrigger value="review" className="gap-2">
            <CheckCircle2 className="size-4" />
            Ko&apos;rib chiqish
          </TabsTrigger>
          <TabsTrigger value="topic-suggestions" className="gap-2">
            <Lightbulb className="size-4" />
            Mavzu takliflari
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-2">
            <Pin className="size-4" />
            Nashr etilgan
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="size-4" />
            Mavzular
          </TabsTrigger>
          <TabsTrigger value="banners" className="gap-2">
            <ImageIcon className="size-4" />
            Reklamalar
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="size-4" />
            Izohlar
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <AlertTriangle className="size-4" />
            Shikoyatlar
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users2 className="size-4" />
            Foydalanuvchilar
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="review">
          <ReviewQueuePanel />
        </TabsContent>

        <TabsContent value="topic-suggestions">
          <TopicSuggestionsPanel />
        </TabsContent>

        <TabsContent value="published">
          <PublishedArticlesPanel />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesPanel />
        </TabsContent>

        <TabsContent value="banners">
          <BannersPanel />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsPanel />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsPanel />
        </TabsContent>

        <TabsContent value="users">
          <UsersPanel />
        </TabsContent>
      </Tabs>

    </div>
  );
}
