"use client";

import { Handle, Position } from "@xyflow/react";
import type { CanvasNodeData } from "@/types/canvas";

interface CanvasNodeComponentProps {
	data: CanvasNodeData;
	selected: boolean;
}

export function CanvasNodeComponent({
	data,
	selected,
}: CanvasNodeComponentProps) {
	return (
		<div
			className={`group rounded-xl border-2 bg-surface px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${selected
				? "border-brand shadow-brand/10"
				: "border-surface-border"
				}`}
		>
			<p className="text-sm text-copy-primary">
				{data.label || "New Node"}
			</p>
			<Handle
				type="target"
				position={Position.Top}
				className="!h-1.5 !w-1.5 !border-2 !border-white/50 !bg-white/90"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="!h-1.5 !w-1.5 !border-2 !border-white/50 !bg-white/90"
			/>
		</div>
	);
}
