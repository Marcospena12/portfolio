import { Handle, Position } from "@xyflow/react";

type CategoryNodeData = {
  label: string;
  color: string;
};

export function CategoryNode({ data }: { data: CategoryNodeData }) {
  return (
    <div
      style={{ borderLeftColor: data.color }}
      className="rounded-lg border border-foreground/15 border-l-[3px] bg-background px-4 py-3"
    >
      <Handle type="target" position={Position.Top} />
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  );
}