import type { ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
}

export default function DetailSection({
  title,
  action,
  children,
  icon,
}: DetailSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex min-h-6 items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {icon}
          <h3 className="text-xs font-semibold tracking-wider text-ink-600 uppercase">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
