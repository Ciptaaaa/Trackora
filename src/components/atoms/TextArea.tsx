import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hideLabel?: boolean;
}

export default function TextArea({
  label,
  hideLabel = false,
  className = '',
  id,
  rows = 3,
  ...rest
}: TextAreaProps) {
  const fieldId = id ?? `area-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className={
          hideLabel ? 'sr-only' : 'mb-1.5 block text-xs font-semibold text-ink-700'
        }
      >
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-paper-300 bg-paper-50 px-3 py-2 text-base sm:text-sm leading-relaxed text-ink-900 shadow-2xs transition-all placeholder:text-ink-400 hover:border-paper-400 focus:border-petrol-500 focus:ring-2 focus:ring-petrol-500/20 focus:outline-none dark:border-paper-400 ${className}`}
        {...rest}
      />
    </div>
  );
}
