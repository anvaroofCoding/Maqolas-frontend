"use client";

import { Download, Instagram, Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { iosIconClass } from "@/components/articles/flying-like-heart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleStoryData } from "@/lib/articles/export-article-story-image";
import {
  DEFAULT_STORY_TEMPLATE,
  downloadArticleStoryImage,
  generateArticleStoryImage,
  shareArticleStoryImage,
  STORY_TEMPLATES,
  type StorySharePlatform,
  type StoryTemplateId,
} from "@/lib/articles/export-article-story-image";
import { renderStoryTemplateThumbnail } from "@/lib/articles/story-background-templates";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M9.78 15.53 9.6 19.8c.31 0 .45-.13.61-.29l1.47-1.4 3.05 2.24c.56.31.96.15 1.1-.52l2.01-9.44h.01c.18-.84-.3-1.17-.85-.97L3.9 10.77c-.82.32-.81.78-.14.99l4.46 1.39 10.36-6.54c.49-.32.93-.14.57.18" />
    </svg>
  );
}

type ArticleShareStoryProps = {
  storyData: ArticleStoryData;
  variant?: "overlay" | "inline" | "engagement";
  className?: string;
};

export function ArticleShareStory({
  storyData,
  variant = "overlay",
  className,
}: ArticleShareStoryProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState<StorySharePlatform | "save" | null>(
    null,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<StoryTemplateId>(DEFAULT_STORY_TEMPLATE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [templateThumbs, setTemplateThumbs] = useState<
    Partial<Record<StoryTemplateId, string>>
  >({});
  const blobRef = useRef<Blob | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    blobRef.current = null;
  }, []);

  const generatePreview = useCallback(
    async (templateId: StoryTemplateId) => {
      setGenerating(true);
      clearPreview();

      try {
        const blob = await generateArticleStoryImage(storyData, templateId);
        if (!blob) {
          toast.error("Story rasmi yaratilmadi. Qayta urinib ko'ring.");
          return;
        }

        blobRef.current = blob;
        const nextUrl = URL.createObjectURL(blob);
        previewUrlRef.current = nextUrl;
        setPreviewUrl(nextUrl);
      } catch {
        toast.error("Story rasmi yaratilmadi. Qayta urinib ko'ring.");
      } finally {
        setGenerating(false);
      }
    },
    [clearPreview, storyData],
  );

  const handleOpen = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setSelectedTemplate(DEFAULT_STORY_TEMPLATE);
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      clearPreview();
      setSharing(null);
      setSelectedTemplate(DEFAULT_STORY_TEMPLATE);
    }
  };

  const handleTemplateSelect = (templateId: StoryTemplateId) => {
    if (templateId === selectedTemplate || generating) return;
    setSelectedTemplate(templateId);
  };

  useEffect(() => {
    const thumbs = Object.fromEntries(
      STORY_TEMPLATES.map((template) => [
        template.id,
        renderStoryTemplateThumbnail(template.id),
      ]),
    ) as Record<StoryTemplateId, string>;
    setTemplateThumbs(thumbs);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    void generatePreview(selectedTemplate);
  }, [open, selectedTemplate, generatePreview]);

  const handleShare = async (platform: StorySharePlatform) => {
    if (!blobRef.current) return;

    setSharing(platform);
    try {
      const result = await shareArticleStoryImage(
        blobRef.current,
        storyData.slug,
        platform,
      );

      if (result === "shared") {
        toast.success(
          platform === "instagram"
            ? "Instagram orqali ulashish ochildi"
            : "Telegram orqali ulashish ochildi",
        );
        setOpen(false);
        return;
      }

      toast.info(
        platform === "instagram"
          ? "Rasm yuklab olindi. Instagram Stories'ga qo'shing."
          : "Rasm yuklab olindi. Telegram Stories'ga qo'shing.",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("Ulashish amalga oshmadi. Qayta urinib ko'ring.");
    } finally {
      setSharing(null);
    }
  };

  const handleSave = async () => {
    if (!blobRef.current) return;

    setSharing("save");
    try {
      await downloadArticleStoryImage(blobRef.current, storyData.slug);
      toast.success("Story rasmi saqlandi");
    } catch {
      toast.error("Rasmni saqlab bo'lmadi");
    } finally {
      setSharing(null);
    }
  };

  const trigger =
    variant === "engagement" ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-10 gap-2 rounded-full border-0 bg-transparent px-3 font-normal text-muted-foreground shadow-none",
          "hover:bg-transparent hover:text-foreground",
          className,
        )}
        aria-label="Story'ga ulashish"
        onClick={(event) => void handleOpen(event)}
      >
        <Share2 className={iosIconClass} aria-hidden />
      </Button>
    ) : (
      <button
        type="button"
        className={cn(
          variant === "overlay"
            ? cn(
                "inline-flex size-9 items-center justify-center rounded-full",
                "bg-black/45 text-white backdrop-blur-sm",
                "transition-colors duration-200 hover:bg-black/60",
              )
            : cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-3",
                "text-sm text-muted-foreground hover:text-foreground",
              ),
          className,
        )}
        aria-label="Story'ga ulashish"
        onClick={(event) => void handleOpen(event)}
      >
        <Share2 className="size-4" aria-hidden />
        {variant === "inline" ? (
          <span className="text-sm">Ulashish</span>
        ) : null}
      </button>
    );

  return (
    <>
      {trigger}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="space-y-1 border-b px-5 py-4 text-left">
            <DialogTitle>Story&apos;ga ulashish</DialogTitle>
            <DialogDescription>
              Maqola reklama rasmini Instagram yoki Telegram story&apos;siga
              yuboring yoki saqlab oling.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 bg-muted/40 p-5 sm:flex-row sm:items-start">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-background shadow-lg sm:mx-0">
              {generating ? (
                <Skeleton className="absolute inset-0 rounded-none" />
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Story ko'rinishi"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  Ko&apos;rinish yaratilmadi
                </div>
              )}

              {generating ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                  <Loader2 className="size-8 animate-spin text-nav-active" />
                </div>
              ) : null}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col sm:max-h-[391px]">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Fon shabloni
              </p>
              <div className="scrollbar-hidden flex max-h-48 flex-col gap-2 overflow-y-auto p-1 sm:max-h-none sm:flex-1">
                {STORY_TEMPLATES.map((template) => {
                  const isActive = selectedTemplate === template.id;
                  const thumb = templateThumbs[template.id];

                  return (
                    <button
                      key={template.id}
                      type="button"
                      aria-label={`${template.label} shabloni`}
                      aria-pressed={isActive}
                      disabled={generating}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all",
                        isActive
                          ? "bg-nav-active/15 ring-2 ring-nav-active"
                          : "bg-background/80 ring-1 ring-border hover:ring-nav-active/40",
                      )}
                    >
                      <div className="relative h-14 w-8 shrink-0 overflow-hidden rounded-md">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <Skeleton className="absolute inset-0 rounded-none" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          isActive
                            ? "font-semibold text-nav-active"
                            : "text-foreground",
                        )}
                      >
                        {template.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t p-5 sm:grid-cols-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start gap-2 rounded-xl"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleShare("instagram")}
            >
              {sharing === "instagram" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Instagram className="size-4" />
              )}
              Instagram
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start gap-2 rounded-xl"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleShare("telegram")}
            >
              {sharing === "telegram" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <TelegramIcon className="size-4" />
              )}
              Telegram
            </Button>

            <Button
              type="button"
              className="h-11 justify-start gap-2 rounded-xl"
              disabled={generating || !previewUrl || sharing !== null}
              onClick={() => void handleSave()}
            >
              {sharing === "save" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Saqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
