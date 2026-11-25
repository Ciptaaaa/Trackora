import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  readonly?: boolean;
}

export default function TextField({
  label,
  readonly,
  hideLabel = false,
  className = '',
  id,
  ...rest
}: TextFieldProps) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

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
      <input
        id={fieldId}
        readOnly={readonly}
        className={`w-full rounded-lg border px-3 py-2 text-base sm:text-sm transition-all placeholder:text-ink-400 focus:outline-none ${
          readonly
            ? 'cursor-not-allowed border-paper-300 bg-paper-100 text-ink-400 select-text'
            : 'border-paper-300 bg-paper-50 text-ink-900 shadow-2xs hover:border-paper-400 focus:border-petrol-500 focus:ring-2 focus:ring-petrol-500/20 dark:border-paper-400'
        } ${className}`}
        {...rest}
      />
    </div>
  );
}
