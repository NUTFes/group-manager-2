import { useEffect, useState } from 'react';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import useSWR from 'swr';
import { FormItem } from '@/components/FormList/type';
import { viceRepresentativeLabels } from '../label';

export const useViceRepresentativeHook = () => {
  const { isLoading, hasError } = useGetViceRepresentatives(9);
  const { data } = useSWR(`/vice_representative/group/5`);

  const viceRepresentative = data;

  const formItem: FormItem[] = [
    {
      label: viceRepresentativeLabels[1],
      content: viceRepresentative?.name ?? '',
    },
    {
      label: viceRepresentativeLabels[2],
      content: viceRepresentative?.number ?? '',
    },
    {
      label: viceRepresentativeLabels[3],
      content: viceRepresentative?.grade ?? '',
    },
    {
      label: viceRepresentativeLabels[4],
      content: viceRepresentative?.field ?? '',
    },
    {
      label: viceRepresentativeLabels[5],
      content: viceRepresentative?.address ?? '',
    },
  ];
  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
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
