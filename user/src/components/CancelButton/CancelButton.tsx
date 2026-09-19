import { FC } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

type CancelButtonProps = {
  onClick: () => void;
};

const CancelButton: FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <button type="button" className="" onClick={onClick}>
      <MdOutlineCancel color="#FF6752" size="32" />
    </button>
  );
};

export default CancelButton;
