import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { RadioOption } from '../types';

export const usePowerNegativeViewHooks = (radioOptions: RadioOption[]) => {
  const { t } = useTranslation('common');

  const powerNegativeViewTexts = {
    radio: {
      label: t('applications.power.radio.question'),
      options: radioOptions.map((option) => ({
        id: option.id,
        name: t(option.labelKey),
      })),
    },
    summary: {
      noApplicationItems: [
        {
          label: t('applications.power.summary.noApplication.label'),
          content: t('applications.power.summary.noApplication.description'),
        },
      ] as FormItem[],
    },
    errors: {
      submitTitle: t('applications.power.errors.submitTitle'),
    },
    actions: {
      cancel: t('form.actions.cancel'),
      register: t('form.actions.register'),
    },
  };

  return {
    powerNegativeViewTexts,
  };
};
