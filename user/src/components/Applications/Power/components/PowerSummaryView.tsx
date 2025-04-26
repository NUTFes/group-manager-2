import { FC } from 'react';
import Button from '@/components/Button/Button';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { Device, PowerSummaryViewProps } from '../types';

// デバイス情報からフォームアイテムを作成する関数
export const createFormItemsForDevice = (device: Device): FormItem[] => {
  const items: FormItem[] = [];
  items.push({ label: '製品名', content: device.productName });
  items.push({ label: 'メーカー名', content: device.manufacturer });
  items.push({ label: '型番', content: device.model });
  if (device.url) {
    items.push({ label: '製品URL', content: device.url });
  }
  items.push({ label: '電力量(W)', content: `${device.maxPower}W` });
  return items;
};

export const PowerSummaryView: FC<PowerSummaryViewProps> = ({
  devices,
  onEdit,
  onDeleteDevice,
  isDeadline,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {devices.map((device, index) => (
        <div key={`device-${index}`} className="mb-4">
          <FormList
            items={createFormItemsForDevice(device)}
            onEdit={onEdit}
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
            修正
          </Button>
        </div>
      )}
    </div>
  );
};
