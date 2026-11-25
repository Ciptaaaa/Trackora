import { ApiError } from './api';
import type { Translate } from '../i18n';

export function describeError(caught: unknown, t: Translate): string {
  if (caught instanceof ApiError) {
    if (caught.httpStatus === 0) return t('board.errNetwork');
    if (caught.httpStatus === 403) return t('board.errForbidden');
    return caught.message;
  }
  return t('board.errLoad');
}

export function isFatalError(caught: unknown): boolean {
  return caught instanceof ApiError && (caught.httpStatus === 0 || caught.isAuthError);
}
