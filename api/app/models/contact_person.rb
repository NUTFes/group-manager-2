# frozen_string_literal: true

class ContactPerson < ApplicationRecord
  has_many :groups, dependent: :destroy
end
