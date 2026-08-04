# frozen_string_literal: true

require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  fixtures :group_categories, :fes_years, :places, :stocker_places

  def setup
    @user = User.create!(
      email: 'test@example.com',
      password: 'password',
      provider: 'email',
      uid: 'test@example.com',
      role_id: 1
    )
    @group_category = group_categories(:one)
    @fes_year = fes_years(:one)
    @stocker_place = stocker_places(:one)
  end

  test 'should be valid with a valid uses_place' do
    group = Group.new(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year,
      uses_place: @stocker_place
    )
    assert group.valid?
    assert_equal @stocker_place, group.uses_place
  end

  test 'should be valid without uses_place' do
    group = Group.new(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year,
      uses_place: nil
    )
    assert group.valid?
    assert_nil group.uses_place
  end

  test 'should be invalid with non-existent uses_place_id' do
    group = Group.new(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year,
      uses_place_id: 99_999
    )
    assert_not group.valid?
    assert group.errors[:uses_place].present?
  end

  test 'should generate a 24-character secret on create' do
    group = Group.create!(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )
    assert_equal 24, group.secret.length
  end

  test 'regenerate_secret should replace the secret with a new value' do
    group = Group.create!(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )
    old_secret = group.secret

    group.regenerate_secret

    assert_equal 24, group.secret.length
    assert_not_equal old_secret, group.secret
  end

  test 'should raise a not-null violation when secret is cleared at the database level' do
    group = Group.create!(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )

    assert_raises(ActiveRecord::NotNullViolation) do
      # rubocop:disable Rails/SkipsModelValidations
      group.update_column(:secret, nil)
      # rubocop:enable Rails/SkipsModelValidations
    end
  end

  test 'should raise a uniqueness violation when secret duplicates another group at the database level' do
    group_one = Group.create!(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )
    group_two = Group.create!(
      name: 'Group Two',
      project_name: 'Project Two',
      activity: 'Activity Two',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )

    assert_raises(ActiveRecord::RecordNotUnique) do
      # rubocop:disable Rails/SkipsModelValidations
      group_two.update_column(:secret, group_one.secret)
      # rubocop:enable Rails/SkipsModelValidations
    end
  end
end
