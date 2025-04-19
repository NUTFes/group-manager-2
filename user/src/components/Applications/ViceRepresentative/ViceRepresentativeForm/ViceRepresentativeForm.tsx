import { FC } from 'react';
import FormContainer from '../../../FormContainer';
import Radio from '../../../Form/Radio';
import TextBox from '../../../Form/TextBox';
import Selector from '@/components/Form/Selector';
import Button from '@/components/Button';
import { useViceRepresentativeHook } from './hook';
import { FormData } from '@/api/viceRepresentativeApi';

type ViceRepresentativeFormProps = {};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = () => {
    const {
        handleSubmit,
        setValue,
        getValues,
        errors ,
        reset,
        watch,
        onSubmit,
        option2,
        optiongrade,
        optionfield,
        radioValue1,
        textName,
        textNumber,
        valuegrade,
        valuefield,
        textAddress,
    }=useViceRepresentativeHook();

return (
    <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <div>
                <Radio
                    label="一人での参加ですか？"
                    onChange={(value) => setValue('isGroup',Number(value))}
                    options={option2}
                    required
                    value={radioValue1}
                    error={errors.isGroup?.message}
                />
                {radioValue1 === "1" &&(
                    <div>
                        <TextBox
                            label='名前'
                            value={textName}
                            onChange={(value)=> setValue('name',value)}
                            note='例：長岡　太郎'
                            required = {true}
                            error={errors.name?.message}
                        />
                        <TextBox
                            label='学籍番号'
                            value={textNumber}
                            onChange={(value)=> setValue('number',value)}
                            note='例：123456'
                            required = {true}
                            error={errors.number?.message}
                        />
                        <Selector
                            label='課程・学年'
                            value={valuegrade}
                            onChange={(value)=> setValue('grade',Number(value))}
                            required = {true}
                            options={optiongrade}
                            error={errors.grade?.message}
                        />
                        <Selector
                            label='学科・専攻'
                            value={valuefield}
                            onChange={(value)=> setValue('field',Number(value))}
                            required = {true}
                            options={optionfield}
                            error={errors.field?.message}
                        />
                        <TextBox
                            label='メールアドレス'
                            value={textAddress}
                            onChange={(value)=> setValue('address',value)}
                            note='例：123456@stn.nagaokaut.ac.jp'
                            required = {true}
                            error={errors.address?.message}
                        />
                    </div>
                )}
            </div>
            <div className="w-full flex justify-center items-center mt-10">
                <Button size="pc" color="main" type="submit" >
                    登録
                </Button>
            </div>
        </form>
    </FormContainer>
)
};

export default ViceRepresentativeForm;