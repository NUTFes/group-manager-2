import { FC } from 'react';
import { MdModeEdit } from 'react-icons/md';

type EditButtonProps = {
  OnClick: () => void;
};

const EditButton: FC<EditButtonProps> = ({ OnClick }) => {
  return (
    <button className="flex w-32 gap-3" onClick={OnClick}>
      <MdModeEdit color="#000000" size="24" />
      <p className="text-base font-medium text-font">編集</p>
    </button>
  );
};

export default EditButton;
