import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SetStateAction,
} from 'react';
import Button from '../atoms/Button';
import IconButton from '../atoms/IconButton';
import TextField from '../atoms/TextField';
import TextArea from '../atoms/TextArea';
import DetailSection from '../molecules/DetailSection';
import DueBadge from '../molecules/DueBadge';
import LabelChip from '../atoms/LabelChip';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import Spinner from '../atoms/Spinner';
import LabelPicker from './LabelPicker';
import AssigneePicker from './AssigneePicker';
import CommentThread from './CommentThread';
import { useT } from '../../i18n/LocaleContext';
import { lockBodyScroll } from '../../lib/scrollLock';
import { toApiDate, toInputDate } from '../../lib/date';
import {
  updateCard,
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  removeCardLabel,
  unassignUser,
  getChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from '../../lib/api';
import { describeError } from '../../lib/errors';
import type {
  Card,
  CardChecklist,
  List,
  Label,
  User,
  Attachment,
} from '../../types/domain';

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.pdf',
  '.txt',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.zip',
]);
const ATTACHMENT_ACCEPT =
  '.jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx,.xls,.xlsx,.zip';

interface CardDetailProps {
  boardId: string;
  card: Card | null;
  list: List | undefined;
  onClose: () => void;
  onDelete: (cardPublicId: string) => void;
  onUpdate: (card: Card) => void;
  deleting: boolean;
}

export default function CardDetail({
  boardId,
  card,
  list,
  onClose,
  onDelete,
  onUpdate,
  deleting,
}: CardDetailProps) {
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [checklists, setChecklists] = useState<CardChecklist[]>([]);
  const [loadingChecklists, setLoadingChecklists] = useState(false);
  const [checklistDraft, setChecklistDraft] = useState('');
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [pendingChecklistId, setPendingChecklistId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const labelsRef = useRef<Label[]>([]);
  const assigneesRef = useRef<User[]>([]);
  const cardRef = useRef<Card | null>(card);
  cardRef.current = card;

  function commitLabels(update: SetStateAction<Label[]>) {
    const next = typeof update === 'function' ? update(labelsRef.current) : update;
    labelsRef.current = next;
    setLabels(next);

    const current = cardRef.current;
    if (current !== null) onUpdate({ ...current, labels: next });
  }

  function commitAssignees(update: SetStateAction<User[]>) {
    const next = typeof update === 'function' ? update(assigneesRef.current) : update;
    assigneesRef.current = next;
    setAssignees(next);

    const current = cardRef.current;
    if (current !== null) onUpdate({ ...current, assignees: next });
  }

  const cardPublicId = card?.public_id ?? null;

  useEffect(() => {
    const current = cardRef.current;
    if (cardPublicId === null || current === null) return;

    const release = lockBodyScroll();
    setTitle(current.title);
    setDescription(current.description);
    setDueDate(toInputDate(current.due_date));
    setLabels(current.labels);
    setAssignees(current.assignees);
    labelsRef.current = current.labels;
    assigneesRef.current = current.assignees;
    setAttachments([]);
    setChecklists([]);
    setChecklistDraft('');
    setEditing(false);
    setError(null);

    let live = true;
    setLoadingAttachments(true);
    getAttachments(cardPublicId)
      .then((fetched) => {
        if (live) setAttachments(fetched);
      })
      .catch(() => {
        if (live) setAttachments([]);
      })
      .finally(() => {
        if (live) setLoadingAttachments(false);
      });

    setLoadingChecklists(true);
    getChecklists(cardPublicId)
      .then((fetched) => {
        if (live) setChecklists(fetched);
      })
      .catch(() => {
        if (live) setChecklists([]);
      })
      .finally(() => {
        if (live) setLoadingChecklists(false);
      });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      live = false;
      release();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [cardPublicId, onClose]);

  async function handleSave() {
    if (card === null) return;

    const trimmed = title.trim();
    if (trimmed === '') {
      setError(t('detail.errTitle'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await updateCard(card.public_id, {
        list_public_id: card.list_public_id,
        title: trimmed,
        description: description.trim(),
        due_date: toApiDate(dueDate),
        position: card.position,
      });
      onUpdate({
        ...updated,
        labels: labelsRef.current,
        assignees: assigneesRef.current,
        attachments,
      });
      setEditing(false);
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (card === null) return;
    setTitle(card.title);
    setDescription(card.description);
    setDueDate(toInputDate(card.due_date));
    setEditing(false);
    setError(null);
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (card === null || event.target.files === null) return;

    const file = event.target.files[0];
    if (file === undefined) return;

    const dotIndex = file.name.lastIndexOf('.');
    const ext = dotIndex === -1 ? '' : file.name.slice(dotIndex).toLowerCase();
    if (!ALLOWED_ATTACHMENT_EXTENSIONS.has(ext)) {
      setError(t('detail.errFileType'));
      event.target.value = '';
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError(t('detail.errFileTooLarge'));
      event.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploaded = await uploadAttachment(card.public_id, file);
      setAttachments((current) => [...current, uploaded]);
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function handleRemoveLabel(label: Label) {
    if (card === null) return;
    setError(null);
    try {
      await removeCardLabel(card.public_id, label.public_id);
      commitLabels((current) =>
        current.filter((item) => item.public_id !== label.public_id),
      );
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    }
  }

  async function handleRemoveAssignee(user: User) {
    if (card === null) return;
    setError(null);
    try {
      await unassignUser(card.public_id, user.public_id);
      commitAssignees((current) =>
        current.filter((item) => item.public_id !== user.public_id),
      );
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    }
  }

  async function handleDeleteAttachment(attachment: Attachment) {
    if (card === null) return;

    setError(null);
    try {
      await deleteAttachment(card.public_id, attachment.public_id);
      setAttachments((current) =>
        current.filter((item) => item.public_id !== attachment.public_id),
      );
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    }
  }

  async function handleAddChecklist() {
    if (card === null) return;
    const trimmed = checklistDraft.trim();
    if (trimmed === '') return;

    setAddingChecklist(true);
    setError(null);
    try {
      const created = await createChecklist(card.public_id, {
        title: trimmed,
        position: checklists.length,
      });
      setChecklists((current) => [...current, created]);
      setChecklistDraft('');
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setAddingChecklist(false);
    }
  }

  async function handleToggleChecklist(item: CardChecklist) {
    if (card === null) return;
    const nextDone = !item.is_done;
    setPendingChecklistId(item.public_id);
    setError(null);

    try {
      const updated = await updateChecklist(card.public_id, item.public_id, {
        is_done: nextDone,
      });
      setChecklists((current) =>
        current.map((row) => (row.public_id === updated.public_id ? updated : row)),
      );
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setPendingChecklistId(null);
    }
  }

  async function handleDeleteChecklist(item: CardChecklist) {
    if (card === null) return;
    setPendingChecklistId(item.public_id);
    setError(null);

    try {
      await deleteChecklist(card.public_id, item.public_id);
      setChecklists((current) =>
        current.filter((row) => row.public_id !== item.public_id),
      );
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setPendingChecklistId(null);
    }
  }

  if (card === null) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
        <div
          className="absolute inset-0 bg-scrim"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={card.title}
          className="relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-paper-50 shadow-2xl sm:h-full sm:max-h-none sm:w-full sm:max-w-xl sm:rounded-l-2xl sm:border-l sm:border-paper-300/80 overscroll-contain"
        >
          <span
            className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-paper-300 sm:hidden"
            aria-hidden="true"
          />

          <header className="flex shrink-0 items-start gap-3 border-b border-paper-300 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-paper-200/90 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
                <Icon name="board" className="size-3 text-ink-400" />
                {list?.title ?? t('detail.noList')}
              </span>
              {editing ? (
                <TextField
                  label={t('detail.titleLabel')}
                  hideLabel
                  value={title}
                  disabled={saving}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 text-base sm:text-lg font-semibold"
                />
              ) : (
                <h2 className="mt-2 text-lg sm:text-xl leading-snug font-bold tracking-tight text-ink-900">
                  {card.title}
                </h2>
              )}
            </div>
            <IconButton icon="close" label={t('detail.close')} onClick={onClose} className="rounded-lg hover:bg-paper-200" />
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 scrollbar-slim">
            <DetailSection title={t('detail.description')}>
              {editing ? (
                <TextArea
                  label={t('detail.description')}
                  hideLabel
                  value={description}
                  rows={4}
                  disabled={saving}
                  onChange={(event) => setDescription(event.target.value)}
                />
              ) : (
                <p className="text-sm leading-relaxed text-ink-600">
                  {card.description.length > 0
                    ? card.description
                    : t('detail.noDescription')}
                </p>
              )}
            </DetailSection>

            <DetailSection title={t('detail.due')}>
              {editing ? (
                <input
                  type="date"
                  value={dueDate}
                  disabled={saving}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2 text-base sm:text-sm text-ink-900 shadow-2xs transition hover:border-paper-400 focus:border-petrol-500 focus:ring-2 focus:ring-petrol-500/20 focus:outline-none dark:border-paper-400"
                />
              ) : card.due_date !== null ? (
                <DueBadge dueDate={card.due_date} />
              ) : (
                <p className="text-sm text-ink-400">{t('detail.noDue')}</p>
              )}
            </DetailSection>

            <DetailSection
              title={t('detail.labels')}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowLabelPicker(true)}
                >
                  {t('detail.addLabel')}
                </Button>
              }
            >
              {labels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {labels.map((label) => (
                    <span
                      key={label.public_id}
                      className="inline-flex items-center gap-1"
                    >
                      <LabelChip label={label} />
                      <button
                        type="button"
                        onClick={() => void handleRemoveLabel(label)}
                        aria-label={t('detail.removeLabel', { name: label.name })}
                        className="rounded-full p-0.5 text-ink-400 transition hover:bg-paper-200 hover:text-ink-600"
                      >
                        <Icon name="close" className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">{t('detail.noLabels')}</p>
              )}
            </DetailSection>

            <DetailSection
              title={t('detail.assignees')}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAssigneePicker(true)}
                >
                  {t('detail.addAssignee')}
                </Button>
              }
            >
              {assignees.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {assignees.map((assignee) => (
                    <li key={assignee.public_id} className="flex items-center gap-2.5">
                      <Avatar user={assignee} size="sm" />
                      <span className="min-w-0 flex-1 truncate text-sm text-ink-600">
                        {assignee.name}
                      </span>
                      <IconButton
                        icon="close"
                        label={t('detail.removeAssignee', { name: assignee.name })}
                        onClick={() => void handleRemoveAssignee(assignee)}
                        className="size-7"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-400">{t('detail.noAssignees')}</p>
              )}
            </DetailSection>

            <DetailSection
              title={t('detail.attachments')}
              action={
                <label>
                  <input
                    type="file"
                    accept={ATTACHMENT_ACCEPT}
                    disabled={uploading}
                    onChange={handleUpload}
                    className="sr-only"
                  />
                  <span className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-ink-600 transition-colors hover:bg-paper-200 hover:text-ink-900">
                    <Icon name="upload" className="size-3.5" />
                    {uploading ? t('detail.uploading') : t('detail.upload')}
                  </span>
                </label>
              }
            >
              {loadingAttachments ? (
                <div className="flex justify-center py-3">
                  <Spinner label={t('app.loading')} size="sm" />
                </div>
              ) : attachments.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {attachments.map((attachment) => (
                    <li
                      key={attachment.public_id}
                      className="flex items-center gap-2.5 rounded-lg border border-paper-300/80 bg-paper-50 p-2.5 trello-card hover:border-paper-400 dark:border-paper-400/40"
                    >
                      <Icon
                        name="paperclip"
                        className="size-4 shrink-0 text-ink-400"
                      />
                      <a
                        href={attachment.file}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 flex-1 truncate text-xs font-semibold text-petrol-700 hover:underline"
                      >
                        {attachment.file.split('/').pop() ?? t('detail.attachment')}
                      </a>
                      <IconButton
                        icon="trash"
                        label={t('detail.removeAttachment')}
                        onClick={() => void handleDeleteAttachment(attachment)}
                        className="size-7 shrink-0 text-ink-400 hover:text-berry-600"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-400">{t('detail.noAttachments')}</p>
              )}
            </DetailSection>

            <DetailSection
              title={t('detail.checklists')}
              action={
                checklists.length > 0 ? (
                  <span className="text-xs font-medium text-ink-400 tabular-nums">
                    {checklists.filter((item) => item.is_done).length}/{checklists.length}
                  </span>
                ) : undefined
              }
            >
              {checklists.length > 0 && (
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-paper-200">
                  <div
                    className="h-full rounded-full bg-petrol-600 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (checklists.filter((item) => item.is_done).length /
                          checklists.length) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              )}

              {loadingChecklists ? (
                <div className="flex justify-center py-3">
                  <Spinner label={t('app.loading')} size="sm" />
                </div>
              ) : checklists.length > 0 ? (
                <ul className="mb-3 space-y-1.5">
                  {checklists.map((item) => (
                    <li
                      key={item.public_id}
                      className="flex items-center gap-2.5 rounded-lg border border-paper-300/80 bg-paper-50 px-2.5 py-2 dark:border-paper-400/40"
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={item.is_done}
                        disabled={pendingChecklistId === item.public_id}
                        onClick={() => void handleToggleChecklist(item)}
                        className={`flex size-4 shrink-0 items-center justify-center rounded border transition ${
                          item.is_done
                            ? 'border-petrol-600 bg-petrol-600 text-white'
                            : 'border-paper-400 bg-paper-50 hover:border-petrol-500'
                        }`}
                      >
                        {item.is_done && <Icon name="check" className="size-3" />}
                      </button>
                      <span
                        className={`min-w-0 flex-1 text-sm wrap-break-words ${
                          item.is_done ? 'text-ink-400 line-through' : 'text-ink-800'
                        }`}
                      >
                        {item.title}
                      </span>
                      <IconButton
                        icon="trash"
                        label={t('detail.checklistDelete')}
                        disabled={pendingChecklistId === item.public_id}
                        onClick={() => void handleDeleteChecklist(item)}
                        className="size-7 shrink-0 text-ink-400 hover:text-berry-600"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-3 text-sm text-ink-400">{t('detail.noChecklists')}</p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={checklistDraft}
                  placeholder={t('detail.checklistPlaceholder')}
                  disabled={addingChecklist}
                  onChange={(event) => setChecklistDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      void handleAddChecklist();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-paper-300 bg-paper-50 px-3 py-1.5 text-base sm:text-sm text-ink-900 shadow-2xs transition placeholder:text-ink-400 hover:border-paper-400 focus:border-petrol-500 focus:ring-2 focus:ring-petrol-500/20 focus:outline-none dark:border-paper-400"
                />
                <Button
                  size="sm"
                  disabled={addingChecklist || checklistDraft.trim() === ''}
                  onClick={() => void handleAddChecklist()}
                >
                  {t('detail.checklistAdd')}
                </Button>
              </div>
            </DetailSection>

            <DetailSection title={t('detail.comments')}>
              <CommentThread cardPublicId={card.public_id} />
            </DetailSection>

            {error !== null && (
              <p role="alert" className="text-xs leading-relaxed text-berry-500">
                {error}
              </p>
            )}
          </div>

          <footer className="flex shrink-0 items-center gap-2 border-t border-paper-300 px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4 sm:pb-4">
            {editing ? (
              <>
                <Button size="sm" disabled={saving} onClick={() => void handleSave()}>
                  {saving ? t('detail.saving') : t('detail.save')}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={saving}
                  onClick={handleCancel}
                >
                  {t('detail.cancel')}
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => setEditing(true)}>
                  {t('detail.edit')}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={deleting}
                  onClick={() => {
                    if (window.confirm(t('detail.deleteConfirm')))
                      onDelete(card.public_id);
                  }}
                  className="ml-auto"
                >
                  {deleting ? t('detail.deleting') : t('detail.delete')}
                </Button>
              </>
            )}
          </footer>
        </div>
      </div>

      <LabelPicker
        open={showLabelPicker}
        cardPublicId={card.public_id}
        selected={labels}
        onClose={() => setShowLabelPicker(false)}
        onChange={commitLabels}
      />

      <AssigneePicker
        open={showAssigneePicker}
        boardId={boardId}
        cardPublicId={card.public_id}
        selected={assignees}
        onClose={() => setShowAssigneePicker(false)}
        onChange={commitAssignees}
      />
    </>
  );
}
