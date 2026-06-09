import { siteConfig } from "@/config/site";
import {
  buildProxyImageUrl,
  resolveMediaUrl,
} from "@/lib/articles/resolve-media-url";
import {
  DEFAULT_STORY_TEMPLATE,
  getStoryTemplate,
  STORY_CANVAS,
  type StoryTemplateId,
} from "@/lib/articles/story-background-templates";

export type { StoryTemplateId } from "@/lib/articles/story-background-templates";
export {
  DEFAULT_STORY_TEMPLATE,
  STORY_TEMPLATES,
} from "@/lib/articles/story-background-templates";

export type ArticleStoryData = {
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryName?: string;
  slug: string;
};

const STORY_WIDTH = STORY_CANVAS.width;
const STORY_HEIGHT = STORY_CANVAS.height;

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

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length >= maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines) {
    const joined = words.join(" ");
    const used = lines.join(" ");
    if (used.length < joined.length) {
      let last = lines[maxLines - 1] ?? "";
      while (last.length > 3 && ctx.measureText(`${last}…`).width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = `${last.replace(/[.,;:!?…]+$/, "")}…`;
    }
  }

  return lines;
}

async function blobToImageSource(blob: Blob): Promise<CanvasImageSource | null> {
  if (typeof createImageBitmap === "function") {
    return await createImageBitmap(blob);
  }

  return await new Promise<HTMLImageElement | null>((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    img.src = objectUrl;
  });
}

async function fetchImageBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

async function loadImageSource(
  rawUrl?: string | null,
): Promise<CanvasImageSource | null> {
  const url = resolveMediaUrl(rawUrl);
  if (!url) return null;

  const candidates = [url, buildProxyImageUrl(url)];

  for (const candidate of candidates) {
    const blob = await fetchImageBlob(candidate);
    if (!blob) continue;

    const image = await blobToImageSource(blob);
    if (image) return image;
  }

  return null;
}

function getImageDimensions(image: CanvasImageSource) {
  if (image instanceof HTMLImageElement) {
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  }

  if (image instanceof HTMLVideoElement) {
    return {
      width: image.videoWidth,
      height: image.videoHeight,
    };
  }

  if (image instanceof HTMLCanvasElement) {
    return {
      width: image.width,
      height: image.height,
    };
  }

  if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
    return {
      width: image.width,
      height: image.height,
    };
  }

  return { width: 0, height: 0 };
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.save();
  drawRoundedRect(ctx, x, y, width, height, 36);
  ctx.clip();

  const { width: sourceWidth, height: sourceHeight } = getImageDimensions(image);
  if (!sourceWidth || !sourceHeight) {
    ctx.restore();
    return;
  }
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, x, y, width, height, 36);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawCategoryBadge(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
): number {
  const fontSize = 28;
  const paddingX = 26;
  const paddingY = 12;

  ctx.save();
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const badgeWidth = textWidth + paddingX * 2;
  const badgeHeight = fontSize + paddingY * 2;

  drawRoundedRect(ctx, x, y, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + paddingX, y + badgeHeight / 2);
  ctx.restore();

  return badgeHeight;
}

function drawAuthorRow(
  ctx: CanvasRenderingContext2D,
  authorName: string,
  avatar: CanvasImageSource | null,
  x: number,
  topY: number,
) {
  const avatarSize = 72;
  const gap = 20;
  const textX = x + avatarSize + gap;
  const labelSize = 26;
  const nameSize = 34;
  const labelGap = 8;
  const textBlockHeight = labelSize + labelGap + nameSize;
  const textTopY = topY + (avatarSize - textBlockHeight) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    x + avatarSize / 2,
    topY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      x + avatarSize / 2,
      topY + avatarSize / 2,
      avatarSize / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.clip();
    ctx.drawImage(avatar, x, topY, avatarSize, avatarSize);
    ctx.restore();
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initial = authorName.trim().charAt(0).toUpperCase() || "M";
    ctx.fillText(initial, x + avatarSize / 2, topY + avatarSize / 2);
  }
  ctx.restore();

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.font = `500 ${labelSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillText("Muallif", textX, textTopY);

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${nameSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillText(authorName, textX, textTopY + labelSize + labelGap);
}

export async function generateArticleStoryImage(
  data: ArticleStoryData,
  templateId: StoryTemplateId = DEFAULT_STORY_TEMPLATE,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const [coverImage, avatarImage] = await Promise.all([
    data.coverImageUrl ? loadImageSource(data.coverImageUrl) : null,
    data.authorAvatarUrl ? loadImageSource(data.authorAvatarUrl) : null,
  ]);

  getStoryTemplate(templateId).draw(ctx, STORY_WIDTH, STORY_HEIGHT);

  const padding = 72;
  let cursorY = 108;

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "800 42px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(siteConfig.name.toUpperCase(), padding, cursorY);

  ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
  ctx.font = "500 28px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Yangi maqola", padding, cursorY + 44);

  cursorY += 96;

  if (coverImage) {
    const coverHeight = 620;
    drawCoverImage(
      ctx,
      coverImage,
      padding,
      cursorY,
      STORY_WIDTH - padding * 2,
      coverHeight,
    );
    cursorY += coverHeight + 48;
  }

  if (data.categoryName) {
    const badgeHeight = drawCategoryBadge(
      ctx,
      data.categoryName,
      padding,
      cursorY,
    );
    cursorY += badgeHeight + 32;
  }

  const titleLineHeight = 76;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px system-ui, -apple-system, Segoe UI, sans-serif";
  const titleLines = wrapTextLines(
    ctx,
    data.title,
    STORY_WIDTH - padding * 2,
    coverImage ? 3 : 5,
  );
  for (const line of titleLines) {
    ctx.fillText(line, padding, cursorY);
    cursorY += titleLineHeight;
  }

  const excerpt = (data.excerpt ?? "").trim();
  if (excerpt) {
    cursorY += 20;
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = "500 34px system-ui, -apple-system, Segoe UI, sans-serif";
    const excerptLineHeight = 50;
    const excerptLines = wrapTextLines(
      ctx,
      excerpt,
      STORY_WIDTH - padding * 2,
      3,
    );
    for (const line of excerptLines) {
      ctx.fillText(line, padding, cursorY);
      cursorY += excerptLineHeight;
    }
  }

  const authorRowTop = STORY_HEIGHT - 248;
  drawAuthorRow(ctx, data.authorName, avatarImage, padding, authorRowTop);

  const siteHost = siteConfig.host;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = "500 26px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(siteHost, padding, STORY_HEIGHT - 64);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export async function downloadArticleStoryImage(
  blob: Blob,
  slug: string,
): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `maqolas-${slug}-story.png`;
  link.click();
  URL.revokeObjectURL(url);
}

export type {
  StorySharePlatform,
  StoryShareResult,
} from "@/lib/articles/share-story-image";
export {
  getStoryShareFallbackMessage,
  getStoryShareSuccessMessage,
  shareStoryImageToPlatform as shareArticleStoryImage,
} from "@/lib/articles/share-story-image";
