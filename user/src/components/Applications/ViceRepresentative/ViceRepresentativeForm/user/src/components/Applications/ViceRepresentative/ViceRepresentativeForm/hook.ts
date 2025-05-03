import { useEffect, useState } from 'react';
import {
  useGetUnregisteredGroup,
  useMutateUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import {
  ViceRepresentativeResponse,
  useCreateViceRepresentative,
  useDeleteViceRepresentative,
  useUpdateViceRepresentative,
} from '@/api/viceRepresentativesApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { ORDER_TYPES } from '@/components/Applications/Power/types';
import { ViceRepresentativeForm, vicerepresentativeSchema } from './schema';

export const useViceRepresentativeFormHook = (
  viceRepresentative: ViceRepresentativeResponse | undefined
) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm<ViceRepresentativeForm>({
    resolver: zodResolver(vicerepresentativeSchema),
    defaultValues: {
      groupId: 3,
      name: viceRepresentative?.name || '',
      studentId: viceRepresentative?.studentId || 0,
      gradeId: viceRepresentative?.gradeId || 0,
      departmentId: viceRepresentative?.departmentId || 0,
      email: viceRepresentative?.email || '',
      tel: viceRepresentative?.tel || '',
    },
  });

  const option2 = [
    { id: 1, name: 'はい(一人での参加)' },
    { id: 0, name: 'いいえ(グループで参加)' },
  ];

  const [isIndividual, setIsIndividual] = useState<boolean | undefined>(
    undefined
  );

  const values = watch();
  const groupId = values.groupId;

  const setisInd = (id: number) => {
    setIsIndividual(id === 1);
  };

  const { trigger: create } = useCreateViceRepresentative();

  const { trigger: update } = useUpdateViceRepresentative(
    viceRepresentative?.id
  );

  const { trigger: deleteViceRep } = useDeleteViceRepresentative(
    viceRepresentative?.id
  );

  const { registerUnregisteredGroup: unRegister } = useMutateUnregisteredGroup(
    ORDER_TYPES.SUB_REP
  );

  const { deleteUnregisteredGroup: deleteRegister } =
    useMutateUnregisteredGroup(ORDER_TYPES.SUB_REP);

  const noValidationSubmit = async (onSuccess?: () => void) => {
    const data = getValues();
    await validatedSubmit(data, onSuccess);
  };
  const { unregisteredData } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.SUB_REP
  );
  const [hasViceRep] = useState<boolean>(!!viceRepresentative);

  const refreshViceRepRelated = async (groupId: number) => {
    await Promise.all([
      mutate(`/sub_reps/group/${groupId}`, undefined, { revalidate: true }),
      mutate(
        `/un_registered_groups?group_id=${groupId}&order_type=${ORDER_TYPES.SUB_REP}`,
        undefined,
        { revalidate: true }
      ),
    ]);
  };
  useEffect(() => {
    if (unregisteredData) {
      setIsIndividual(true);
    } else if (viceRepresentative) {
      setIsIndividual(false);
    } else {
      setIsIndividual(undefined);
    }
  }, [unregisteredData, viceRepresentative]);

  const validatedSubmit = async (
    data: ViceRepresentativeForm,
    onSuccess?: () => void
  ) => {
    if (isIndividual === true) {
      try {
        if (!unregisteredData) {
          await unRegister(data.groupId);
        }
        await deleteViceRep();
        alert('unRegi送信と副代表データ削除に成功しました');
        onSuccess?.();
      } catch {
        alert('送信に失敗しました。1');
      }
    } else {
      try {
        if (hasViceRep) {
          await update({ query: data });
        } else {
          await create({ query: data });
        }
        await deleteRegister(unregisteredData);
        alert('送信しました2');
        onSuccess?.();
      } catch {
        alert('送信に失敗しました。2');
      }
    }
    await refreshViceRepRelated(data.groupId);
  };

  return {
    handleSubmit,
    setValue,
    getValues,
    errors,
    reset,
    watch,
    validatedSubmit,
    noValidationSubmit,
    option2,
    optiongrade,
    optionfield,
    isIndividual,
    setisInd,
    textName: values.name || '',
    textstudentId: (values.studentId || '').toString(),
    valuegradeId: values.gradeId.toString(),
    valuedepartmentId: values.departmentId.toString(),
    textemail: values.email || '',
    texttel: values.tel || '',
  };
};

export const optionfield = [
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

export const optiongrade = [
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
