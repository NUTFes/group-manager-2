import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { DepartmentList, GradeList } from '@/utils/list';
import { FormItem } from '@/components/FormList/type';
import { viceRepresentativeLabels } from '../label';

export const useViceRepresentativeHook = (
  groupId: number,
  isRegistered?: boolean
) => {
  const {
    viceRepresentative,
    isLoading: isViceRepresentativeLoading,
    hasError,
    mutateViceRepresentative,
  } = useGetViceRepresentatives(groupId);
  const {
    unregisteredData,
    isLoading: isUnregisteredLoading,
  } = useGetUnregisteredGroup(
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

  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const isLoading = isViceRepresentativeLoading || isUnregisteredLoading;

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (hasInitializedEditing.current || isRegistered === undefined) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered]);

  const toEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return {
    viceRepresentative,
    isLoading: isLoading && !hasLoadedOnce,
    hasError,
    isEditing,
    toEdit,
    formItem,
    mutateViceRepresentative,
  };
};
