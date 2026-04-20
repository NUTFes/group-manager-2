import { useTranslation } from 'next-i18next';
import { RadioOption } from '../types';

export const usePowerFormViewHooks = (radioOptions: RadioOption[]) => {
  const { t } = useTranslation('common');

  const powerFormViewTexts = {
    radio: {
      label: t('applications.power.radio.question'),
      options: radioOptions.map((option) => ({
        id: option.id,
        name: t(option.labelKey),
      })),
    },
    warnings: {
      totalPower: (limit: number, value: number) =>
        t('applications.power.form.totalPowerWarning', { limit, value }),
    },
    actions: {
      addDevice: t('applications.power.form.addDevice'),
      register: t('form.actions.register'),
    },
  };

  return {
    powerFormViewTexts,
  };
};
