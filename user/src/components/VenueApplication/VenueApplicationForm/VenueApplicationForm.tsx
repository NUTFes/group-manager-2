import { FC } from 'react';
import { usePlacesData, usePlacesOrderMutations } from '@/api/venueApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { convertPlacesToOptions } from '../hooks';
import { VenueApplicationType, venueApplicationFormSchema } from './schema';

type VenueApplicationFormProps = {};

const VenueApplicationForm: FC<VenueApplicationFormProps> = () => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VenueApplicationType>({
    resolver: zodResolver(venueApplicationFormSchema),
    defaultValues: {
      // FIX: group_idの取得は団体申請実装時に追加。
      groupId: 4,
      first: 0,
      second: 0,
      third: 0,
      remark: '',
    },
  });
  const { trigger, error, isMutating } = usePlacesOrderMutations();

  const { places, placesLoading } = usePlacesData();
  if (placesLoading || isMutating) {
    return <div>loading...</div>;
  }

  const values = watch();
  const options = convertPlacesToOptions(places);
  const onSubmit = async (formData: VenueApplicationType) => {
    if (errors.first || errors.second || errors.third || errors.remark) {
      console.error(errors);
      alert('入力エラーがあります。');
      return;
    }
    try {
      await trigger({
        query: formData,
      });
      alert('送信しました');
    } catch {
      console.error(error);
      alert('送信に失敗しました。');
    }
  };

  return (
    <FormContainer>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-10"></div>
        <div className="w-full flex flex-col gap-10 justify-center items-center mt-10">
          <Selector
            label="第一希望"
            options={options}
            value={values.first}
            onChange={(value) => setValue('first', Number(value))}
          />
          <Selector
            label="第二希望"
            options={options}
            value={values.second}
            onChange={(value) => setValue('second', Number(value))}
          />
          <Selector
            label="第三希望"
            options={options}
            value={values.third}
            onChange={(value) => setValue('third', Number(value))}
          />
          <TextArea
            label="備考"
            value={values.remark ?? ''}
            onChange={(value) => setValue('remark', value)}
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
