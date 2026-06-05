"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAdminBannersQuery,
  useUpdateBannerMutation,
} from "@/features/banners/api/banners-api";
import type { PromoBanner } from "@/features/banners/types";

function BannerRow({ banner }: { banner: PromoBanner }) {
  const [title, setTitle] = useState(banner.title ?? "");
  const [linkUrl, setLinkUrl] = useState(banner.linkUrl);
  const [sortOrder, setSortOrder] = useState(String(banner.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(banner.isActive);
  const fileRef = useRef<HTMLInputElement>(null);

  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const handleSave = async () => {
    const file = fileRef.current?.files?.[0];
    await updateBanner({
      id: banner.id,
      title: title.trim() || undefined,
      linkUrl: linkUrl.trim(),
      sortOrder: Number(sortOrder) || 0,
      isActive,
      image: file,
    }).unwrap();
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-4 p-4 sm:grid-cols-[140px_1fr_auto] sm:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border bg-muted">
          <Image
            src={banner.imageUrl}
            alt={banner.title ?? "Banner"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`title-${banner.id}`}>Sarlavha (pastki matn)</Label>
            <Input
              id={`title-${banner.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Bu nima?"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`link-${banner.id}`}>Havola</Label>
            <Input
              id={`link-${banner.id}`}
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`sort-${banner.id}`}>Tartib</Label>
              <Input
                id={`sort-${banner.id}`}
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id={`active-${banner.id}`}
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="size-4 rounded border-input"
              />
              <Label htmlFor={`active-${banner.id}`}>Faol</Label>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`image-${banner.id}`}>Rasmni almashtirish</Label>
            <Input
              id={`image-${banner.id}`}
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </div>
        </div>

        <div className="flex gap-2 sm:flex-col">
          <Button
            type="button"
            size="sm"
            disabled={isUpdating || !linkUrl.trim()}
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
            onClick={() => void deleteBanner(banner.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function BannersPanel() {
  const { data, isLoading } = useGetAdminBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();

  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const fileRef = useRef<HTMLInputElement>(null);

  const banners = data?.banners ?? [];

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !linkUrl.trim()) return;

    await createBanner({
      title: title.trim() || undefined,
      linkUrl: linkUrl.trim(),
      sortOrder: Number(sortOrder) || 0,
      isActive: true,
      image: file,
    }).unwrap();

    setTitle("");
    setLinkUrl("");
    setSortOrder("0");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yangi reklama banneri</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => void handleCreate(event)}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="banner-image">Rasm</Label>
              <Input
                id="banner-image"
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-title">Sarlavha (pastki matn)</Label>
              <Input
                id="banner-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Bu nima?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-link">Havola</Label>
              <Input
                id="banner-link"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://redfox.uz"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="banner-sort">Tartib</Label>
              <Input
                id="banner-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="self-end sm:col-span-2 sm:justify-self-end"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="size-4" />
                  Banner qo&apos;shish
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Hozircha bannerlar yo&apos;q. Yuqoridan birinchi reklamani
            yuklang.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Mavjud bannerlar</h3>
            <Badge variant="secondary">{banners.length}</Badge>
          </div>
          {banners.map((banner) => (
            <BannerRow key={banner.id} banner={banner} />
          ))}
        </div>
      )}
    </div>
  );
}
