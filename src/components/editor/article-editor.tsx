"use client";

import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Maximize2Icon, Minimize2Icon, PanelTopCloseIcon, PanelTopOpenIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { EditorBubbleMenu } from "@/components/editor/editor-bubble-menu";
import { EditorTableMenu } from "@/components/editor/editor-table-menu";
import { EditorContextMenu } from "@/components/editor/editor-context-menu";
import { ArticleHashtagInput } from "@/components/editor/article-hashtag-input";
import { useWriteChrome } from "@/components/editor/write-chrome-context";
import { Button } from "@/components/ui/button";
import { useUpdateAdminArticleMutation } from "@/features/admin/api/admin-api";
import {
  useCreateArticleMutation,
  useSubmitArticleMutation,
  useUpdateArticleMutation,
  useUploadArticleImageMutation,
} from "@/features/articles/api/articles-api";
import { syncFigureLayoutInHtml } from "@/lib/articles/sync-figure-layout-html";
import { createEditorExtensions } from "@/lib/editor/extensions";
import {
  buildEditorImageHandlerProps,
  insertUploadedImages,
} from "@/lib/editor/editor-image-handlers";
import { uploadEditorImageFiles } from "@/lib/editor/editor-image-upload";
import { extractTitleFromJson } from "@/lib/editor/extract-title";
import { fetchAiSuggestion } from "@/lib/editor/fetch-ai-suggestion";
import {
  getSubmitBlockReason,
  getSubmitReadiness,
} from "@/lib/editor/submit-requirements";
import { getWritingStats } from "@/lib/editor/writing-stats";
import { toast } from "@/lib/toast";
import { useAppSelector } from "@/lib/store/hooks";
import { articleSurfaceClassName, writeSurfaceClassName } from "@/lib/layout";
import { normalizeHashtags } from "@/lib/hashtags/normalize-hashtag";
import { rememberHashtags } from "@/lib/hashtags/recent-hashtags";
import { cn } from "@/lib/utils";

const writeButtonClass =
  "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground";

interface ArticleEditorProps {
  initialHtml?: string;
  initialJson?: Record<string, unknown>;
  articleId?: string;
  reviewNote?: string;
  initialHashtags?: string[];
  mode?: "author" | "admin";
}

export function ArticleEditor({
  initialHtml = "",
  initialJson,
  articleId: initialArticleId,
  reviewNote,
  initialHashtags = [],
  mode = "author",
}: ArticleEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { chromeHidden, setChromeHidden, toggleChromeHidden, focusMode, setFocusMode } =
    useWriteChrome();
  const isAuthorWritePage = mode === "author";
  const [articleId, setArticleId] = useState<string | undefined>(initialArticleId);
  const [hashtags, setHashtags] = useState<string[]>(() =>
    normalizeHashtags(initialHashtags),
  );
  const hashtagsRef = useRef<string[]>(normalizeHashtags(initialHashtags));
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitBlockReason, setSubmitBlockReason] = useState<string | null>(
    "kamida 200 ta so'z va kamida 1 ta rasm",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);
  const articleIdRef = useRef<string | undefined>(initialArticleId);
  const editorRef = useRef<Editor | null>(null);

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [submitArticle] = useSubmitArticleMutation();
  const [updateAdminArticle] = useUpdateAdminArticleMutation();
  const [uploadArticleImage] = useUploadArticleImageMutation();
  const isAdminMode = mode === "admin";
  const { settings } = useSettings();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const aiEnabledRef = useRef(settings.aiAssistEnabled);
  const accessTokenRef = useRef(accessToken);

  const fetchSuggestion = useCallback(async (context: string) => {
    if (!aiEnabledRef.current) return "";
    return fetchAiSuggestion(context, accessTokenRef.current);
  }, []);

  useEffect(() => {
    articleIdRef.current = articleId;
  }, [articleId]);

  useEffect(() => {
    hashtagsRef.current = hashtags;
  }, [hashtags]);

  const updateSubmitReadiness = useCallback((ed: Editor) => {
    const readiness = getSubmitReadiness(ed);
    setCanSubmit(readiness.canSubmit);
    setSubmitBlockReason(getSubmitBlockReason(ed));
  }, []);

  const persist = useCallback(async (ed: Editor) => {
      const contentJson = ed.getJSON() as Record<string, unknown>;
      const contentHtml = syncFigureLayoutInHtml(ed.getHTML(), contentJson);
      const title = extractTitleFromJson(ed.getJSON());
      const { words } = getWritingStats(ed);
      const readiness = getSubmitReadiness(ed);

      if (words === 0 && !readiness.hasImage) {
        return;
      }

      try {
        if (isAdminMode) {
          const currentArticleId = articleIdRef.current;
          if (!currentArticleId) return;
          await updateAdminArticle({
            id: currentArticleId,
            body: { title, contentHtml, contentJson },
          }).unwrap();
          return;
        }

        const body = {
          title,
          contentHtml,
          contentJson,
          hashtags: hashtagsRef.current,
          status: "draft" as const,
        };
        const currentArticleId = articleIdRef.current;

        if (currentArticleId) {
          await updateArticle({ id: currentArticleId, body }).unwrap();
        } else {
          const result = await createArticle(body).unwrap();
          articleIdRef.current = result.article.id;
          setArticleId(result.article.id);
        }
      } catch {
        toast.error("Qoralama saqlanmadi");
      }
    },
    [createArticle, isAdminMode, updateAdminArticle, updateArticle],
  );

  const uploadAndInsertImages = useCallback(
    async (files: File[]) => {
      const ed = editorRef.current;
      if (!ed) return;
      const urls = await uploadEditorImageFiles(files, (formData) =>
        uploadArticleImage(formData).unwrap(),
      );
      insertUploadedImages(ed, urls);
    },
    [uploadArticleImage],
  );

  const imageHandlersRef = useRef(buildEditorImageHandlerProps(uploadAndInsertImages));
  imageHandlersRef.current = buildEditorImageHandlerProps(uploadAndInsertImages);

  const editor = useEditor({
    extensions: createEditorExtensions({
      aiAutocomplete: {
        enabled: settings.aiAssistEnabled,
        fetchSuggestion,
      },
    }),
    content: editorResetKey === 0 ? (initialJson ?? initialHtml) : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "article-editor-content min-h-[50vh] px-3 py-3 focus:outline-none sm:px-8 sm:py-5",
      },
      handlePaste: (view, event, slice) =>
        imageHandlersRef.current.handlePaste(view, event, slice),
      handleDrop: (view, event, slice, moved) =>
        imageHandlersRef.current.handleDrop(view, event, slice, moved),
    },
    onCreate: ({ editor: ed }) => {
      updateSubmitReadiness(ed);
    },
    onUpdate: ({ editor: ed }) => {
      updateSubmitReadiness(ed);
      if (submittedRef.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void persist(ed);
      }, 1500);
    },
  }, [editorResetKey]);

  useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  useEffect(() => {
    aiEnabledRef.current = settings.aiAssistEnabled;
    accessTokenRef.current = accessToken;
    if (editor) {
      const extension = editor.extensionManager.extensions.find(
        (item) => item.name === "aiAutocomplete",
      );
      if (extension) {
        extension.options.enabled = settings.aiAssistEnabled;
      }
    }
  }, [settings.aiAssistEnabled, accessToken, editor]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!editor || submittedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(editor);
    }, 800);
  }, [editor, hashtags, persist]);

  useEffect(() => {
    if (!focusMode) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focusMode]);

  useEffect(() => {
    if (!editor) return;
    const el = editor.view.dom;
    el.classList.toggle("min-h-[50vh]", !focusMode);
    el.classList.toggle("min-h-full", focusMode);
  }, [focusMode, editor]);

  const handleSubmit = async () => {
    if (!editor) return;

    const blockReason = getSubmitBlockReason(editor);
    if (blockReason) {
      toast.error(`Ko'rib chiqishga yuborish uchun ${blockReason} kerak`);
      return;
    }

    const contentJson = editor.getJSON() as Record<string, unknown>;
    const contentHtml = syncFigureLayoutInHtml(editor.getHTML(), contentJson);
    const title = extractTitleFromJson(editor.getJSON());
    const body = {
      title,
      contentHtml,
      contentJson,
      hashtags: hashtagsRef.current,
    };

    setIsSubmitting(true);
    try {
      let id = articleIdRef.current;
      if (!id) {
        const created = await createArticle({ ...body, status: "draft" }).unwrap();
        id = created.article.id;
        articleIdRef.current = id;
        setArticleId(id);
      }
      await submitArticle({ id, body }).unwrap();
      if (hashtagsRef.current.length) {
        rememberHashtags(hashtagsRef.current);
      }
      if (saveTimer.current) clearTimeout(saveTimer.current);
      submittedRef.current = true;
      setSubmitted(true);
      toast.success("Ko'rib chiqishga yuborildi");
    } catch {
      toast.error("Yuborishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewArticle = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    submittedRef.current = false;
    setSubmitted(false);
    articleIdRef.current = undefined;
    setArticleId(undefined);
    setFocusMode(false);
    setChromeHidden(false);
    setCanSubmit(false);
    setSubmitBlockReason("kamida 200 ta so'z va kamida 1 ta rasm");
    setHashtags([]);
    hashtagsRef.current = [];
    setEditorResetKey((key) => key + 1);

    if (pathname !== "/yozish") {
      router.replace("/yozish");
    }
  };

  const surfaceClassName = isAuthorWritePage
    ? writeSurfaceClassName
    : articleSurfaceClassName;

  const editorPanel = (
    <div className={cn("flex min-h-0 w-full flex-1 flex-col", surfaceClassName)}>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
        )}
      >
        <div
          className={cn(
            "sticky top-0 z-40 -mx-3 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6",
          )}
        >
          <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            {!isAdminMode && !submitted && submitBlockReason ? (
              <p className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
                Ko&apos;rib chiqishga yuborish uchun {submitBlockReason} kerak
              </p>
            ) : (
              <span className="hidden sm:block" />
            )}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAuthorWritePage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-9 shrink-0 gap-0 px-0 sm:size-auto sm:gap-1.5 sm:px-3"
                  onClick={toggleChromeHidden}
                  aria-pressed={chromeHidden}
                  aria-label="Menyu"
                  title="Menyu"
                >
                  {chromeHidden ? (
                    <PanelTopOpenIcon className="size-4" />
                  ) : (
                    <PanelTopCloseIcon className="size-4" />
                  )}
                  <span className="hidden sm:inline">Menyu</span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="size-9 shrink-0 gap-0 px-0 sm:size-auto sm:gap-1.5 sm:px-3"
                onClick={() => {
                  const next = !focusMode;
                  if (isAuthorWritePage) {
                    setChromeHidden(next);
                  }
                  setFocusMode(next);
                }}
                aria-pressed={focusMode}
                aria-label="Fokus"
                title="Fokus"
              >
                {focusMode ? (
                  <Minimize2Icon className="size-4" />
                ) : (
                  <Maximize2Icon className="size-4" />
                )}
                <span className="hidden sm:inline">Fokus</span>
              </Button>
              {isAdminMode ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="ml-auto sm:ml-0"
                  onClick={() => router.push("/admin")}
                >
                  <span className="hidden sm:inline">Admin panelga qaytish</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              ) : submitted ? (
                <Button
                  type="button"
                  size="sm"
                  className={cn(writeButtonClass, "ml-auto flex-1 sm:ml-0 sm:flex-none")}
                  onClick={handleStartNewArticle}
                >
                  <span className="hidden sm:inline">Yangi maqola yozish</span>
                  <span className="sm:hidden">Yangi maqola</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className={cn(writeButtonClass, "ml-auto min-w-0 flex-1 sm:ml-0 sm:flex-none")}
                  disabled={isSubmitting || !canSubmit}
                  title={
                    submitBlockReason
                      ? `Ko'rib chiqishga yuborish uchun ${submitBlockReason} kerak`
                      : undefined
                  }
                  onClick={() => void handleSubmit()}
                >
                  <span className="hidden sm:inline">Ko&apos;rib chiqishga yuborish</span>
                  <span className="truncate sm:hidden">Yuborish</span>
                </Button>
              )}
            </div>
          </div>

          <EditorToolbar editor={editor} />
        </div>

        {reviewNote ? (
          <div className="mx-4 mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-6">
            <span className="font-medium">Rad etish sababi: </span>
            {reviewNote}
          </div>
        ) : null}

        <div
          className={cn(
            focusMode &&
              "min-h-0 flex-1 overflow-y-auto [&_.ProseMirror]:min-h-full",
          )}
        >
          <EditorContent editor={editor} />
          <EditorBubbleMenu editor={editor} />
          <EditorTableMenu editor={editor} />
          <EditorContextMenu editor={editor} />
          {!isAdminMode ? (
            <ArticleHashtagInput
              value={hashtags}
              onChange={(next) => {
                const normalized = normalizeHashtags(next);
                hashtagsRef.current = normalized;
                setHashtags(normalized);
                if (normalized.length) {
                  rememberHashtags(normalized);
                }
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  if (focusMode) {
    return (
      <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-background">
        {editorPanel}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      {editorPanel}
    </div>
  );
}
