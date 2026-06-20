"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import {
  IMAGE_ALIGN_OPTIONS,
  IMAGE_WIDTH_PRESETS,
  type ImageAlign,
} from "@/lib/editor/image-constants";
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
  const { node, updateAttributes, selected } = props;
  const inRow = isInsideImageRow(props);
  const width = String(node.attrs.width ?? "100");
  const align = (node.attrs.align as ImageAlign) ?? "center";

  return (
    <NodeViewWrapper
      as="div"
      className={cn(
        "article-image-node",
        !inRow && `article-image-node--${align}`,
        selected && "is-selected",
      )}
      data-drag-handle=""
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        className="article-image"
        style={{ width: inRow ? "100%" : `${width}%` }}
        draggable={false}
      />

      {selected ? (
        <div
          className="article-image-toolbar"
          contentEditable={false}
          onMouseDown={(event) => event.preventDefault()}
        >
          {!inRow ? (
            <>
              <div className="article-image-toolbar__group">
                {IMAGE_WIDTH_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={cn(
                      "article-image-toolbar__btn",
                      width === preset.value && "is-active",
                    )}
                    onClick={() =>
                      updateAttributes({ width: preset.value })
                    }
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
                      onClick={() =>
                        updateAttributes({ align: option.value })
                      }
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
                  min={20}
                  max={100}
                  step={5}
                  value={Number(width)}
                  onChange={(event) =>
                    updateAttributes({ width: event.target.value })
                  }
                />
              </label>
            </>
          ) : (
            <span className="article-image-toolbar__hint">
              Yonma-yon qator ichidagi rasm
            </span>
          )}
        </div>
      ) : null}
    </NodeViewWrapper>
  );
}
