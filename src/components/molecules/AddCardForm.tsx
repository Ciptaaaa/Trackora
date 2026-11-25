import { useEffect, useRef, useState } from 'react';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { useT } from '../../i18n/LocaleContext';
import { toApiDate } from '../../lib/date';

export interface NewCardDraft {
  title: string;
  description: string;
  due_date: string | null;
}

interface AddCardFormProps {
  onSubmit: (draft: NewCardDraft) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCardForm({
  onSubmit,
  open,
  onOpenChange,
}: AddCardFormProps) {
  const t = useT();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (expanded) descriptionRef.current?.focus();
  }, [expanded]);

  function reset() {
    setTitle('');
    setDescription('');
    setDueDate('');
  }

  function close() {
    reset();
    setExpanded(false);
    onOpenChange(false);
  }

  function commit() {
    const trimmed = title.trim();
    if (trimmed.length === 0) {
      close();
      return;
    }
    onSubmit({
      title: trimmed,
      description: description.trim(),
      due_date: toApiDate(dueDate),
    });
    reset();
    titleRef.current?.focus();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex min-h-9 w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-ink-600 transition-colors hover:bg-paper-300/60 hover:text-ink-900"
      >
        <Icon name="plus" className="size-4 text-ink-600" />
        {t('column.addCard')}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-paper-300/80 bg-paper-50 p-3 trello-card">
      <textarea
        ref={titleRef}
        rows={2}
        value={title}
        placeholder={t('column.cardTitle')}
        aria-label={t('column.newCardTitle')}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            commit();
          }
          if (event.key === 'Escape') close();
        }}
        className="w-full resize-none bg-transparent text-base sm:text-[13.5px] leading-snug text-ink-900 placeholder:text-ink-400 focus:outline-none"
      />

      {expanded ? (
        <div className="mt-2 space-y-2.5 border-t border-paper-200 pt-2.5">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-ink-600">
              {t('column.cardDescription')}
            </span>
            <textarea
              ref={descriptionRef}
              rows={2}
              value={description}
              placeholder={t('column.cardDescriptionHint')}
              onChange={(event) => setDescription(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') close();
              }}
              className="w-full resize-none rounded-md border border-paper-300 bg-paper-100 px-2.5 py-2 text-base sm:text-[13px] leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-petrol-500 focus:bg-paper-50 focus:outline-none dark:border-paper-400"
            />
          </label>

          <div>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-ink-600">
                <Icon name="calendar" className="size-3.5 text-ink-400" />
                {t('column.cardDue')}
                <span className="font-normal text-ink-400">{t('column.optional')}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commit();
                    }
                    if (event.key === 'Escape') close();
                  }}
                  className="min-w-0 flex-1 rounded-md border border-paper-300 bg-paper-100 px-2.5 py-2 sm:py-1.5 text-base sm:text-[12px] text-ink-900 focus:border-petrol-500 focus:bg-paper-50 focus:outline-none dark:border-paper-400"
                />
                {dueDate !== '' && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    aria-label={t('column.clearDue')}
                    className="flex size-8 shrink-0 items-center justify-center rounded p-1 text-ink-400 transition-colors hover:text-berry-500"
                  >
                    <Icon name="close" className="size-3.5" />
                  </button>
                )}
              </span>
            </label>

            <p className="mt-1 text-[11px] leading-relaxed text-ink-400">
              {t('column.cardDueHint')}
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 flex w-full items-center gap-1.5 border-t border-paper-200 pt-2 text-[11px] font-semibold text-ink-600 transition-colors hover:text-petrol-600"
        >
          <Icon name="plus" className="size-3" />
          {t('column.addDetails')}
        </button>
      )}

      <div className="mt-2.5 flex items-center gap-2">
        <Button size="sm" onClick={commit}>
          {t('column.save')}
        </Button>
        <button
          type="button"
          onClick={close}
          aria-label={t('column.cancel')}
          className="flex size-8 items-center justify-center rounded-md p-1.5 text-ink-400 transition-colors hover:bg-paper-200 hover:text-ink-900"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
    </div>
  );
}
