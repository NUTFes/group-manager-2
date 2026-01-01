import { FC } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button/Button';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { Device, PowerSummaryViewProps } from '../types';

// デバイス情報からフォームアイテムを作成する関数
export const createFormItemsForDevice = (
  device: Device,
  t: TFunction<'common'>
): FormItem[] => {
  const items: FormItem[] = [];
  items.push({
    label: t('applications.power.summary.fields.productName'),
    content: device.productName,
  });
  items.push({
    label: t('applications.power.summary.fields.manufacturer'),
    content: device.manufacturer,
  });
  items.push({
    label: t('applications.power.summary.fields.model'),
    content: device.model,
  });
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

export const PowerSummaryView: FC<PowerSummaryViewProps> = ({
  devices,
  onEdit,
  onDeleteDevice,
  isDeadline,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col gap-6">
      {devices.map((device, index) => (
        <div key={`device-${index}`} className="mb-4">
          <FormList
            items={createFormItemsForDevice(device, t)}
            onEdit={isDeadline ? undefined : onEdit}
            isDelete={isDeadline}
            onDelete={device.id ? () => onDeleteDevice(device.id!) : undefined}
          />
        </div>
      ))}

      {isDeadline && (
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            {t('form.actions.edit')}
          </Button>
        </div>
      )}
    </div>
  );
};
