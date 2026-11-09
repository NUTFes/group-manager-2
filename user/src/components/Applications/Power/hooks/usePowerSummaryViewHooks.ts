import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { Device } from '../types';

export const usePowerSummaryViewHooks = () => {
  const { t } = useTranslation('common');

  const createSummaryItemsForDevice = (device: Device): FormItem[] => {
    const items: FormItem[] = [
      {
        label: t('applications.power.summary.fields.productName'),
        content: device.productName,
      },
      {
        label: t('applications.power.summary.fields.manufacturer'),
        content: device.manufacturer,
      },
      {
        label: t('applications.power.summary.fields.model'),
        content: device.model,
      },
    ];

    if (device.url) {
      items.push({
        label: t('applications.power.summary.fields.url'),
        content: device.url,
      });
    }

    items.push({
      label: t('applications.power.summary.fields.maxPower'),
      content: t('applications.power.summary.powerValue', {
        value: device.maxPower,
      }),
    });

    return items;
  };

  const powerSummaryViewTexts = {
    actions: {
      edit: t('form.actions.edit'),
    },
  };

  return {
    createSummaryItemsForDevice,
    powerSummaryViewTexts,
  };
};
