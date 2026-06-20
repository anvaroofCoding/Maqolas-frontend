"use client";

import type { Editor } from "@tiptap/react";
import { Columns2Icon, ImageIcon } from "lucide-react";
import { useRef } from "react";
import { EditorToolbarButton } from "@/components/editor/editor-toolbar-button";
import {
  EDITOR_IMAGE_ACCEPT,
  uploadEditorImageFiles,
} from "@/lib/editor/editor-image-upload";
import { useUploadArticleImageMutation } from "@/features/articles/api/articles-api";
import { toast } from "@/lib/toast";

interface EditorImageToolbarActionsProps {
  editor: Editor;
}

export function EditorImageToolbarActions({
  editor,
}: EditorImageToolbarActionsProps) {
  const singleInputRef = useRef<HTMLInputElement>(null);
  const rowInputRef = useRef<HTMLInputElement>(null);
  const [uploadImage, { isLoading }] = useUploadArticleImageMutation();

  const uploadFiles = async (files: File[]) => {
    return uploadEditorImageFiles(files, (formData) =>
      uploadImage(formData).unwrap(),
    );
  };

  const handleSingleImage = async (file: File) => {
    const urls = await uploadFiles([file]);
    if (!urls[0]) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: { src: urls[0], width: "100", align: "center" },
      })
      .run();
  };

  const handleRowImages = async (files: FileList) => {
    const fileArray = Array.from(files).slice(0, 4);
    if (fileArray.length < 2) {
      toast.error("Kamida 2 ta rasm tanlang");
      return;
    }

    const urls = await uploadFiles(fileArray);
    if (urls.length < 2) return;

    editor.chain().focus().insertImageRow(urls).run();
  };

  return (
    <>
      <input
        id="editor-single-image-input"
        ref={singleInputRef}
        type="file"
        accept={EDITOR_IMAGE_ACCEPT}
        className="sr-only"
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleSingleImage(file);
          event.target.value = "";
        }}
      />
      <input
        id="editor-row-image-input"
        ref={rowInputRef}
        type="file"
        accept={EDITOR_IMAGE_ACCEPT}
        multiple
        className="sr-only"
        aria-hidden
        onChange={(event) => {
          const files = event.target.files;
          if (files?.length) void handleRowImages(files);
          event.target.value = "";
        }}
      />

      <EditorToolbarButton
        label="Rasm yuklash"
        onClick={() => singleInputRef.current?.click()}
        disabled={isLoading}
      >
        <ImageIcon />
      </EditorToolbarButton>
      <EditorToolbarButton
        label="Yonma-yon rasmlar (2–4 ta)"
        onClick={() => rowInputRef.current?.click()}
        disabled={isLoading}
      >
        <Columns2Icon />
      </EditorToolbarButton>
    </>
  );
}
