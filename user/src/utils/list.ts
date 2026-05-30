import { TFunction } from 'i18next';

export type TranslatedOption = {
  id: number;
  labelKey: string;
  disabled?: boolean;
};

export type SelectorOption = {
  id: number;
  name: string;
  disabled?: boolean;
};

const createDepartmentSubset = (ids: number[]) =>
  ids.map((id) => ({ id, labelKey: `lists.department.${id}` }));

export const GradeList: TranslatedOption[] = [
  { id: 0, labelKey: 'lists.grade.select' },
  { id: 1, labelKey: 'lists.grade.B1' },
  { id: 2, labelKey: 'lists.grade.B2' },
  { id: 3, labelKey: 'lists.grade.B3' },
  { id: 4, labelKey: 'lists.grade.B4' },
  { id: 5, labelKey: 'lists.grade.M1' },
  { id: 6, labelKey: 'lists.grade.M2' },
  { id: 7, labelKey: 'lists.grade.D1' },
  { id: 8, labelKey: 'lists.grade.D2' },
  { id: 9, labelKey: 'lists.grade.D3' },
  { id: 10, labelKey: 'lists.grade.GD1' },
  { id: 11, labelKey: 'lists.grade.GD2' },
  { id: 12, labelKey: 'lists.grade.GD3' },
  { id: 13, labelKey: 'lists.grade.GD4' },
  { id: 14, labelKey: 'lists.grade.GD5' },
  { id: 15, labelKey: 'lists.grade.faculty' },
  { id: 16, labelKey: 'lists.grade.other' },
];

export const DepartmentList: TranslatedOption[] = [
  { id: 0, labelKey: 'lists.department.select' },
  { id: 1, labelKey: 'lists.department.1' },
  { id: 2, labelKey: 'lists.department.2' },
  { id: 3, labelKey: 'lists.department.3' },
  { id: 4, labelKey: 'lists.department.4' },
  { id: 5, labelKey: 'lists.department.5' },
  { id: 6, labelKey: 'lists.department.6' },
  { id: 7, labelKey: 'lists.department.7' },
  { id: 8, labelKey: 'lists.department.8' },
  { id: 9, labelKey: 'lists.department.9' },
  { id: 10, labelKey: 'lists.department.10' },
  { id: 11, labelKey: 'lists.department.11' },
  { id: 12, labelKey: 'lists.department.12' },
  { id: 13, labelKey: 'lists.department.13' },
  { id: 14, labelKey: 'lists.department.14' },
  { id: 15, labelKey: 'lists.department.15' },
  { id: 16, labelKey: 'lists.department.16' },
  { id: 17, labelKey: 'lists.department.17' },
  { id: 18, labelKey: 'lists.department.18' },
];

export const B1AndOtherGradeDepartmentList: TranslatedOption[] =
  createDepartmentSubset([18]);

export const B2toB4GradeDepartmentList: TranslatedOption[] =
  createDepartmentSubset([1, 2, 3, 4, 5]);

export const M1toM2GradeDepartmentList: TranslatedOption[] =
  createDepartmentSubset([6, 7, 8, 9, 10, 11, 12]);

export const D1toD3GradeDepartmentList: TranslatedOption[] =
  createDepartmentSubset([14, 15, 16, 17]);

export const GDGradeDepartmentList: TranslatedOption[] = createDepartmentSubset(
  [13]
);

export const mapToLocalizedOptions = (
  options: TranslatedOption[],
  t: TFunction
): SelectorOption[] =>
  options.map(({ id, labelKey, disabled }) => ({
    id,
    name: t(labelKey),
    disabled,
  }));

export const createDepartmentSelectorOptions = (
  options: TranslatedOption[],
  t: TFunction
) => mapToLocalizedOptions(options, t);

export const getGradeOptions = (t: TFunction) =>
  mapToLocalizedOptions(GradeList, t);

export const getDepartmentOptions = (t: TFunction) =>
  mapToLocalizedOptions(DepartmentList, t);

export const GradeWithDepartmentList: {
  id: number;
  departmentList: TranslatedOption[];
}[] = [
  { id: 1, departmentList: B1AndOtherGradeDepartmentList },
  { id: 2, departmentList: B2toB4GradeDepartmentList },
  { id: 3, departmentList: B2toB4GradeDepartmentList },
  { id: 4, departmentList: B2toB4GradeDepartmentList },
  { id: 5, departmentList: M1toM2GradeDepartmentList },
  { id: 6, departmentList: M1toM2GradeDepartmentList },
  { id: 7, departmentList: D1toD3GradeDepartmentList },
  { id: 8, departmentList: D1toD3GradeDepartmentList },
  { id: 9, departmentList: D1toD3GradeDepartmentList },
  { id: 10, departmentList: GDGradeDepartmentList },
  { id: 11, departmentList: GDGradeDepartmentList },
  { id: 12, departmentList: GDGradeDepartmentList },
  { id: 13, departmentList: GDGradeDepartmentList },
  { id: 14, departmentList: GDGradeDepartmentList },
  { id: 15, departmentList: DepartmentList },
  { id: 16, departmentList: B1AndOtherGradeDepartmentList },
];
