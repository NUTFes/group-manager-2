import { FC } from 'react';
import FormContainer from '../../FormContainer';
import Radio from '../../Form/Radio';
import TextBox from '../../Form/TextBox';
import { PiSquareSplitVerticalDuotone } from 'react-icons/pi';
import { getRandomValues } from 'crypto';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import snakecaseKeys from 'snakecase-keys';
import { mutate } from 'swr';
import useSWR from 'swr';
import api from '@/lib/api';
import { vicerepresentativeSchema } from './schema';

type ViceRepresentativeFormProps = {};

const option2 = [
    {id: 1, name:'はい'},
    {id: 0, name:'いいえ'},
];

type FormData ={
    isGroup: number;
};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = () => {

    const {
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset,
        watch,
      } = useForm<FormData>({
        resolver: zodResolver(vicerepresentativeSchema),
        mode: 'onChange',
        defaultValues: {
          groupId: 1,
        },
      });
    
    const values = watch();

    const onSubmit = async (data: FormData) => {
        try {
          await api.post('/stage_common_options/', data);
          mutate('/stage_common_options/');
          alert('送信しました');
          reset();
        } catch {
          alert('送信に失敗しました。');
        }
    };

    const radioValue1 = values.isGroup?.toString() || '';


return (
    <FormContainer>
        <form>
            <div>
                <Radio
                    label="一人での参加ですか？"
                    note='選んでください'
                    onChange={(value) => setValue('isGroup',Number(value))}
                    options={option2}
                    required
                    value={radioValue1}
                    error=''
                />
                {radioValue1 === "1" &&(
                    <div>
                        <TextBox
                        
                        />
                    </div>
                )}
            </div>
        </form>
    </FormContainer>
)
};

export default ViceRepresentativeForm;