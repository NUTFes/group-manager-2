class Group < ApplicationRecord
    belongs_to :user
    belongs_to :fes_year
    belongs_to :group_category
    has_one :stage_common_option, dependent: :destroy
    has_many :power_orders, dependent: :destroy
    has_one :sub_rep, dependent: :destroy
    has_many :employees, dependent: :destroy
    has_one :place_order, dependent: :destroy
    has_many :stage_orders, dependent: :destroy
    has_many :food_products, dependent: :destroy
    has_many :rental_orders, dependent: :destroy
    has_many :assign_rental_items, dependent: :destroy

    # Group(参加団体)があるかを確認する
    def self.is_exists?(id)
      return self.exists?(id=id)
    end
end
