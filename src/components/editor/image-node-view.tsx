"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  GripVerticalIcon,
} from "lucide-react";
import {
  IMAGE_ALIGN_OPTIONS,
  IMAGE_WIDTH_PRESETS,
  type ImageAlign,
} from "@/lib/editor/image-constants";
import {
  figureAlignClass,
  figureWidthStyle,
} from "@/lib/editor/image-figure-utils";
import { useImageDrag } from "@/components/editor/use-image-drag";
import { useImageResize } from "@/components/editor/use-image-resize";
import { cn } from "@/lib/utils";

function isInsideImageRow(props: NodeViewProps): boolean {
  const getPos = props.getPos;
  if (typeof getPos !== "function") return Boolean(props.node.attrs.inRow);

  const pos = getPos();
  if (typeof pos !== "number") return Boolean(props.node.attrs.inRow);

  const $pos = props.editor.state.doc.resolve(pos);
  return $pos.parent.type.name === "imageRow";
}

export function ImageNodeView(props: NodeViewProps) {
  const { node, updateAttributes, selected, editor, getPos } = props;
  const inRow = isInsideImageRow(props);
  const width = String(node.attrs.width ?? "50");
  const align = (node.attrs.align as ImageAlign) ?? "right";

  const { setFigureRef, onResizeStart } = useImageResize({
    onWidthChange: (nextWidth) => updateAttributes({ width: nextWidth }),
  });

  const { onDragStart } = useImageDrag({
    editor,
    node,
    getPos,
  });

  return (
    <NodeViewWrapper
      as="figure"
      ref={setFigureRef}
      className={cn(
        figureAlignClass(align, inRow),
        selected && "is-selected",
      )}
      style={figureWidthStyle(width, align, inRow)}
      contentEditable={false}
    >
      {!inRow ? (
        <button
          type="button"
          className="article-figure__drag-handle"
          contentEditable={false}
          onMouseDown={onDragStart}
        >
          <GripVerticalIcon className="size-3.5" />
          <span>Sudrab ko&apos;chiring</span>
        </button>
      ) : null}

      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        className="article-image"
        draggable={false}
      />

      {selected && !inRow ? (
        <>
          <button
            type="button"
            className="article-figure__resize-handle"
            aria-label="Rasm o'lchamini o'zgartirish"
            contentEditable={false}
            onMouseDown={onResizeStart}
          />

          <div
            className="article-image-toolbar"
            contentEditable={false}
            onMouseDown={(event) => event.preventDefault()}
          >
            <div className="article-image-toolbar__group">
              {IMAGE_WIDTH_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={cn(
                    "article-image-toolbar__btn",
                    width === preset.value && "is-active",
                  )}
                  onClick={() => updateAttributes({ width: preset.value })}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="article-image-toolbar__group">
              {IMAGE_ALIGN_OPTIONS.map((option) => {
                const Icon =
                  option.value === "left"
                    ? AlignLeftIcon
                    : option.value === "right"
                      ? AlignRightIcon
                      : AlignCenterIcon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    title={option.label}
                    className={cn(
                      "article-image-toolbar__btn article-image-toolbar__btn--icon",
                      align === option.value && "is-active",
                    )}
                    onClick={() => updateAttributes({ align: option.value })}
                  >
                    <Icon className="size-3.5" />
                  </button>
                );
              })}
            </div>

            <label className="article-image-toolbar__slider">
              <span>{width}%</span>
              <input
                type="range"
                min={15}
                max={100}
                step={5}
                value={Number(width)}
                onChange={(event) =>
                  updateAttributes({ width: event.target.value })
                }
              />
            </label>
            <span className="article-image-toolbar__hint w-full">
              Pastga torting — kattaroq, tepaga — kichikroq
            </span>
          </div>
        </>
      ) : null}
    </NodeViewWrapper>
  );
}
