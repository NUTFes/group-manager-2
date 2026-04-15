# frozen_string_literal: true

group_categories = [
  { id: 1, name: '食品販売', name_en: 'Food Sales' },
  { id: 2, name: '物品販売', name_en: 'Goods Sales' },
  { id: 3, name: 'ステージ', name_en: 'Stage' },
  { id: 4, name: '展示・体験', name_en: 'Exhibition / Experience' },
  { id: 5, name: '研究室', name_en: 'Laboratory' },
  { id: 6, name: '実行委員', name_en: 'Executive Committee' },
  { id: 7, name: 'その他', name_en: 'Other' }
]

GroupCategory.seed(:id, *group_categories)
