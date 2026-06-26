# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true

  enum mail_delivery_status: {
    not_send: 0,
    failed: 1,
    sent: 2
  }

  validates :body, presence: true
end
