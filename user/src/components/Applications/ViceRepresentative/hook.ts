import { useEffect, useState } from 'react';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { FormItem } from '@/components/FormList/type';
import { viceRepresentativeLabels } from '../label';

export const useViceRepresentativeHook = () => {
  const { viceRepresentative, isLoading, hasError } =
    useGetViceRepresentatives(3);

  const formItem: FormItem[] = [
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
      content: viceRepresentative?.gradeId ?? '',
    },
    {
      label: viceRepresentativeLabels[4],
      content: viceRepresentative?.departmentId ?? '',
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
  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    console.log('useEffect');
    if (viceRepresentative) {
      setIsEditing(false);
    }
  }, [viceRepresentative]);

  return {
    viceRepresentative,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
  };
};
