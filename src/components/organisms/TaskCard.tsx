import type { DragEvent } from 'react';
import Icon from '../atoms/Icon';
import LabelChip from '../atoms/LabelChip';
import AvatarGroup from '../molecules/AvatarGroup';
import DueBadge from '../molecules/DueBadge';
import { useT } from '../../i18n/LocaleContext';
import type { Card } from '../../types/domain';

export type Highlight = 'none' | 'match' | 'muted';

interface TaskCardProps {
  card: Card;
  dragging: boolean;
  done: boolean;
  highlight: Highlight;
  onOpen: (publicId: string) => void;
  onDragStart: (event: DragEvent<HTMLElement>, publicId: string) => void;
  onDragEnd: () => void;
}

const HIGHLIGHT: Record<Highlight, string> = {
  none: 'border-paper-300/80 hover:border-paper-400/90 dark:border-paper-400/40',
  match: 'ring-2 ring-petrol-600 border-transparent shadow-md shadow-petrol-600/15',
  muted: 'opacity-40 border-paper-300/60 hover:opacity-100',
};

export default function TaskCard({
  card,
  dragging,
  done,
  highlight,
  onOpen,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const t = useT();

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, card.public_id)}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab overflow-hidden rounded-lg border bg-paper-50 trello-card transition-all duration-150 active:cursor-grabbing ${
        HIGHLIGHT[highlight]
      } ${dragging ? 'rotate-1 scale-[1.01] opacity-60 shadow-lg' : ''} ${
        done ? 'opacity-70 bg-paper-100/50' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(card.public_id)}
        className="w-full p-2.5 sm:p-3 text-left focus:outline-none"
      >
        {card.labels.length > 0 && (
          <span className="mb-2 flex flex-wrap gap-1">
            {card.labels.map((label) => (
              <LabelChip key={label.public_id} label={label} compact />
            ))}
          </span>
        )}

        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-[13.5px] leading-snug font-medium wrap-break-words ${
              done
                ? 'text-ink-400 line-through decoration-ink-400/60'
                : 'text-ink-900'
            }`}
          >
            {card.title}
          </h3>

          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-400 hover:text-ink-800 p-0.5 rounded"
            aria-hidden="true"
          >
            <Icon name="pencil" className="size-3" />
          </span>
        </div>

        {(done ||
          card.due_date !== null ||
          card.attachments.length > 0 ||
          card.assignees.length > 0) && (
          <div className="mt-2.5 flex items-center gap-2">
            {done ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-mint-100 px-1.5 py-0.5 text-[11px] font-semibold text-mint-600">
                <Icon name="check" className="size-3" />
                {t('card.done')}
              </span>
            ) : (
              <DueBadge dueDate={card.due_date} />
            )}

            {card.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-400 tabular-nums">
                <Icon name="paperclip" className="size-3" />
                {card.attachments.length}
              </span>
            )}

            <span className="ml-auto">
              <AvatarGroup users={card.assignees} />
            </span>
          </div>
        )}
      </button>
    </article>
  );
}
