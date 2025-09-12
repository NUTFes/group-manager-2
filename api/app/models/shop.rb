class Shop < ApplicationRecord
  has_many :purchase_lists, dependent: :destroy
end
