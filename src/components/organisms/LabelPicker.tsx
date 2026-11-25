import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import Modal from '../molecules/Modal';
import Icon from '../atoms/Icon';
import Spinner from '../atoms/Spinner';
import { useT } from '../../i18n/LocaleContext';
import { getAllLabels, addCardLabel, removeCardLabel } from '../../lib/api';
import { describeError } from '../../lib/errors';
import type { Label } from '../../types/domain';

interface LabelPickerProps {
  open: boolean;
  cardPublicId: string;
  selected: Label[];
  onClose: () => void;
  onChange: Dispatch<SetStateAction<Label[]>>;
}

export default function LabelPicker({
  open,
  cardPublicId,
  selected,
  onClose,
  onChange,
}: LabelPickerProps) {
  const t = useT();
  const [catalogue, setCatalogue] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let live = true;
    setLoading(true);
    setError(null);

    getAllLabels()
      .then((fetched) => {
        if (live) setCatalogue(fetched);
      })
      .catch((caught: unknown) => {
        if (live) setError(describeError(caught, t));
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [open, t]);

  async function toggle(label: Label) {
    const isOn = selected.some((item) => item.public_id === label.public_id);
    setPendingId(label.public_id);
    setError(null);

    try {
      if (isOn) {
        await removeCardLabel(cardPublicId, label.public_id);
        onChange((current) =>
          current.filter((item) => item.public_id !== label.public_id),
        );
      } else {
        await addCardLabel(cardPublicId, label.public_id);
        onChange((current) =>
          current.some((item) => item.public_id === label.public_id)
            ? current
            : [...current, label],
        );
      }
    } catch (caught: unknown) {
      setError(describeError(caught, t));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Modal open={open} title={t('detail.addLabel')} size="sm" onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner label={t('app.loading')} size="sm" />
        </div>
      ) : catalogue.length === 0 ? (
        <p className="rounded-lg border border-dashed border-paper-400/60 px-3 py-5 text-center text-xs leading-relaxed text-ink-400">
          {t('label.empty')}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {catalogue.map((label) => {
            const isOn = selected.some(
              (item) => item.public_id === label.public_id,
            );
            return (
              <li key={label.public_id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isOn}
                  disabled={pendingId !== null}
                  onClick={() => void toggle(label)}
                  className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all disabled:opacity-50 ${
                    isOn
                      ? 'border-2 border-petrol-600 bg-petrol-50/70 shadow-xs'
                      : 'border border-paper-300 hover:border-paper-400 hover:bg-paper-100/60'
                  }`}
                >
                  <span
                    className="h-4 w-6 shrink-0 rounded-sm shadow-2xs"
                    style={{ backgroundColor: label.color }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink-900">
                    {label.name}
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
