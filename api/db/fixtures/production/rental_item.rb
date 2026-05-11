# frozen_string_literal: true

rental_items = [
  { id: 1, name: '机', name_en: 'Desk', is_inside_shop_rentable: true, is_outside_shop_rentable: true, is_stage_rentable: true },
  { id: 2, name: '長机', name_en: 'Long Table', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 3, name: '椅子', name_en: 'Chair', is_inside_shop_rentable: true, is_outside_shop_rentable: true, is_stage_rentable: true },
  { id: 4, name: 'パーテーション', name_en: 'Partition', is_inside_shop_rentable: true, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 5, name: 'パーテーション足', name_en: 'Partition Base', is_inside_shop_rentable: true, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 6, name: '掲示板', name_en: 'Bulletin Board', is_inside_shop_rentable: true, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 7, name: 'テント', name_en: 'Tent', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 8, name: '小テント', name_en: 'Small Tent', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 9, name: 'テント足', name_en: 'Tent Leg', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 10, name: 'Aスタンド', name_en: 'A-Stand', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 11, name: 'トランシーバー', name_en: 'Walkie-Talkie', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 12, name: 'パイロン', name_en: 'Traffic Cone', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 13, name: 'パイロンおもり', name_en: 'Cone Weight', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 14, name: 'バケツ', name_en: 'Bucket', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 15, name: 'バケツ24下', name_en: 'Bucket 24-Basement', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 16, name: 'バケツ小', name_en: 'Small Bucket', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 17, name: 'バケツ大', name_en: 'Large Bucket', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 18, name: 'パラソル', name_en: 'Parasol', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 19, name: 'ブルーシート(1000*1000)', name_en: 'Blue Sheet (1000x1000)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 20, name: 'ポリバケツ', name_en: 'Plastic Bucket', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 21, name: '暗幕(240*200)', name_en: 'Blackout Curtain (240x200)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 22, name: '暗幕(360*290)', name_en: 'Blackout Curtain (360x290)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 23, name: '暗幕(350*305)', name_en: 'Blackout Curtain (350x305)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 24, name: '拡声器', name_en: 'Megaphone', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 25, name: '台車', name_en: 'Hand Truck', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 26, name: '電ドラ', name_en: 'Electric Screwdriver', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 27, name: '入試課看板(1100*600)', name_en: 'Admissions Signboard (1100x600)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 28, name: '入試課看板(1200*1200)', name_en: 'Admissions Signboard (1200x1200)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 29, name: '入試課看板(1300*600)', name_en: 'Admissions Signboard (1300x600)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 30, name: 'トラバー(1.5m)', name_en: 'Truss (1.5m)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 31, name: 'トラバー(1.7m)', name_en: 'Truss (1.7m)', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false },
  { id: 32, name: '配線カバー', name_en: 'Cable Cover', is_inside_shop_rentable: false, is_outside_shop_rentable: true, is_stage_rentable: false }
]

rental_items.each do |item|
  record = RentalItem.find_or_initialize_by(id: item[:id])
  record.update!(item)
end
