"use client";

import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Fragment, Slice } from "@tiptap/pm/model";
import { dropPoint } from "@tiptap/pm/transform";
import { useCallback, useRef } from "react";

type UseImageDragOptions = {
  editor: Editor;
  node: ProseMirrorNode;
  getPos: (() => number | undefined) | boolean;
};

export function useImageDrag({ editor, node, getPos }: UseImageDragOptions) {
  const draggingRef = useRef(false);

  const onDragStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (typeof getPos !== "function") return;
      const from = getPos();
      if (typeof from !== "number") return;

      const nodeSize = node.nodeSize;
      draggingRef.current = true;
      document.body.classList.add("is-image-dragging");

      const handleMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
      };

      const handleUp = (upEvent: MouseEvent) => {
        draggingRef.current = false;
        document.body.classList.remove("is-image-dragging");
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);

        const coords = editor.view.posAtCoords({
          left: upEvent.clientX,
          top: upEvent.clientY,
        });
        if (!coords) return;

        const { state } = editor;
        if (coords.pos >= from && coords.pos <= from + nodeSize) {
          return;
        }

        let tr = state.tr.delete(from, from + nodeSize);
        const slice = new Slice(Fragment.from(node), 0, 0);
        const mappedPos = tr.mapping.map(coords.pos);
        const insertPos = dropPoint(tr.doc, mappedPos, slice);

        if (insertPos == null) {
          return;
        }

        tr = tr.insert(insertPos, node);
        editor.view.dispatch(tr.scrollIntoView());
        editor.commands.focus();
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [editor, getPos, node],
  );

  return { onDragStart, isDragging: draggingRef.current };
}
