"use client";

import { Download, LayoutDashboard, Users2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { useGetPlatformStatsQuery } from "@/features/admin/api/admin-api";
import type { PlatformStats } from "@/features/admin/types";
import { exportPlatformStatsImage } from "@/lib/admin/export-platform-stats-image";
import { formatCount } from "@/lib/format";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function formatStatNumber(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}

function formatGeneratedDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10 blur-2xl" />
      <p className="text-sm font-medium text-white/75">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/60">{hint}</p> : null}
    </div>
  );
}

function ShareStatsPreview({ stats }: { stats: PlatformStats }) {
  const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

  return (
    <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-linear-to-br from-[#b80452] via-[#84023f] to-[#1a0610]" />
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex h-full flex-col p-6 text-white sm:p-7">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-[0.2em] text-white/90">
            {siteConfig.name.toUpperCase()}
          </p>
          <p className="text-sm text-white/70">Platforma statistikasi</p>
        </div>

        <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-sm font-medium text-white/80">Jami obunalar</p>
          <p className="mt-1 text-4xl font-extrabold leading-none sm:text-5xl">
            {formatStatNumber(stats.totalFollows)}
          </p>
          <p className="mt-2 text-xs text-white/65">
            +{formatStatNumber(stats.newFollowsLast7Days)} oxirgi 7 kun
          </p>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-3 gap-2">
          <StatCard
            label="Foydalanuvchi"
            value={formatCount(stats.totalUsers)}
            className="p-3"
          />
          <StatCard
            label="Maqola"
            value={formatCount(stats.publishedArticles)}
            className="p-3"
          />
          <StatCard
            label="Izoh"
            value={formatCount(stats.approvedComments)}
            className="p-3"
          />
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-sm font-semibold text-white/90">
            O&apos;zbek tilidagi maqolalar platformasi
          </p>
          <p className="text-xs text-white/65">{siteHost}</p>
          <p className="text-[11px] text-white/50">
            {formatGeneratedDate(stats.generatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlatformStatsDashboard() {
  const { data, isLoading, isFetching } = useGetPlatformStatsQuery();
  const [templateOpen, setTemplateOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!data) return;
    setDownloading(true);
    try {
      await exportPlatformStatsImage(data);
      toast.success("Rasm yuklab olindi — Instagram yoki Telegramga joylang");
    } catch {
      toast.error("Rasmni yuklab olishda xatolik");
    } finally {
      setDownloading(false);
    }
  }

  if (isLoading) {
    return <Skeleton className="mb-6 h-52 w-full rounded-2xl" />;
  }

  if (!data) return null;

  const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

  return (
    <div className="mb-6 space-y-4">
      <Card className="overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <div className="relative overflow-hidden rounded-2xl border bg-linear-to-r from-[#b80452] via-[#84023f] to-[#5c0230] p-5 text-white sm:p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 size-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white/90">
                  <LayoutDashboard className="size-4" />
                  <span className="text-sm font-medium">Platforma dashboard</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Obunachilar va o&apos;sish statistikasi
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {isFetching ? (
                  <span className="text-xs text-white/60">Yangilanmoqda...</span>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2 border-white/20 bg-white/15 text-white hover:bg-white/25"
                  onClick={() => setTemplateOpen(true)}
                >
                  <Users2 className="size-4" />
                  Ijtimoiy tarmoq shabloni
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Jami obunalar"
                value={formatStatNumber(data.totalFollows)}
                hint={`+${formatStatNumber(data.newFollowsLast7Days)} oxirgi 7 kun`}
              />
              <StatCard
                label="Foydalanuvchilar"
                value={formatStatNumber(data.totalUsers)}
                hint={`+${formatStatNumber(data.newUsersLast7Days)} yangi`}
              />
              <StatCard
                label="Nashr etilgan maqolalar"
                value={formatStatNumber(data.publishedArticles)}
              />
              <StatCard
                label="Tasdiqlangan izohlar"
                value={formatStatNumber(data.approvedComments)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="space-y-1 border-b px-5 py-4 text-left">
            <DialogTitle className="flex items-center gap-2">
              <Users2 className="size-4 text-primary" />
              Ijtimoiy tarmoq shabloni
            </DialogTitle>
            <DialogDescription>
              Statistika rasmini yuklab olib, Instagram yoki Telegramga joylang.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 p-5">
            <ShareStatsPreview stats={data} />
            <Button
              type="button"
              className="w-full gap-2"
              disabled={downloading}
              onClick={() => void handleDownload()}
            >
              <Download className="size-4" />
              {downloading ? "Tayyorlanmoqda..." : "PNG yuklab olish (1080×1080)"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {siteHost} · Instagram post yoki Telegram uchun mos
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
