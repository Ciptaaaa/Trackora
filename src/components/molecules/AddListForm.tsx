import { useEffect, useRef, useState } from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { useT } from '../../i18n/LocaleContext';

interface AddListFormProps {
  onSubmit: (title: string) => void;
}

export default function AddListForm({ onSubmit }: AddListFormProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function commit() {
    const trimmed = title.trim();
    if (trimmed === '') {
      setOpen(false);
      return;
    }
    onSubmit(trimmed);
    setTitle('');
    inputRef.current?.focus();
  }

  function cancel() {
    setTitle('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-paper-300/80 bg-paper-200/80 px-4 text-xs font-semibold text-ink-700 shadow-xs transition-all hover:bg-paper-200 hover:text-ink-900 dark:border-paper-400/20"
      >
        <Icon name="plus" className="size-4 text-ink-600" />
        {t('list.add')}
      </button>
    );
  }

  return (
    <div className="flex h-fit flex-col rounded-xl border border-paper-300/80 bg-paper-200 p-2.5 shadow-sm dark:border-paper-400/20">
      <input
        ref={inputRef}
        value={title}
        placeholder={t('list.titlePlaceholder')}
        aria-label={t('list.title')}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }
          if (event.key === 'Escape') cancel();
        }}
        className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2 text-base sm:text-sm text-ink-900 placeholder:text-ink-400 focus:border-petrol-500 focus:ring-1 focus:ring-petrol-500 focus:outline-none dark:border-paper-400"
      />
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" onClick={commit}>
          {t('common.add')}
        </Button>
        <button
          type="button"
          onClick={cancel}
          aria-label={t('common.cancel')}
          className="flex size-8 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-paper-300/60 hover:text-ink-900"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
    </div>
  );
}
