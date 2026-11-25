import Icon, { type IconName } from '../atoms/Icon';
import Avatar from '../atoms/Avatar';
import AccountMenu from './AccountMenu';
import { useT } from '../../i18n/LocaleContext';
import type { BoardView } from '../../lib/view';
import type { ThemePreference } from '../../lib/theme';
import type { TranslationKey } from '../../i18n';
import type { User } from '../../types/domain';

interface MobileIslandProps {
  view: BoardView;
  dueCount: number;
  overdueCount: number;
  user: User;
  theme: ThemePreference;
  onViewChange: (view: BoardView) => void;
  onThemeChange: (preference: ThemePreference) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const SEGMENTS: ReadonlyArray<{
  view: BoardView;
  icon: IconName;
  labelKey: TranslationKey;
}> = [
  { view: 'all', icon: 'board', labelKey: 'nav.board' },
  { view: 'due', icon: 'calendar', labelKey: 'nav.due' },
  { view: 'overdue', icon: 'alert', labelKey: 'nav.overdue' },
];
export default function MobileIsland({
  view,
  dueCount,
  overdueCount,
  user,
  theme,
  onViewChange,
  onThemeChange,
  onOpenSettings,
  onLogout,
}: MobileIslandProps) {
  const t = useT();

  function countFor(segment: BoardView): number {
    if (segment === 'due') return dueCount;
    if (segment === 'overdue') return overdueCount;
    return 0;
  }

  return (
    <nav
      aria-label={t('island.label')}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-paper-300 bg-paper-50/95 p-1 shadow-xl shadow-black/10 backdrop-blur-md dark:border-paper-400">
        {SEGMENTS.map((segment) => {
          const active = segment.view === view;
          const count = countFor(segment.view);
          return (
            <button
              key={segment.view}
              type="button"
              onClick={() => onViewChange(segment.view)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex h-10 sm:h-11 items-center gap-1.5 rounded-full px-3 sm:px-3.5 transition-colors ${
                active
                  ? 'bg-petrol-600 text-white shadow-xs'
                  : 'text-ink-600 hover:bg-paper-100 hover:text-ink-900'
              }`}
            >
              <Icon name={segment.icon} className="size-4 shrink-0" />
              {active && (
                <span className="text-xs font-semibold whitespace-nowrap">
                  {t(segment.labelKey)}
                </span>
              )}
              {!active && (
                <>
                  {count > 0 && (
                    <span className="absolute top-1 right-1.5 flex size-4 items-center justify-center rounded-full bg-berry-500 text-[10px] font-semibold text-white tabular-nums">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                  <span className="sr-only">{t(segment.labelKey)}</span>
                </>
              )}
            </button>
          );
        })}

        <span className="mx-0.5 h-5 w-px bg-paper-300" aria-hidden="true" />

        <AccountMenu
          user={user}
          theme={theme}
          placement="up"
          align="end"
          triggerClassName="flex min-h-10 min-w-10 sm:min-h-11 sm:min-w-11 items-center justify-center rounded-full p-1 hover:bg-paper-100"
          onThemeChange={onThemeChange}
          onOpenSettings={onOpenSettings}
          onLogout={onLogout}
        >
          <Avatar user={user} size="sm" />
        </AccountMenu>
      </div>
    </nav>
  );
}
