# frozen_string_literal: true

class FesYear < ApplicationRecord
  has_many :groups, dependent: :destroy
  has_many :fes_dates, dependent: :destroy
  has_many :stocker_items, dependent: :destroy
  has_one :user_page_setting, dependent: :destroy
end
