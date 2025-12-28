import { useEffect, useMemo, useState } from 'react';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { DepartmentList, GradeList } from '@/utils/list';
import { FormItem } from '@/components/FormList/type';
import { viceRepresentativeLabels } from '../label';

export const useViceRepresentativeHook = (groupId: number) => {
  const { viceRepresentative, isLoading, hasError, mutateViceRepresentative } =
    useGetViceRepresentatives(groupId);
  const { unregisteredData } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.SUB_REP
  );

  const formItem: FormItem[] = useMemo(() => {
    if (unregisteredData) {
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
          GradeList.find((opt) => opt.id === viceRepresentative?.gradeId)
            ?.name ?? '',
      },
      {
        label: viceRepresentativeLabels[4],
        content:
          DepartmentList.find(
            (opt) => opt.id === viceRepresentative?.departmentId
          )?.name ?? '',
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
  }, [viceRepresentative, unregisteredData]);

  const [isEditing, setIsEditing] = useState(true);
  useEffect(() => {
    if (viceRepresentative || unregisteredData) {
      setIsEditing(false);
    }
  }, [viceRepresentative, unregisteredData]);

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
    mutateViceRepresentative,
  };
};
