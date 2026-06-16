# frozen_string_literal: true

class ContactPerson < ApplicationRecord
  belongs_to :group
end
