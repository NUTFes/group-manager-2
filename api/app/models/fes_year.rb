class FesYear < ApplicationRecord
    has_many :groups
    has_many :fes_dates
    has_many :stocker_items
    has_one :user_page_settings
end
