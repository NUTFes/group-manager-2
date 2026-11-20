type LocalizableName = {
  name: string;
  nameEn?: string | null;
};

// 英語表示で nameEn があればそれを、なければ name を返す
export const localizeName = (
  record: LocalizableName,
  isEnglish: boolean
): string => (isEnglish && record.nameEn ? record.nameEn : record.name);
