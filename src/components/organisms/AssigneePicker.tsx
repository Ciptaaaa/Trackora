import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import Modal from '../molecules/Modal';
import Icon from '../atoms/Icon';
import Avatar from '../atoms/Avatar';
import Spinner from '../atoms/Spinner';
import { useT } from '../../i18n/LocaleContext';
import { getUsers, assignUser, unassignUser } from '../../lib/api';
import { describeError } from '../../lib/errors';
import type { User } from '../../types/domain';

interface AssigneePickerProps {
  open: boolean;
  cardPublicId: string;
  selected: User[];
  onClose: () => void;
  onChange: Dispatch<SetStateAction<User[]>>;
}

export default function AssigneePicker({
  open,
  cardPublicId,
  selected,
  onClose,
  onChange,
}: AssigneePickerProps) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    let live = true;
    setLoading(true);
    const timer = window.setTimeout(
      () => {
        getUsers(query.trim())
          .then((users) => {
            if (live) setResults(users);
          })
          .catch((caught: unknown) => {
            if (live) setError(describeError(caught, t));
          })
          .finally(() => {
            if (live) setLoading(false);
          });
      },
      query === '' ? 0 : 300,
    );

    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [open, query, t]);

  async function toggle(user: User) {
    const isOn = selected.some((item) => item.public_id === user.public_id);
    setPendingId(user.public_id);
    setError(null);

    try {
      if (isOn) {
        await unassignUser(cardPublicId, user.public_id);
        onChange((current) =>
          current.filter((item) => item.public_id !== user.public_id),
        );
      } else {
        await assignUser(cardPublicId, user.public_id);
        onChange((current) =>
          current.some((item) => item.public_id === user.public_id)
            ? current
            : [...current, user],
        );
      }
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Modal open={open} title={t('detail.addAssignee')} size="sm" onClose={onClose}>
      <input
        type="search"
        value={query}
        placeholder={t('board.searchUser')}
        aria-label={t('board.searchUser')}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="mb-3 w-full rounded-lg border border-paper-300 bg-paper-50 px-3.5 py-2 text-base sm:text-sm text-ink-900 shadow-2xs transition placeholder:text-ink-400 hover:border-paper-400 focus:border-petrol-500 focus:ring-2 focus:ring-petrol-500/20 focus:outline-none dark:border-paper-400"
      />

      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner label={t('app.loading')} size="sm" />
        </div>
      ) : results.length === 0 ? (
        <p className="rounded-lg border border-dashed border-paper-400/60 px-3 py-5 text-center text-xs leading-relaxed text-ink-400">
          {t('board.noUsers')}
        </p>
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto scrollbar-slim">
          {results.map((user) => {
            const isOn = selected.some(
              (item) => item.public_id === user.public_id,
            );
            return (
              <li key={user.public_id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isOn}
                  disabled={pendingId !== null}
                  onClick={() => void toggle(user)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all disabled:opacity-50 ${
                    isOn
                      ? 'border border-petrol-300 bg-petrol-50/80 shadow-2xs'
                      : 'border border-transparent hover:border-paper-300 hover:bg-paper-100/70'
                  }`}
                >
                  <Avatar user={user} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-ink-900">
                      {user.name}
                    </span>
                    <span className="block truncate text-[11px] text-ink-400">
                      {user.email}
                    </span>
                  </span>
                  {isOn && (
                    <Icon name="check" className="size-4 shrink-0 text-petrol-600" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error !== null && (
        <p role="alert" className="mt-3 text-xs leading-relaxed text-berry-500">
          {error}
        </p>
      )}
    </Modal>
  );
}
