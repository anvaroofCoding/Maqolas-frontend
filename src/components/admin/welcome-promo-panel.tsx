"use client";

import { BadgeCheck, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveWelcomePromoCommentsMutation,
  useCreateWelcomePromoMutation,
  useDeleteWelcomePromoCommentsMutation,
  useDeleteWelcomePromoMutation,
  useGetAdminWelcomePromoCommentsQuery,
  useGetAdminWelcomePromosQuery,
  useRejectWelcomePromoCommentsMutation,
  useUpdateWelcomePromoMutation,
} from "@/features/welcome-promo/api/welcome-promo-api";
import type { WelcomePromo } from "@/features/welcome-promo/types";
import { formatRelativeTime } from "@/lib/format";
import { toast } from "@/lib/toast";

function PromoRow({ promo }: { promo: WelcomePromo }) {
  const [title, setTitle] = useState(promo.title);
  const [description, setDescription] = useState(promo.description);
  const [linkUrl, setLinkUrl] = useState(promo.linkUrl ?? "");
  const [linkLabel, setLinkLabel] = useState(promo.linkLabel ?? "");
  const [isActive, setIsActive] = useState(promo.isActive);
  const fileRef = useRef<HTMLInputElement>(null);

  const [updatePromo, { isLoading: isUpdating }] = useUpdateWelcomePromoMutation();
  const [deletePromo, { isLoading: isDeleting }] = useDeleteWelcomePromoMutation();

  const handleSave = async () => {
    const file = fileRef.current?.files?.[0];
    await updatePromo({
      id: promo.id,
      title: title.trim(),
      description: description.trim(),
      linkUrl: linkUrl.trim() || undefined,
      linkLabel: linkLabel.trim() || undefined,
      isActive,
      image: file,
    }).unwrap();
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Reklama saqlandi");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[180px_1fr_auto] lg:items-start">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-muted lg:aspect-[4/3]">
          <Image
            src={promo.imageUrl}
            alt={promo.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {isActive ? (
              <Badge className="gap-1 bg-emerald-600 text-white">
                <BadgeCheck className="size-3.5" />
                Joylangan (faol)
              </Badge>
            ) : (
              <Badge variant="secondary">Joylanmagan</Badge>
            )}
            {typeof promo.commentCount === "number" ? (
              <Badge variant="outline">{promo.commentCount} izoh</Badge>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`promo-title-${promo.id}`}>Sarlavha</Label>
            <Input
              id={`promo-title-${promo.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`promo-desc-${promo.id}`}>Tavsif</Label>
            <Textarea
              id={`promo-desc-${promo.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`promo-link-${promo.id}`}>Havola (ixtiyoriy)</Label>
              <Input
                id={`promo-link-${promo.id}`}
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`promo-link-label-${promo.id}`}>
                Tugma matni (ixtiyoriy)
              </Label>
              <Input
                id={`promo-link-label-${promo.id}`}
                value={linkLabel}
                onChange={(event) => setLinkLabel(event.target.value)}
                placeholder="Masalan: Batafsil"
                maxLength={100}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tugma faqat havola va tugma matni ikkalasi ham kiritilganda
            ko&apos;rinadi.
          </p>

          <div className="flex items-center gap-2">
            <input
              id={`promo-active-${promo.id}`}
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 rounded border-input"
            />
            <Label htmlFor={`promo-active-${promo.id}`}>
              Dasturga kirganda ko&apos;rsatish
            </Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`promo-image-${promo.id}`}>Rasmni almashtirish</Label>
            <Input
              id={`promo-image-${promo.id}`}
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </div>
        </div>

        <div className="flex gap-2 lg:flex-col">
          <Button
            type="button"
            size="sm"
            disabled={isUpdating || !title.trim() || !description.trim()}
            onClick={() => void handleSave()}
          >
            {isUpdating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Saqlash"
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void deletePromo(promo.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PromoCommentsModeration() {
  const { data, isLoading } = useGetAdminWelcomePromoCommentsQuery({
    status: "pending",
  });
  const [approveComments, { isLoading: isApproving }] =
    useApproveWelcomePromoCommentsMutation();
  const [rejectComments, { isLoading: isRejecting }] =
    useRejectWelcomePromoCommentsMutation();
  const [deleteComments, { isLoading: isDeleting }] =
    useDeleteWelcomePromoCommentsMutation();

  const comments = data?.comments ?? [];

  const handleApprove = async (commentId: string) => {
    await approveComments({ commentIds: [commentId] }).unwrap();
    toast.success("Izoh tasdiqlandi");
  };

  const handleReject = async (commentId: string) => {
    await rejectComments({ commentIds: [commentId] }).unwrap();
    toast.success("Izoh rad etildi");
  };

  const handleDelete = async (commentId: string) => {
    await deleteComments({ commentIds: [commentId] }).unwrap();
    toast.success("Izoh o'chirildi");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reklama izohlari (moderatsiya)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Kutilayotgan izohlar yo&apos;q.
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {comment.author?.displayName ?? "Noma'lum"}
                  </span>
                  {comment.promo?.title ? (
                    <Badge variant="outline">{comment.promo.title}</Badge>
                  ) : null}
                  {comment.createdAt ? (
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                  ) : null}
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isApproving}
                    onClick={() => void handleApprove(comment.id)}
                  >
                    Tasdiqlash
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isRejecting}
                    onClick={() => void handleReject(comment.id)}
                  >
                    Rad etish
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(comment.id)}
                  >
                    O&apos;chirish
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WelcomePromoPanel() {
  const { data, isLoading } = useGetAdminWelcomePromosQuery();
  const [createPromo, { isLoading: isCreating }] = useCreateWelcomePromoMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [isActive, setIsActive] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const promos = data?.promos ?? [];

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim() || !description.trim()) return;

    await createPromo({
      title: title.trim(),
      description: description.trim(),
      linkUrl: linkUrl.trim() || undefined,
      linkLabel: linkLabel.trim() || undefined,
      isActive,
      image: file,
    }).unwrap();

    setTitle("");
    setDescription("");
    setLinkUrl("");
    setLinkLabel("");
    setIsActive(true);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Kirish reklamasi yaratildi");
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              Kirish reklamasi qanday ishlaydi?
            </p>
            <p className="text-muted-foreground">
              Faqat &quot;Joylangan&quot; deb belgilangan reklama foydalanuvchilarga
              modalda ko&apos;rinadi. Saytga kirganda sessiyada 1 marta chiqadi;
              refresh qilganda qayta ko&apos;rinmaydi.
              Modalda &quot;Xizmat 100% kafolatlangan&quot; belgisi avtomatik
              ko&apos;rsatiladi.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yangi kirish reklamasi</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => void handleCreate(event)}
            className="grid gap-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="new-promo-image">Rasm</Label>
              <Input
                id="new-promo-image"
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-promo-title">Sarlavha</Label>
              <Input
                id="new-promo-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Masalan: RedFox xizmati"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-promo-desc">Tavsif</Label>
              <Textarea
                id="new-promo-desc"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Reklama haqida qisqacha ma'lumot..."
                rows={4}
                maxLength={2000}
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-promo-link">Havola (ixtiyoriy)</Label>
                <Input
                  id="new-promo-link"
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-promo-link-label">Tugma matni (ixtiyoriy)</Label>
                <Input
                  id="new-promo-link-label"
                  value={linkLabel}
                  onChange={(event) => setLinkLabel(event.target.value)}
                  placeholder="Masalan: Batafsil"
                  maxLength={100}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Tugma faqat havola va tugma matni ikkalasi ham kiritilganda
              ko&apos;rinadi.
            </p>

            <div className="flex items-center gap-2">
              <input
                id="new-promo-active"
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="new-promo-active">
                Yaratilgandan keyin darhol joylash
              </Label>
            </div>

            <Button type="submit" disabled={isCreating} className="self-end">
              {isCreating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="size-4" />
                  Reklama qo&apos;shish
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 1 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Hozircha kirish reklamasi yo&apos;q. Yuqoridan birinchi reklamani
            yarating.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Mavjud reklamalar</h3>
            <Badge variant="secondary">{promos.length}</Badge>
          </div>
          {promos.map((promo) => (
            <PromoRow key={promo.id} promo={promo} />
          ))}
        </div>
      )}

      <PromoCommentsModeration />
    </div>
  );
}
