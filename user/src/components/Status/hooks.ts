import { useTranslation } from 'next-i18next';

const STATUS_TRANSLATION_KEY = {
  open: 'status.reception.open',
  deadline: 'status.reception.deadline',
  closed: 'status.reception.closed',
  registered: 'status.registration.registered',
  unregistered: 'status.registration.unregistered',
  not_required: 'status.progress.notRequired',
  completed: 'status.progress.completed',
  pending: 'status.progress.pending',
} as const;

export type StatusTranslationKey = keyof typeof STATUS_TRANSLATION_KEY;

export const useStatusTexts = () => {
  const { t } = useTranslation('common');
  const getStatusLabel = (status: StatusTranslationKey) =>
    t(STATUS_TRANSLATION_KEY[status]);

  return { getStatusLabel };
};
