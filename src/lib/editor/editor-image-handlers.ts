import type { EditorView } from "@tiptap/pm/view";
import type { Slice } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";

export function buildEditorImageHandlerProps(
  uploadAndInsert: (files: File[]) => Promise<void>,
) {
  return {
    handlePaste: (
      _view: EditorView,
      event: ClipboardEvent,
      _slice: Slice,
    ) => {
      const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length === 0) return false;

      event.preventDefault();
      void uploadAndInsert(files);
      return true;
    },
    handleDrop: (
      view: EditorView,
      event: DragEvent,
      _slice: Slice,
      _moved: boolean,
    ) => {
      const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length === 0) return false;

      event.preventDefault();

      const coords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });

      if (coords) {
        const tr = view.state.tr.setSelection(
          TextSelection.create(view.state.doc, coords.pos),
        );
        view.dispatch(tr);
      }

      void uploadAndInsert(files);
      return true;
    },
  };
}

export async function insertUploadedImages(
  editor: import("@tiptap/core").Editor | null,
  urls: string[],
) {
  if (!editor || urls.length === 0) return;

  if (urls.length === 1) {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: { src: urls[0], width: "50", align: "right" },
      })
      .run();
    return;
  }

  if (urls.length >= 2) {
    editor.chain().focus().insertImageRow(urls.slice(0, 4)).run();
  }
}
