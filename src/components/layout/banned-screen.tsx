"use client";

import { useEffect, useState } from "react";
import { ShieldBan } from "lucide-react";
import type { BanInfo } from "@/features/auth/types";

function formatDuration(ms: number): string {
  if (ms <= 0) return "0 soniya";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} kun`);
  if (hours > 0) parts.push(`${hours} soat`);
  if (minutes > 0) parts.push(`${minutes} daqiqa`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} soniya`);

  return parts.join(" ");
}

export function BannedScreen({ ban }: { ban: BanInfo }) {
  const [remaining, setRemaining] = useState<number>(() => {
    if (ban.isPermanent || !ban.expiresAt) return -1;
    return Math.max(0, new Date(ban.expiresAt).getTime() - Date.now());
  });

  useEffect(() => {
    if (ban.isPermanent || !ban.expiresAt) return;

    const interval = setInterval(() => {
      const left = Math.max(0, new Date(ban.expiresAt!).getTime() - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [ban.isPermanent, ban.expiresAt]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldBan className="size-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Hisobingiz bloklangan
          </h1>
          <p className="text-muted-foreground">
            {ban.isPermanent
              ? "Siz ushbu saytdan doimiy ravishda bloklangansiz."
              : "Siz ushbu saytdan vaqtincha bloklangansiz."}
          </p>
        </div>

        {ban.reason ? (
          <div className="w-full rounded-lg border bg-muted/30 px-4 py-3 text-left text-sm">
            <p className="mb-1 font-medium text-foreground">Sabab:</p>
            <p className="text-muted-foreground">{ban.reason}</p>
          </div>
        ) : null}

        {!ban.isPermanent && remaining > 0 ? (
          <div className="w-full rounded-lg border bg-muted/30 px-4 py-4 text-center">
            <p className="mb-1 text-sm text-muted-foreground">
              Blok tugashiga qolgan vaqt:
            </p>
            <p className="text-xl font-semibold tabular-nums text-foreground">
              {formatDuration(remaining)}
            </p>
          </div>
        ) : null}

        {!ban.isPermanent && remaining === 0 ? (
          <p className="text-sm text-muted-foreground">
            Bloklash muddati tugagan. Sahifani yangilang.
          </p>
        ) : null}
      </div>
    </div>
  );
}
