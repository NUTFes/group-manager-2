import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { useTranslation } from 'next-i18next';

export const FIRE_EQUIPMENT_FUEL_PLACEHOLDER_ID = 0;

export const useFireEquipmentTexts = () => {
  const { t } = useTranslation('common');

  return {
    title: t('applications.fireEquipment.title'),
    loading: t('general.loading'),
    fields: {
      name: t('applications.fireEquipment.fields.name'),
      quantity: t('applications.fireEquipment.fields.quantity'),
      fuel: t('applications.fireEquipment.fields.fuel'),
      usage: t('applications.fireEquipment.fields.usage'),
      isTakeaway: t('applications.fireEquipment.fields.isTakeaway'),
      remark: t('applications.fireEquipment.fields.remark'),
    },
    notes: {
      quantity: t('applications.fireEquipment.notes.quantity'),
      takeaway: t('applications.fireEquipment.notes.takeaway'),
      remark: t('applications.fireEquipment.notes.remark'),
      remarkRequired: t('applications.fireEquipment.notes.remarkRequired'),
      excludedItems: t('applications.fireEquipment.notes.excludedItems'),
    },
    radio: {
      question: t('applications.fireEquipment.radio.question'),
      options: {
        yes: t('applications.fireEquipment.radio.options.yes'),
        no: t('applications.fireEquipment.radio.options.no'),
      },
    },
    fuelOptions: [
      {
        id: FIRE_EQUIPMENT_FUEL_PLACEHOLDER_ID,
        name: t('form.validation.select'),
        disabled: true,
      },
      {
        id: Number(FireEquipmentFuel.GAS_BOTTLE),
        name: t('applications.fireEquipment.fuel.gasBottle'),
        disabled: false,
      },
      {
        id: Number(FireEquipmentFuel.LP_GAS),
        name: t('applications.fireEquipment.fuel.lpGas'),
        disabled: false,
      },
      {
        id: Number(FireEquipmentFuel.CHARCOAL),
        name: t('applications.fireEquipment.fuel.charcoal'),
        disabled: false,
      },
    ],
    fuelLabel: (fuel: FireEquipmentFuel) => {
      switch (fuel) {
        case FireEquipmentFuel.LP_GAS:
          return t('applications.fireEquipment.fuel.lpGas');
        case FireEquipmentFuel.CHARCOAL:
          return t('applications.fireEquipment.fuel.charcoal');
        case FireEquipmentFuel.GAS_BOTTLE:
        default:
          return t('applications.fireEquipment.fuel.gasBottle');
      }
    },
    buttons: {
      register: t('form.actions.register'),
      edit: t('form.actions.edit'),
      update: t('form.actions.save'),
      cancel: t('form.actions.cancel'),
    },
    summary: {
      noApplicationLabel: t(
        'applications.fireEquipment.summary.noApplication.label'
      ),
      noApplicationDescription: t(
        'applications.fireEquipment.summary.noApplication.description'
      ),
    },
    messages: {
      deleteSuccess: t('applications.fireEquipment.messages.deleteSuccess'),
      deleteFailed: t('applications.fireEquipment.messages.deleteFailed'),
      noApplicationSuccess: t(
        'applications.fireEquipment.messages.noApplicationSuccess'
      ),
      registerSuccess: t('applications.fireEquipment.messages.registerSuccess'),
      updateSuccess: t('applications.fireEquipment.messages.updateSuccess'),
      submitFailed: (message: string) =>
        t('applications.fireEquipment.messages.submitFailed', { message }),
    },
  };
};
