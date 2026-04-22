export enum fireEquipmentFormFields {
  NAME = '火気の名称',
  QUANTITY = '火気の台数',
  FUEL = '燃料',
  USAGE = '使用用途',
  IS_TAKEAWAY = '火気を毎日テントから持ち帰ることができますか？',
  REMARK = '備考',
}

export const FIRE_EQUIPMENT_INSTRUCTIONS = {
  TAKEAWAY_NOTICE:
    '火気は毎日持って帰ることができない場合を除き、基本的に持ち帰ってください。\n火気はテント内に残す行為は火事の原因になります。',
  REMARK_NOTICE: 'いいえを押した場合は火気の備考欄に理由を記載して下さい。',
};

export const FIRE_EQUIPMENT_FUEL_PLACEHOLDER_ID = 0;
