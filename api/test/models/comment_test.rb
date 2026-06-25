# frozen_string_literal: true

require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    user = User.create!(
      name: 'representative',
      email: 'comment-representative@example.com',
      uid: 'comment-representative@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
    @submission_status = HealthCenterSubmissionStatus.create!(
      group: group,
      application_type: :food_product,
      status: :unapproved
    )
  end

  test 'is valid with a polymorphic commentable' do
    comment = Comment.new(commentable: @submission_status, body: '購入先の記載を追加してください')

    assert comment.valid?
  end

  test 'requires a body' do
    comment = Comment.new(commentable: @submission_status, body: nil)

    assert_not comment.valid?
    assert comment.errors.added?(:body, :blank)
  end

  test 'defaults mail delivery status to failed' do
    comment = Comment.new(commentable: @submission_status, body: '再提出依頼')

    assert comment.failed?
  end
end
