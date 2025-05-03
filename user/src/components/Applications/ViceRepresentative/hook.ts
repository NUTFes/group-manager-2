import { useMemo, useState } from 'react';
import { useGetUnregisteredGroup } from '@/api/unRegisteredGroupApi';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { FormItem } from '@/components/FormList/type';
import { ORDER_TYPES } from '../Power';
import { viceRepresentativeLabels } from '../label';
import {
  optionfield,
  optiongrade,
} from './ViceRepresentativeForm/user/src/components/Applications/ViceRepresentative/ViceRepresentativeForm/hook';

export const useViceRepresentativeHook = () => {
  const groupId = 3; // TODO: groupIdを取得する方法を考える
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
          label: '副代表登録は不要（申請済み）',
          content: 'あなたは１人での参加です',
        },
      ];
    }
    // if (!viceRepresentative) {
    //   return [];
    // }
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
          optiongrade.find((opt) => opt.id === viceRepresentative?.gradeId)
            ?.name ?? '',
      },
      {
        label: viceRepresentativeLabels[4],
        // content: viceRepresentative?.departmentId ?? '',
        content:
          optionfield.find((opt) => opt.id === viceRepresentative?.departmentId)
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
  // useEffect(() => {
  //   if (isUnregistered) {
  //     setIsEditing(false);
  //   }
  // }, [isUnregistered]);

  // useEffect(() => {
  //   if (viceRepresentative) {
  //     setIsEditing(false);
  //   }
  // }, [viceRepresentative]);

  return {
    viceRepresentative,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
  };
};
