import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { MdModeEdit } from 'react-icons/md';

type EditButtonProps = {
  OnClick: () => void;
};

const EditButton: FC<EditButtonProps> = ({ OnClick }) => {
  const { t } = useTranslation('common');

  return (
    <button className="flex w-32 gap-3" onClick={OnClick}>
      <MdModeEdit color="#000000" size="24" />
      <p className="text-base font-medium text-font">
        {t('form.actions.edit')}
      </p>
    </button>
  );
};

export default EditButton;
