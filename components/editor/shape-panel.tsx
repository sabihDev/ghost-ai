"use client";

import { useCallback } from "react";
import { NODE_SHAPES, SHAPE_DEFAULTS, type NodeShape } from "@/types/canvas";

function ShapeIcon({ shape }: { shape: NodeShape }) {
  switch (shape) {
    case "rectangle":
      return <rect x="3" y="5" width="18" height="14" rx="1.5" />;
    case "diamond":
      return <polygon points="12,2.5 21.5,12 12,21.5 2.5,12" />;
    case "circle":
      return <circle cx="12" cy="12" r="8.5" />;
    case "pill":
      return <rect x="3" y="7" width="18" height="10" rx="5" />;
    case "cylinder":
      return (
        <g>
          <ellipse cx="12" cy="5.5" rx="8" ry="3" />
          <line x1="4" y1="5.5" x2="4" y2="18.5" />
          <line x1="20" y1="5.5" x2="20" y2="18.5" />
          <ellipse cx="12" cy="18.5" rx="8" ry="3" />
        </g>
      );
    case "hexagon":
      return (
        <polygon points="12,2.5 21.5,7 21.5,17 12,21.5 2.5,17 2.5,7" />
      );
  }
}

const SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: "Rect",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
};

export function ShapePanel() {
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, shape: NodeShape) => {
      const { width, height } = SHAPE_DEFAULTS[shape];
      e.dataTransfer.setData(
        "application/x-canvas-shape",
        JSON.stringify({ shape, width, height })
      );
      e.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  return (
    <div className="fixed bottom-10 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-stretch gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-xl">
        {NODE_SHAPES.map((shape, i) => (
          <button
            key={shape}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            aria-label={`Drag ${shape} shape`}
            title={shape}
            className={`flex flex-col items-center gap-0.5 px-5 py-3 transition-colors hover:bg-base/60 active:bg-base ${
              i < NODE_SHAPES.length - 1
                ? "border-r border-surface-border/50"
                : ""
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current stroke-[1.5] text-copy-primary"
              aria-hidden="true"
            >
              <ShapeIcon shape={shape} />
            </svg>
            <span className="text-[10px] font-medium leading-none text-copy-muted">
              {SHAPE_LABELS[shape]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
