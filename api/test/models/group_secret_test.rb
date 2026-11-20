# frozen_string_literal: true

require 'test_helper'

class GroupSecretTest < ActiveSupport::TestCase
  fixtures :roles, :group_categories, :fes_years

  def setup
    @user = User.create!(
      email: 'test@example.com',
      password: 'password',
      provider: 'email',
      uid: 'test@example.com',
      role: roles(:one)
    )
    @group = create_group
  end

  test 'should generate a 24-character secret on create' do
    assert_equal 24, @group.group_secret.secret.length
  end

  test 'regenerate_secret should persist a new secret' do
    group_secret = @group.group_secret
    old_secret = group_secret.secret

    group_secret.regenerate_secret
    group_secret.reload

    assert_equal 24, group_secret.secret.length
    assert_not_equal old_secret, group_secret.secret
  end

  test 'should not be found by the old secret after regeneration' do
    group_secret = @group.group_secret
    old_secret = group_secret.secret

    group_secret.regenerate_secret

    assert_nil GroupSecret.find_by(secret: old_secret)
  end

  test 'should look up the secret case-sensitively' do
    # rubocop:disable Rails/SkipsModelValidations
    @group.group_secret.update_column(:secret, 'AbCdEfGhIjKlMnOpQrStUvWx')
    # rubocop:enable Rails/SkipsModelValidations

    assert_not_nil GroupSecret.find_by(secret: 'AbCdEfGhIjKlMnOpQrStUvWx')
    assert_nil GroupSecret.find_by(secret: 'abcdefghijklmnopqrstuvwx')
  end

  test 'should raise a not-null violation when the secret is cleared at the database level' do
    assert_raises(ActiveRecord::NotNullViolation) do
      # rubocop:disable Rails/SkipsModelValidations
      @group.group_secret.update_column(:secret, nil)
      # rubocop:enable Rails/SkipsModelValidations
    end
  end

  test 'should raise a uniqueness violation when the secret duplicates another group secret' do
    other_group = create_group(name: 'Group Two')

    assert_raises(ActiveRecord::RecordNotUnique) do
      # rubocop:disable Rails/SkipsModelValidations
      other_group.group_secret.update_column(:secret, @group.group_secret.secret)
      # rubocop:enable Rails/SkipsModelValidations
    end
  end

  test 'should raise a uniqueness violation when a group is given a second secret' do
    assert_raises(ActiveRecord::RecordNotUnique) do
      GroupSecret.create!(group: @group)
    end
  end

  private

  def create_group(name: 'Group One')
    Group.create!(
      name: name,
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: group_categories(:one),
      fes_year: fes_years(:one)
    )
  end
end
