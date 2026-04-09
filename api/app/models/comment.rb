# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
  belongs_to :author, class_name: 'User', foreign_key: :author_id

  validates :body, presence: true
  validates :author_id, presence: true
end
