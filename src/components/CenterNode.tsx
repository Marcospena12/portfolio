import { Handle, Position } from "@xyflow/react";
import { LuizaAvatar } from "@/components/LuizaAvatar";

export function CenterNode() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-foreground/15 bg-background px-6 py-4">
      <LuizaAvatar />
      <span className="text-sm font-semibold">Luiza</span>
      <span className="text-xs text-foreground/50">Orquestrador</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}