import Modal from './Modal';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import { useT } from '../../i18n/LocaleContext';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const t = useT();

  return (
    <Modal
      open={open}
      title={title}
      size="sm"
      onClose={busy ? () => undefined : onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {confirmLabel ?? t('common.delete')}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-berry-100 text-berry-700"
          aria-hidden="true"
        >
          <Icon name="alert" className="size-4.5" />
        </span>
        <p className="text-sm leading-relaxed text-ink-600">{message}</p>
      </div>
    </Modal>
  );
}
