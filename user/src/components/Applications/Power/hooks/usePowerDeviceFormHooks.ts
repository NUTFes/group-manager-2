import { useTranslation } from 'next-i18next';

export const usePowerDeviceFormHooks = () => {
  const { t } = useTranslation('common');

  const powerDeviceFormTexts = {
    fields: {
      productName: t('applications.power.form.fields.productName'),
      manufacturer: t('applications.power.form.fields.manufacturer'),
      model: t('applications.power.form.fields.model'),
      url: t('applications.power.form.fields.url'),
      maxPower: t('applications.power.form.fields.maxPower'),
    },
    notes: {
      url: t('applications.power.form.notes.url'),
      totalPower: (limit: number) =>
        t('applications.power.form.notes.totalPower', { limit }),
      emailWarning: (limit: number) =>
        t('applications.power.form.notes.emailWarning', { limit }),
      contactEmail: t('applications.power.form.notes.contactEmail'),
    },
    actions: {
      delete: t('form.actions.delete'),
    },
  };

  return {
    powerDeviceFormTexts,
  };
};
