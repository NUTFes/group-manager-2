# frozen_string_literal: true

place_categories = [
  { id: 1, name: '講義棟', parent_id: nil },
  { id: 2, name: '1階', parent_id: 1 },
  { id: 3, name: '2階', parent_id: 1 },
  { id: 4, name: '3階', parent_id: 1 },
  { id: 5, name: '新講義棟', parent_id: nil },
  { id: 6, name: '1階', parent_id: 5 },
  { id: 7, name: '2階', parent_id: 5 },
  { id: 8, name: '3階', parent_id: 5 },
  { id: 9, name: '屋外食販', parent_id: nil },
  { id: 10, name: '体育館', parent_id: nil }
]

place_categories.each do |category|
  record = PlaceCategory.find_or_initialize_by(id: category[:id])
  record.update!(category)
end
