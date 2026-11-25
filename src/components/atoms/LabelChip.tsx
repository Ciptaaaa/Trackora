import type { Label } from '../../types/domain';

interface LabelChipProps {
  label: Label;
  compact?: boolean;
}

export default function LabelChip({ label, compact = false }: LabelChipProps) {
  if (compact) {
    return (
      <span
        className="block h-2 min-w-8 max-w-12 rounded-sm shadow-xs transition-opacity hover:opacity-85"
        style={{ backgroundColor: label.color }}
        title={label.name}
      >
        <span className="sr-only">{label.name}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-tight shadow-xs transition-colors"
      style={{
        backgroundColor: `${label.color}22`,
        color: label.color,
        border: `1px solid ${label.color}44`,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: label.color }}
        aria-hidden="true"
      />
      {label.name}
    </span>
  );
}
