import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import FireEquipmentForm from './FireEquipmentForm';
import { FireEquipmentApplyOption, useFireEquipmentHooks } from './hooks';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

type FireEquipmentDisplayMode =
  | 'negativeUndecided'
  | 'negativeRegister'
  | 'negativeDisplay'
  | 'summary'
  | 'form';

const getDisplayMode = (
  applyFireEquipment: FireEquipmentApplyOption,
  hasExisting: boolean,
  isEditing: boolean,
  hasUnregistered: boolean,
  isDeadline?: boolean
): FireEquipmentDisplayMode => {
  if (isDeadline) {
    if (hasUnregistered) return 'negativeDisplay';
    return hasExisting ? 'summary' : 'negativeDisplay';
  }
  if (applyFireEquipment === 'undecided') return 'negativeUndecided';
  if (applyFireEquipment === 'no' && !hasUnregistered)
    return 'negativeRegister';
  if (applyFireEquipment === 'no' && hasUnregistered) return 'negativeDisplay';
  if (hasExisting && !isEditing) return 'summary';
  return 'form';
};

const FireEquipment: FC<FireEquipmentProps> = ({
  isDeadline,
  isRegistered,
  groupId,
}) => {
  const { t } = useTranslation('common');

  const {
    state,
    isLoading,
    hasExisting,
    hasUnregistered,
    fireEquipmentOrders,
    handleRadioChange,
    handleApplyNegative,
    handleDeleteOrder,
    handleCancelUnregistered,
    prepareFormForEditing,
    handleFormComplete,
    getRadioValue,
  } = useFireEquipmentHooks(groupId);

  const { isEditing, applyFireEquipment } = state;

  const mode = getDisplayMode(
    applyFireEquipment,
    hasExisting,
    isEditing,
    hasUnregistered,
    isDeadline
  );

  const radioOptions = [
    { id: 1, name: t('applications.fireEquipment.radio.options.yes') },
    { id: 2, name: t('applications.fireEquipment.radio.options.no') },
  ];

  const noApplicationItems: FormItem[] = [
    {
      label: t('applications.fireEquipment.summary.noApplication.label'),
      content: t(
        'applications.fireEquipment.summary.noApplication.description'
      ),
    },
  ];

  let content;
  switch (mode) {
    case 'negativeUndecided':
      content = (
        <div className="flex flex-col gap-6">
          <Radio
            label={t('applications.fireEquipment.radio.question')}
            value={getRadioValue(applyFireEquipment)}
            onChange={handleRadioChange}
            required
            options={radioOptions}
          />
          <p className="max-w-[400px] break-words text-xs text-[#484848]">
            {t('applications.fireEquipment.notes.excludedItems')}
          </p>
        </div>
      );
      break;

    case 'negativeRegister':
      content = (
        <div className="flex flex-col gap-6">
          <Radio
            label={t('applications.fireEquipment.radio.question')}
            value={getRadioValue(applyFireEquipment)}
            onChange={handleRadioChange}
            required
            options={radioOptions}
          />
          <p className="max-w-[400px] break-words text-xs text-[#484848]">
            {t('applications.fireEquipment.notes.excludedItems')}
          </p>
          <div className="flex justify-center">
            <Button
              type="button"
              size="pc"
              color="main"
              onClick={handleApplyNegative}
            >
              {t('form.actions.register')}
            </Button>
          </div>
        </div>
      );
      break;

    case 'negativeDisplay':
      content = (
        <FormList
          items={noApplicationItems}
          isEdit={!isDeadline}
          onEdit={isDeadline ? undefined : handleCancelUnregistered}
        />
      );
      break;

    case 'summary':
      content = (
        <FireEquipmentForm
          groupId={groupId}
          existingOrders={fireEquipmentOrders}
          onDeleteOrder={isDeadline ? undefined : handleDeleteOrder}
          toEdit={isDeadline ? undefined : prepareFormForEditing}
          isViewMode
        />
      );
      break;

    case 'form':
    default:
      content = (
        <div className="flex flex-col gap-6">
          <Radio
            label={t('applications.fireEquipment.radio.question')}
            value={getRadioValue(applyFireEquipment)}
            onChange={handleRadioChange}
            required
            options={radioOptions}
          />
          <p className="max-w-[400px] break-words text-xs text-[#484848]">
            {t('applications.fireEquipment.notes.excludedItems')}
          </p>
          <FireEquipmentForm
            groupId={groupId}
            existingOrders={isEditing ? fireEquipmentOrders : undefined}
            onComplete={handleFormComplete}
          />
        </div>
      );
      break;
  }

  const hasAnyRegistration = hasExisting || hasUnregistered;
  const isExist = isLoading ? isRegistered : hasAnyRegistration;

  return (
    <AccordionMenu
      title={t('applications.fireEquipment.title')}
      isEdit={!isDeadline}
      isExist={isExist}
      required={true}
    >
      {isLoading ? (
        <p className="text-sm text-gray-400">{t('general.loading')}</p>
      ) : (
        content
      )}
    </AccordionMenu>
  );
};

export default FireEquipment;
