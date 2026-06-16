# frozen_string_literal: true

require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  test 'is valid with a polymorphic commentable' do
    assert comments(:health_center_submission_note).valid?
  end

  test 'requires a body' do
    comment = Comment.new(commentable: health_center_submission_statuses(:food_product_unapproved), body: nil)

    assert_not comment.valid?
    assert comment.errors.added?(:body, :blank)
  end
end
