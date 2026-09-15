import { useTranslation } from 'next-i18next';

export const useFormFieldCommonTexts = () => {
  const { t } = useTranslation('common');
  return {
    required: t('form.required'),
    translateError: (key?: string) =>
      key ? t(key, { defaultValue: key }) : '',
  };
};
