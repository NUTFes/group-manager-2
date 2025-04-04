import { FC } from 'react';
import AccordionMenu from '../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';

type VenueApplicationProps = {};

const VenueApplication: FC<VenueApplicationProps> = () => {
  return (
    <AccordionMenu title="会場申請" isEdit={false} isExist={false} required>
      <VenueApplicationForm />
    </AccordionMenu>
  );
};

export default VenueApplication;
