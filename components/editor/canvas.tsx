"use client";

import { Component, useCallback, useRef, type ReactNode } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  ConnectionMode,
  MarkerType,
  type NodeAddChange,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { ShapePanel } from "@/components/editor/shape-panel";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";

import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";

import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import {
  DEFAULT_NODE_COLOR,
  type ShapeDragPayload,
} from "@/types/canvas";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: ReactNode;
    fallback: ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const nodeTypes = { canvasNode: CanvasNodeComponent };

function CanvasFlow() {
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>();
  const nodeCounter = useRef(0);

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true });

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/x-canvas-shape");
      if (!raw) return;

      const payload = JSON.parse(raw) as ShapeDragPayload;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const counter = nodeCounter.current++;
      const id = `${payload.shape}-${Date.now()}-${counter}`;

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape: payload.shape,
        },
      };

      const addChange: NodeAddChange<CanvasNode> = {
        type: "add",
        item: newNode,
      };

      onNodesChange([addChange]);
    },
    [reactFlowInstance, onNodesChange]
  );

  return (
    <div onDragOver={onDragOver} onDrop={onDrop} className="relative h-full w-full">
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        fitView
        connectionMode={ConnectionMode.Loose}
        selectionOnDrag
        panOnDrag={[1, 2]}
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#f8fafc", strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#f8fafc", width: 12, height: 12 },
        }}
        nodeTypes={nodeTypes}
        className="bg-base"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2a2a30"
          gap={48}
          size={1}
        />
        <MiniMap
          style={{ background: "#111114", color: "#f0f0f4" }}
          nodeColor="#2a2a30"
          maskColor="rgba(0,0,0,0.6)"
          className="rounded-xl border border-surface-border"
        />
        <Controls
          position="bottom-right"
          className="rounded-xl border border-surface-border bg-surface"
          showInteractive={false}
        />
        <Cursors />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}

function CanvasInner() {
  return (
    <ReactFlowProvider>
      <CanvasFlow />
    </ReactFlowProvider>
  );
}

function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-surface-border" />
        <p className="mt-3 text-sm text-copy-muted">Loading canvas…</p>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div>
        <p className="text-sm text-state-error">
          Failed to connect to canvas.
        </p>
        <p className="mt-1 text-xs text-copy-muted">
          Please check your connection and try again.
        </p>
      </div>
    </div>
  );
}

interface CanvasProps {
  roomId: string;
}

export function Canvas({ roomId }: CanvasProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <CanvasBoundary fallback={<ErrorFallback />}>
          <ClientSideSuspense fallback={<Loading />}>
            <CanvasInner />
          </ClientSideSuspense>
        </CanvasBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
