# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true

  enum mail_delivery_status: {
    failed: 0,
    sent: 1,
    not_send: 2
  }

  validates :body, presence: true
end
