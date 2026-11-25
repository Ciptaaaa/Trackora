import Icon from '../atoms/Icon';
import { useLocale } from '../../i18n/LocaleContext';
import { dueStateOf, formatDueLabel } from '../../lib/date';
import type { DueState } from '../../types/domain';

interface DueBadgeProps {
  dueDate: string | null;
}

const TONES: Record<Exclude<DueState, 'none'>, string> = {
  overdue: 'bg-berry-100 text-berry-700 border-berry-500/20',
  today: 'bg-saffron-100 text-saffron-600 border-saffron-500/20',
  soon: 'bg-saffron-100 text-saffron-600 border-saffron-500/20',
  upcoming: 'bg-paper-200/90 text-ink-600 border-paper-300',
};

export default function DueBadge({ dueDate }: DueBadgeProps) {
  const { locale, t } = useLocale();
  const state = dueStateOf(dueDate);
  if (state === 'none') return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-tight tabular-nums border ${TONES[state]}`}
    >
      <Icon
        name={state === 'overdue' ? 'alert' : 'calendar'}
        className="size-3 shrink-0"
      />
      {formatDueLabel(dueDate, locale, t)}
    </span>
  );
}
