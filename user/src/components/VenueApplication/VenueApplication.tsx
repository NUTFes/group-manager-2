import { FC } from 'react';
import AccordionMenu from '../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type VenueApplicationProps = {};

const VenueApplication: FC<VenueApplicationProps> = () => {
  return (
    <AccordionMenu title="会場申請" isEdit={false} isExist={false} required>
      <VenueApplicationForm />
    </AccordionMenu>
  );
};

export default VenueApplication;
