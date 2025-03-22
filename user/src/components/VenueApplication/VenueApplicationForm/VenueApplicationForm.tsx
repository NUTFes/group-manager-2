import { FC } from 'react';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';

type VenueApplicationFormProps = {};

const options = [
  { id: 0, name: '選択してください' },
  { id: 1, name: '講義棟部屋A' },
  { id: 2, name: '講義棟部屋B' },
  { id: 3, name: 'A講義室' },
];

const VenueApplicationForm: FC<VenueApplicationFormProps> = () => {
  return (
    <FormContainer>
      <form className="w-full">
        <div className="flex flex-col space-y-10"></div>
        <div className="w-full flex flex-col gap-10 justify-center items-center mt-10">
          <Selector
            label="第一希望"
            options={options}
            value=""
            onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
            required
          />
          <Selector
            label="第二希望"
            options={options}
            value=""
            onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
            required
          />
          <Selector
            label="第三希望"
            options={options}
            value=""
            onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
            required
          />
          <TextArea
            label="備考"
            value=""
            onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
          />
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default VenueApplicationForm;
