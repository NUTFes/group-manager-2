import { useMemo } from 'react';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { useGetViceRepresentatives } from '@/api/viceRepresentativesApi';
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { viceRepresentativeLabels } from '../label';
import { useEditableSection } from '../shared';

export const useViceRepresentativeHook = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { t } = useTranslation('common');
  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);
  const {
    viceRepresentative,
    isLoading: isViceRepresentativeLoading,
    hasError,
    mutateViceRepresentative,
  } = useGetViceRepresentatives(groupId);
  const { unregisteredData, isLoading: isUnregisteredLoading } =
    useGetUnregisteredGroup(groupId, ORDER_TYPES.SUB_REP);

  const viceRepresentativeTexts = {
    title: t('applications.viceRepresentative.title'),
    note: t('applications.viceRepresentative.note'),
    general: {
      loading: t('general.loading'),
    },
    errors: {
      fetch: t('general.errors.fetch'),
    },
  };

  const formItem: FormItem[] = useMemo(() => {
    if (unregisteredData) {
      return [
        {
          label: t('applications.viceRepresentative.summary.individual.label'),
          content: t(
            'applications.viceRepresentative.summary.individual.description'
          ),
        },
      ];
    }

    return [
      {
        label: t(viceRepresentativeLabels[1]),
        content: viceRepresentative?.name ?? '',
      },
      {
        label: t(viceRepresentativeLabels[2]),
        content: viceRepresentative?.studentId ?? '',
      },
      {
        label: t(viceRepresentativeLabels[3]),
        content:
          gradeOptions.find((opt) => opt.id === viceRepresentative?.gradeId)
            ?.name ?? '',
      },
      {
        label: t(viceRepresentativeLabels[4]),
        content:
          departmentOptions.find(
            (opt) => opt.id === viceRepresentative?.departmentId
          )?.name ?? '',
      },
      {
        label: t(viceRepresentativeLabels[5]),
        content: viceRepresentative?.email ?? '',
      },
      {
        label: t(viceRepresentativeLabels[6]),
        content: viceRepresentative?.tel ?? '',
      },
    ];
  }, [
    viceRepresentative,
    unregisteredData,
    t,
    gradeOptions,
    departmentOptions,
  ]);

  const isLoading = isViceRepresentativeLoading || isUnregisteredLoading;

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading, isRegistered });

  return {
    viceRepresentative,
    isLoading: isSectionLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    mutateViceRepresentative,
    viceRepresentativeTexts,
  };
};
