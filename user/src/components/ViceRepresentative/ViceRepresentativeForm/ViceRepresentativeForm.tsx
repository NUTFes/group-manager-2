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
import Selector from '@/components/Form/Selector';
import { strict } from 'assert';
import Button from '@/components/Button';

type ViceRepresentativeFormProps = {};

const option2 = [
    {id: 0, name:'はい(一人での参加)'},//一人
    {id: 1, name:'いいえ(グループで参加)'},//グループ
];
const optiongrade = [
    { id: 0, name:"選択してください",disabled:true},
    { id: 1, name: "B1[学部1年]" },
    { id: 2, name: "B2[学部2年]" },
    { id: 3, name: "B3[学部3年]" },
    { id: 4, name: "B4[学部4年]" },
    { id: 5, name: "M1[修士1年]" },
    { id: 6, name: "M2[修士2年]" },
    { id: 7, name: "D1[博士1年]" },
    { id: 8, name: "D2[博士2年]" },
    { id: 9, name: "D3[博士3年]" },
    { id: 10, name: "GD1[イノベ1年]" },
    { id: 11, name: "GD2[イノベ2年]" },
    { id: 12, name: "GD3[イノベ3年]" },
    { id: 13, name: "GD4[イノベ4年]" },
    { id: 14, name: "GD5[イノベ5年]" },
    { id: 15, name: "その他" },
]

const optionfield = [
    { id: 0, name:"選択してください", disabled:true},
    { id: 1, name: "機械工学分野/機械創造工学課程" },
    { id: 2, name: "電気電子情報工学分野/電気電子情報工学過程" },
    { id: 3, name: "物質生物工学分野/物質材料工学過程/生物機能工学過程" },
    { id: 4, name: "環境社会基盤工学分野/環境社会基盤工学過程" },
    { id: 5, name: "情報・経営システム工学分野/情報・経営システム工学過程" },
    { id: 6, name: "機械工学分野/機械創造工学専攻" },
    { id: 7, name: "電気電子情報工学分野/電気電子情報工学専攻" },
    { id: 8, name: "物質生物工学分野/物質材料工学専攻/生物機能工学専攻" },
    { id: 9, name: "環境社会基盤工学分野/環境社会基盤工学専攻" },
    { id: 10, name: "情報・経営システム工学分野/情報・経営システム工学専攻" },
    { id: 11, name: "量子・原子力統合工学分野/原子力システム安全工学専攻" },
    { id: 12, name: "システム安全工学専攻" },
    { id: 13, name: "技術科学イノベーション専攻" },
    { id: 14, name: "情報・制御工学分野/情報・制御工学専攻" },
    { id: 15, name: "材料工学分野/材料工学専攻" },
    { id: 16, name: "エネルギー工学分野/エネルギー・環境工学専攻" },
    { id: 17, name: "社会環境・生物機能工学分野/生物統合工学専攻" },
    { id: 18, name: "その他" }
  ];
  

type FormData ={
    groupId: number;
    isGroup: number;
    name:string;
    number:string;
    grade:number;
    field:number;
    address:string;
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
        defaultValues: {
            groupId:3,
            isGroup: 2,
            name:'',
            number:'',
            grade:0,
            field:0,
            address:'',


        },
      });
    
    const values = watch();

    const { data } = useSWR(`/vice_representative/${values.groupId}`);

    const onSubmit = async (data: FormData) => {
        try {
            const payload =snakecaseKeys(data, {deep: true});
            if (data){
                await api.put('/vice_representative/', payload);
            } else{
                await api.post('/vice_representative/', payload);
            }
            mutate(`/vice_representative/${data?.groupId}`);
            alert('送信しました');
            reset();
            } catch {
            alert('送信に失敗しました。');
        }
    };

    const radioValue1 = values.isGroup?.toString() || '';
    const textName =values.name || '';
    const textNumber =values.number || '';
    const valuegrade =values.grade.toString() ;
    const valuefield =values.field.toString() ;
    const textAddress =values.address || '';



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
                        <br />
                        <br />
                        <TextBox
                            label='学籍番号'
                            value={textNumber}
                            onChange={(value)=> setValue('number',value)}
                            note='例：123456'
                            required = {true}
                            error={errors.number?.message}
                        />
                        <br />
                        <br />
                        <Selector
                            label='課程・学年'
                            value={valuegrade}
                            onChange={(value)=> setValue('grade',Number(value))}
                            required = {true}
                            options={optiongrade}
                            error={errors.grade?.message}
                        />
                        <br />
                        <br />
                        <Selector
                            label='学科・専攻'
                            value={valuefield}
                            onChange={(value)=> setValue('field',Number(value))}
                            required = {true}
                            options={optionfield}
                            error={errors.field?.message}
                        />
                        <br />
                        <br />
                        <TextBox
                            label='メールアドレス'
                            value={textAddress}
                            onChange={(value)=> setValue('address',value)}
                            note='例：123456@stn.nagaokaut.ac.jp'
                            required = {true}
                            error={errors.address?.message}
                        />
                        <br />
                        <br />
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