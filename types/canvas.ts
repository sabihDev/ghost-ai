import type { Node, Edge } from "@xyflow/react";

export type NodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export interface CanvasNodeData {
  label: string;
  color: string;
  shape: NodeShape;
  [key: string]: unknown;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">;

export const NODE_COLORS = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
] as const;

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export const DEFAULT_NODE_COLOR = "#1F1F1F";
export const DEFAULT_NODE_TEXT_COLOR = "#EDEDED";

export interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

export const SHAPE_DEFAULTS: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 180, height: 120 },
  diamond: { width: 160, height: 160 },
  circle: { width: 120, height: 120 },
  pill: { width: 160, height: 96 },
  cylinder: { width: 140, height: 160 },
  hexagon: { width: 160, height: 140 },
};
