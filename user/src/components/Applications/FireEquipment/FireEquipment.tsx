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
  | 'deadlineNoData'
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
    if (hasExisting) return 'summary';
    return 'deadlineNoData';
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

    case 'deadlineNoData':
      content = (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
              <div className="mb-4">
                <svg
                    className="mx-auto size-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {t('applications.fireEquipment.deadline.title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('applications.fireEquipment.deadline.description')}
              </p>
            </div>
          </div>
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
