type MetricCardProps = {
  value: string;
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: { padding: "px-3 py-2", value: "text-lg", label: "text-[9px]" },
  md: { padding: "px-4 py-3", value: "text-2xl", label: "text-[10px]" },
  lg: { padding: "px-6 py-4", value: "text-4xl", label: "text-xs" },
};

export function MetricCard({ value, label, className = "", size = "md" }: MetricCardProps) {
  const s = SIZES[size];

  return (
    <div className={`led-border rounded-xl bg-background/80 ${s.padding} text-center backdrop-blur-sm ${className}`}>
      <p className={`${s.value} font-bold`}>{value}</p>
      <p className={`mt-1 ${s.label} text-foreground/50`}>{label}</p>
    </div>
  );
}