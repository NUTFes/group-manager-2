# frozen_string_literal: true

require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  fixtures :group_categories, :fes_years, :places

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
    @place = places(:one)
  end

  test 'should be valid with a valid uses_place' do
    group = Group.new(
      name: 'Group One',
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year,
      uses_place: @place
    )
    assert group.valid?
    assert_equal @place, group.uses_place
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
end
