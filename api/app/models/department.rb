# frozen_string_literal: true

class Department < ApplicationRecord
  include LocalizedName

  has_many :user_details, dependent: :destroy
  has_many :sub_reps, dependent: :destroy
end
