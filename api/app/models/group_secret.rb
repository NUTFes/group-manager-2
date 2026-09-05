# frozen_string_literal: true

class GroupSecret < ApplicationRecord
  belongs_to :group

  has_secure_token :secret, length: 24
end
