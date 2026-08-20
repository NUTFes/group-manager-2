import { FC } from 'react';
import Button from '@/components/Button';
import FormList from '@/components/FormList';
import { usePowerSummaryViewHooks } from '../hooks/usePowerSummaryViewHooks';
import { PowerSummaryViewProps } from '../types';

export const PowerSummaryView: FC<PowerSummaryViewProps> = ({
  devices,
  onEdit,
  onDeleteDevice,
  isEditable,
}) => {
  const { createSummaryItemsForDevice, powerSummaryViewTexts } =
    usePowerSummaryViewHooks();

  return (
    <div className="flex flex-col gap-6">
      {devices.map((device, index) => (
        <div key={`device-${index}`} className="mb-4">
          <FormList
            items={createSummaryItemsForDevice(device)}
            onEdit={isEditable ? undefined : onEdit}
            isDelete={isEditable}
            onDelete={device.id ? () => onDeleteDevice(device.id!) : undefined}
          />
        </div>
      ))}

      {isEditable && (
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            {powerSummaryViewTexts.actions.edit}
          </Button>
        </div>
      )}
    </div>
  );
};
