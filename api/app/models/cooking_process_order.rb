class CookingProcessOrder < ApplicationRecord
  # group_id という名前の外部キーを持つ group への belongs_to 関連
  belongs_to :group

  # 全ての CookingProcessOrder レコードとそれらの group をプリロードしてハッシュで返すクラスメソッド
  def self.with_groups
    @records = CookingProcessOrder.preload(:group)
      .map { |cooking_process_order|
        {
          "cooking_process_order": cooking_process_order,
          "group": cooking_process_order.group
        }
      }
  end

  # 特定の CookingProcessOrder レコードとその group を返すクラスメソッド
  def self.with_group(cooking_process_order_id)
    cooking_process_order = CookingProcessOrder.find(cooking_process_order_id)
    {
      "cooking_process_order": cooking_process_order,
      "group": cooking_process_order.group
    }
  end

  # インスタンスの情報をハッシュとして返すインスタンスメソッド
  def to_info_h
    {
      "id": self.id,
      "group_id": self.group_id,
      "pre_open_kitchen": self.pre_open_kitchen,
      "during_open_kitchen": self.during_open_kitchen,
      "tent": self.tent
    }
  end
end
