# frozen_string_literal: true

stocker_places = [
  { id: 1, name: 'AL1', name_en: 'AL1', stock_item_status: 1, assign_item_status: 1 },
  { id: 2, name: 'AL2', name_en: 'AL2', stock_item_status: 1, assign_item_status: 1 },
  { id: 3, name: 'AL3', name_en: 'AL3', stock_item_status: 1, assign_item_status: 1 },
  { id: 4, name: '講義棟103', name_en: 'Lecture Building 103', stock_item_status: 1, assign_item_status: 1 },
  { id: 5, name: '講義棟104', name_en: 'Lecture Building 104', stock_item_status: 1, assign_item_status: 1 },
  { id: 6, name: '講義棟105', name_en: 'Lecture Building 105', stock_item_status: 1, assign_item_status: 1 },
  { id: 8, name: '講義棟106', name_en: 'Lecture Building 106', stock_item_status: 1, assign_item_status: 1 },
  { id: 9, name: '講義棟201', name_en: 'Lecture Building 201', stock_item_status: 1, assign_item_status: 1 },
  { id: 10, name: '講義棟203', name_en: 'Lecture Building 203', stock_item_status: 1, assign_item_status: 1 },
  { id: 11, name: '講義棟205', name_en: 'Lecture Building 205', stock_item_status: 1, assign_item_status: 1 },
  { id: 12, name: '講義棟206', name_en: 'Lecture Building 206', stock_item_status: 1, assign_item_status: 1 },
  { id: 13, name: '講義棟207', name_en: 'Lecture Building 207', stock_item_status: 1, assign_item_status: 1 },
  { id: 14, name: '講義棟208', name_en: 'Lecture Building 208', stock_item_status: 1, assign_item_status: 1 },
  { id: 15, name: '講義棟209', name_en: 'Lecture Building 209', stock_item_status: 1, assign_item_status: 1 },
  { id: 16, name: '講義棟210', name_en: 'Lecture Building 210', stock_item_status: 1, assign_item_status: 1 },
  { id: 17, name: '講義棟301', name_en: 'Lecture Building 301', stock_item_status: 1, assign_item_status: 1 },
  { id: 18, name: '講義棟302', name_en: 'Lecture Building 302', stock_item_status: 1, assign_item_status: 1 },
  { id: 19, name: '講義棟303', name_en: 'Lecture Building 303', stock_item_status: 1, assign_item_status: 1 },
  { id: 20, name: '講義棟304', name_en: 'Lecture Building 304', stock_item_status: 1, assign_item_status: 1 },
  { id: 21, name: '講義棟305', name_en: 'Lecture Building 305', stock_item_status: 1, assign_item_status: 1 },
  { id: 22, name: '講義棟306', name_en: 'Lecture Building 306', stock_item_status: 1, assign_item_status: 1 },
  { id: 23, name: '課外活動共用施設', name_en: 'Extracurricular Activity Shared Facility', stock_item_status: 1, assign_item_status: 1 },
  { id: 24, name: '本部', name_en: 'Headquarters', stock_item_status: 1, assign_item_status: 1 },
  { id: 25, name: 'セコム会議室', name_en: 'Secom Meeting Room', stock_item_status: 1, assign_item_status: 1 },
  { id: 26, name: '24下倉庫', name_en: '24-Basement Storage', stock_item_status: 1, assign_item_status: 1 },
  { id: 27, name: 'グラウンド器具庫', name_en: 'Ground Equipment Storage', stock_item_status: 1, assign_item_status: 1 },
  { id: 28, name: '116倉庫', name_en: '116 Storage', stock_item_status: 1, assign_item_status: 1 },
  { id: 29, name: '入試課倉庫', name_en: 'Admissions Office Storage', stock_item_status: 1, assign_item_status: 1 },
  { id: 30, name: '地域防災実践研究センター', name_en: 'Regional Disaster Prevention Practical Research Center', stock_item_status: 1, assign_item_status: 1 },
  { id: 31, name: '施設課', name_en: 'Facilities Division', stock_item_status: 1, assign_item_status: 1 },
  { id: 32, name: '電気棟事務室', name_en: 'Electrical Building Office', stock_item_status: 1, assign_item_status: 1 },
  { id: 33, name: '機械棟事務室', name_en: 'Mechanical Building Office', stock_item_status: 1, assign_item_status: 1 },
  { id: 34, name: '体育館', name_en: 'Gymnasium', stock_item_status: 1, assign_item_status: 1 },
  { id: 35, name: '物材院講210', name_en: 'Materials Science Lecture Room 210', stock_item_status: 1, assign_item_status: 1 },
  { id: 36, name: '機械棟101', name_en: 'Mechanical Engineering Building 101', stock_item_status: 1, assign_item_status: 1 },
  { id: 37, name: '機械棟103', name_en: 'Mechanical Engineering Building 103', stock_item_status: 1, assign_item_status: 1 },
  { id: 38, name: 'A講義室', name_en: 'Lecture Room A', stock_item_status: 1, assign_item_status: 1 },
  { id: 39, name: 'B講義室', name_en: 'Lecture Room B', stock_item_status: 1, assign_item_status: 1 },
  { id: 40, name: 'C講義室', name_en: 'Lecture Room C', stock_item_status: 1, assign_item_status: 1 },
  { id: 41, name: 'D講義室', name_en: 'Lecture Room D', stock_item_status: 1, assign_item_status: 1 },
  { id: 42, name: 'E講義室', name_en: 'Lecture Room E', stock_item_status: 1, assign_item_status: 1 },
  { id: 43, name: 'F講義室', name_en: 'Lecture Room F', stock_item_status: 1, assign_item_status: 1 }
]

stocker_places.each do |place|
  record = StockerPlace.find_or_initialize_by(id: place[:id])
  record.update!(place)
end