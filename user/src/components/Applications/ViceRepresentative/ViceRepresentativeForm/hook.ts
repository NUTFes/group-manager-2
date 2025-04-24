import { useState } from 'react';
import {
  FormData,
  useCreateViceRepresentative,
  useUpdateViceRepresentative,
} from '@/api/viceRepresentativesApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { vicerepresentativeSchema } from './schema';

export const useViceRepresentativeFormHook = () => {
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
      groupId: 3,
      name: '',
      number: '',
      grade: 0,
      field: 0,
      address: '',
    },
  });
  const [isGroup, setisGroup] = useState(undefined);

  const option2 = [
    { id: 0, name: 'はい(一人での参加)' }, //一人
    { id: 1, name: 'いいえ(グループで参加)' }, //グループ
  ];

  const optiongrade = [
    { id: 0, name: '選択してください', disabled: true },
    { id: 1, name: 'B1[学部1年]' },
    { id: 2, name: 'B2[学部2年]' },
    { id: 3, name: 'B3[学部3年]' },
    { id: 4, name: 'B4[学部4年]' },
    { id: 5, name: 'M1[修士1年]' },
    { id: 6, name: 'M2[修士2年]' },
    { id: 7, name: 'D1[博士1年]' },
    { id: 8, name: 'D2[博士2年]' },
    { id: 9, name: 'D3[博士3年]' },
    { id: 10, name: 'GD1[イノベ1年]' },
    { id: 11, name: 'GD2[イノベ2年]' },
    { id: 12, name: 'GD3[イノベ3年]' },
    { id: 13, name: 'GD4[イノベ4年]' },
    { id: 14, name: 'GD5[イノベ5年]' },
    { id: 15, name: 'その他' },
  ];

  const optionfield = [
    { id: 0, name: '選択してください', disabled: true },
    { id: 1, name: '機械工学分野/機械創造工学課程' },
    { id: 2, name: '電気電子情報工学分野/電気電子情報工学過程' },
    { id: 3, name: '物質生物工学分野/物質材料工学過程/生物機能工学過程' },
    { id: 4, name: '環境社会基盤工学分野/環境社会基盤工学過程' },
    { id: 5, name: '情報・経営システム工学分野/情報・経営システム工学過程' },
    { id: 6, name: '機械工学分野/機械創造工学専攻' },
    { id: 7, name: '電気電子情報工学分野/電気電子情報工学専攻' },
    { id: 8, name: '物質生物工学分野/物質材料工学専攻/生物機能工学専攻' },
    { id: 9, name: '環境社会基盤工学分野/環境社会基盤工学専攻' },
    { id: 10, name: '情報・経営システム工学分野/情報・経営システム工学専攻' },
    { id: 11, name: '量子・原子力統合工学分野/原子力システム安全工学専攻' },
    { id: 12, name: 'システム安全工学専攻' },
    { id: 13, name: '技術科学イノベーション専攻' },
    { id: 14, name: '情報・制御工学分野/情報・制御工学専攻' },
    { id: 15, name: '材料工学分野/材料工学専攻' },
    { id: 16, name: 'エネルギー工学分野/エネルギー・環境工学専攻' },
    { id: 17, name: '社会環境・生物機能工学分野/生物統合工学専攻' },
    { id: 18, name: 'その他' },
  ];
  const values = watch();
  const groupId = values.groupId;

  const onSubmit = async (inputData: FormData) => {
    try {
      if (imputData) {
        await useUpdateViceRepresentative;
      } else {
        await useCreateViceRepresentative;
      }
      mutate(`/vice_representative/group/${imputData?.groupId}`);
      alert('送信しました');
      reset();
    } catch {
      alert('送信に失敗しました。');
    }
  };

  return {
    handleSubmit,
    setValue,
    getValues,
    errors,
    reset,
    watch,
    onSubmit,
    option2,
    optiongrade,
    optionfield,
    // data,
    radioValue1: values.isGroup?.toString() || '',
    textName: values.name || '',
    textNumber: values.number || '',
    valuegrade: values.grade.toString(),
    valuefield: values.field.toString(),
    textAddress: values.address || '',
  };
};
