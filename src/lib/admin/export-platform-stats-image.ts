import type { PlatformStats } from "@/features/admin/types";
import { siteConfig } from "@/config/site";

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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawStatTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
) {
  ctx.save();
  drawRoundedRect(ctx, x, y, width, height, 28);
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(label, x + 28, y + 52);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(value, x + 28, y + 118);
  ctx.restore();
}

export async function exportPlatformStatsImage(stats: PlatformStats) {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#b80452");
  gradient.addColorStop(0.45, "#84023f");
  gradient.addColorStop(1, "#1a0610");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(920, 140, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, 920, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "700 44px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(siteConfig.name.toUpperCase(), 72, 108);

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = "500 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Platforma statistikasi", 72, 154);

  drawRoundedRect(ctx, 72, 196, 936, 300, 36);
  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "600 34px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Jami obunalar", 108, 268);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 132px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(formatStatNumber(stats.totalFollows), 108, 410);

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(
    `+${formatStatNumber(stats.newFollowsLast7Days)} oxirgi 7 kun`,
    108,
    458,
  );

  const tileY = 540;
  const tileW = 288;
  const tileH = 156;
  const gap = 36;
  drawStatTile(
    ctx,
    72,
    tileY,
    tileW,
    tileH,
    "Foydalanuvchilar",
    formatStatNumber(stats.totalUsers),
  );
  drawStatTile(
    ctx,
    72 + tileW + gap,
    tileY,
    tileW,
    tileH,
    "Maqolalar",
    formatStatNumber(stats.publishedArticles),
  );
  drawStatTile(
    ctx,
    72 + (tileW + gap) * 2,
    tileY,
    tileW,
    tileH,
    "Izohlar",
    formatStatNumber(stats.approvedComments),
  );

  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.font = "600 32px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("O'zbek tilidagi maqolalar platformasi", 72, 780);

  const siteHost = siteConfig.url.replace(/^https?:\/\//, "");
  ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(siteHost, 72, 828);

  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = "500 24px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(formatGeneratedDate(stats.generatedAt), 72, 980);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `maqolas-stats-${new Date().toISOString().slice(0, 10)}.png`;
  link.click();
  URL.revokeObjectURL(url);
}
