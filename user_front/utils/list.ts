export const groupCategoryList: { id: number; name: string }[] = [
  { id: 1, name: "模擬店(食品販売)" },
  { id: 2, name: "模擬店(物品販売)" },
  { id: 3, name: "ステージ企画" },
  { id: 4, name: "展示・体験" },
  { id: 5, name: "研究室公開" },
  { id: 6, name: "その他" },
];

export const gradeList: { id: number; name: string }[] = [
  { id: 1, name: "B1[学部1年]" },
  { id: 2, name: "B2[学部2年]" },
  { id: 3, name: "B3[学部3年]" },
  { id: 4, name: "B4[学部4年]" },
  { id: 5, name: "M1[修士1年]" },
  { id: 6, name: "M2[修士2年]" },
  { id: 7, name: "D1[博士1年]" },
  { id: 8, name: "D2[博士2年]" },
  { id: 9, name: "D3[博士3年]" },
  { id: 10, name: "GD1[イノベ1年]" },
  { id: 11, name: "GD2[イノベ2年]" },
  { id: 12, name: "GD3[イノベ3年]" },
  { id: 13, name: "GD4[イノベ4年]" },
  { id: 14, name: "GD4[イノベ5年]" },
  { id: 15, name: "教員" },
  { id: 16, name: "その他" },
];

export const departmentList: { id: number; name: string }[] = [
  { id: 1, name: "機械工学分野" },
  { id: 2, name: "電気電子情報工学分野" },
  { id: 3, name: "物質生物工学分野" },
  { id: 4, name: "環境社会基盤工学分野" },
  { id: 5, name: "情報・経営システム工学分野" },
  { id: 6, name: "機械工学分野" },
  { id: 7, name: "電気電子情報工学分野" },
  { id: 8, name: "物質生物工学分野" },
  { id: 9, name: "環境社会基盤工学分野" },
  { id: 10, name: "情報・経営システム工学分野" },
  { id: 11, name: "量子・原子力統合工学分野" },
  { id: 12, name: "システム安全工学専攻" },
  { id: 13, name: "技術科学イノベーション専攻" },
  { id: 14, name: "情報・制御工学分野" },
  { id: 15, name: "材料工学分野" },
  { id: 16, name: "エネルギー工学分野" },
  { id: 17, name: "社会環境・生物機能工学分野" },
  { id: 18, name: "その他" },
]

export const B1AndOtherGradeDepartmentList: { id: number; name: string }[] = [
  { id: 18, name: "その他" },
];

export const B2toB4GradeDepartmentList: { id: number; name: string }[] = [
  { id: 1, name: "機械工学分野" },
  { id: 2, name: "電気電子情報工学分野" },
  { id: 3, name: "物質生物工学分野" },
  { id: 4, name: "環境社会基盤工学分野" },
  { id: 5, name: "情報・経営システム工学分野" },
];

export const M1toM2GradeDepartmentList: { id: number; name: string }[] = [
  { id: 6, name: "機械工学分野" },
  { id: 7, name: "電気電子情報工学分野" },
  { id: 8, name: "物質生物工学分野" },
  { id: 9, name: "環境社会基盤工学分野" },
  { id: 10, name: "情報・経営システム工学分野" },
  { id: 11, name: "量子・原子力統合工学分野" },
  { id: 12, name: "システム安全工学専攻" },
];

export const D1toD3GradeDepartmentList: { id: number; name: string }[] = [
  { id: 14, name: "情報・制御工学分野" },
  { id: 15, name: "材料工学分野" },
  { id: 16, name: "エネルギー工学分野" },
  { id: 17, name: "社会環境・生物機能工学分野" },
];

export const GDGradeDepartmentList: { id: number; name: string }[] = [
  { id: 13, name: "技術科学イノベーション専攻" },
];

export const GradeWithDepartmentList: { id: number; departmentList: { id: number; name: string }[] }[] = [
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
  { id: 15, departmentList: departmentList },
  { id: 16, departmentList: B1AndOtherGradeDepartmentList },
];
