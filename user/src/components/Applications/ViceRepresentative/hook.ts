import { useMemo, useState } from 'react';
import { useGetUnregisteredGroup } from '@/api/unRegisteredGroupApi';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { FormItem } from '@/components/FormList/type';
import { ORDER_TYPES } from '../Power';
import { viceRepresentativeLabels } from '../label';
import {
  optionField,
  optionGrade,
} from './ViceRepresentativeForm/user/src/components/Applications/ViceRepresentative/ViceRepresentativeForm/hook';

export const useViceRepresentativeHook = (groupId: number) => {
  const { viceRepresentative, isLoading, hasError } =
    useGetViceRepresentatives(groupId);
  const { unregisteredData } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.SUB_REP
  );
  const isUnregistered = !!unregisteredData;

  const formItem: FormItem[] = useMemo(() => {
    if (isUnregistered) {
      return [
        {
          label: '副代表申請は不要（登録済み）',
          content: 'あなたは１人での参加です',
        },
      ];
    }

    return [
      {
        label: viceRepresentativeLabels[1],
        content: viceRepresentative?.name ?? '',
      },
      {
        label: viceRepresentativeLabels[2],
        content: viceRepresentative?.studentId ?? '',
      },
      {
        label: viceRepresentativeLabels[3],
        content:
          optionGrade.find((opt) => opt.id === viceRepresentative?.gradeId)
            ?.name ?? '',
      },
      {
        label: viceRepresentativeLabels[4],

        content:
          optionField.find((opt) => opt.id === viceRepresentative?.departmentId)
            ?.name ?? '',
      },
      {
        label: viceRepresentativeLabels[5],
        content: viceRepresentative?.email ?? '',
      },
      {
        label: viceRepresentativeLabels[6],
        content: viceRepresentative?.tel ?? '',
      },
    ];
  }, [isUnregistered, viceRepresentative]);

  const [isEditing, setIsEditing] = useState(viceRepresentative ? false : true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  return {
    viceRepresentative,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
  };
};
