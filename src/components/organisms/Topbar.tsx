import { useState } from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import IconButton from '../atoms/IconButton';
import AccountMenu from './AccountMenu';
import BoardSwitcher from '../molecules/BoardSwitcher';
import SearchField from '../molecules/SearchField';
import ThemeToggle from '../molecules/ThemeToggle';
import LocaleSwitcher from '../molecules/LocaleSwitcher';
import { useT } from '../../i18n/LocaleContext';
import type { ThemePreference } from '../../lib/theme';
import type { Board, User } from '../../types/domain';

interface TopbarProps {
  boards: Board[];
  activeBoardId: string;
  user: User;
  query: string;
  cardCount: number;
  theme: ThemePreference;
  onSelectBoard: (publicId: string) => void;
  onQueryChange: (value: string) => void;
  onOpenMenu: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onThemeChange: (preference: ThemePreference) => void;
  onNewBoard: () => void;
  onEditBoard: (() => void) | null;
  onManageLabels: () => void;
}

export default function Topbar({
  boards,
  activeBoardId,
  user,
  query,
  cardCount,
  theme,
  onSelectBoard,
  onQueryChange,
  onOpenMenu,
  onOpenSettings,
  onLogout,
  onThemeChange,
  onNewBoard,
  onEditBoard,
  onManageLabels,
}: TopbarProps) {
  const t = useT();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  if (mobileSearchOpen) {
    return (
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-paper-300 bg-paper-50 px-3 shadow-xs sm:hidden">
        <Icon name="search" className="size-4 shrink-0 text-ink-400" />
        <input
          type="search"
          autoFocus
          value={query}
          placeholder={t('board.searchCards')}
          aria-label={t('board.searchCards')}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onQueryChange('');
              setMobileSearchOpen(false);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label={t('common.cancel')}
            className="flex size-8 items-center justify-center rounded-md text-ink-400 hover:text-ink-800"
          >
            <Icon name="close" className="size-4" />
          </button>
        )}
        <IconButton
          icon="close"
          label={t('common.cancel')}
          onClick={() => {
            onQueryChange('');
            setMobileSearchOpen(false);
          }}
        />
      </header>
    );
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-1.5 border-b border-paper-300 bg-paper-50 px-2 shadow-xs sm:gap-3 sm:px-4">
      <IconButton
        icon="grip"
        label={t('nav.openMenu')}
        onClick={onOpenMenu}
        className="md:hidden"
      />

      <BoardSwitcher
        boards={boards}
        activeId={activeBoardId}
        onSelect={onSelectBoard}
        onNewBoard={onNewBoard}
      />

      {onEditBoard !== null && (
        <IconButton
          icon="pencil"
          label={t('board.edit')}
          onClick={onEditBoard}
          className="hidden sm:inline-flex"
        />
      )}

      <span className="hidden items-center rounded-full bg-paper-200/90 px-2.5 py-0.5 text-[11px] font-semibold text-ink-600 tabular-nums xl:inline-flex">
        {t('board.cardCount', { count: cardCount })}
      </span>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <div className="hidden w-56 sm:block lg:w-64">
          <SearchField value={query} onChange={onQueryChange} />
        </div>

        <IconButton
          icon="search"
          label={t('board.searchCards')}
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden"
        />

        <span className="hidden lg:block">
          <ThemeToggle preference={theme} onChange={onThemeChange} />
        </span>

        <span className="hidden sm:block">
          <LocaleSwitcher />
        </span>

        <IconButton
          icon="tag"
          label={t('label.manage')}
          onClick={onManageLabels}
        />

        <Button size="sm" onClick={onNewBoard} className="max-xl:hidden xl:inline-flex">
          <Icon name="plus" className="size-3.5" />
          {t('board.new')}
        </Button>

        <IconButton
          icon="plus"
          label={t('board.new')}
          onClick={onNewBoard}
          className="xl:hidden"
        />

        <span className="hidden md:block">
          <AccountMenu
            user={user}
            theme={theme}
            placement="down"
            align="end"
            onThemeChange={onThemeChange}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
          />
        </span>
      </div>
    </header>
  );
}
