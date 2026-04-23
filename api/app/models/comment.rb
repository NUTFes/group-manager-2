# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true

  validates :body, presence: true
end
