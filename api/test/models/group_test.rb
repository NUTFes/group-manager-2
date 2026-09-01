# frozen_string_literal: true

require 'test_helper'

class GroupTest < ActiveSupport::TestCase
  fixtures :roles, :group_categories, :fes_years, :places, :stocker_places

  def setup
    @user = User.create!(
      email: 'test@example.com',
      password: 'password',
      provider: 'email',
      uid: 'test@example.com',
      role: roles(:one)
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

  test 'should create an associated group_secret on create' do
    group = create_group

    assert_not_nil group.group_secret
    assert_equal 24, group.secret.length
  end

  test 'should not include secret in the JSON representation' do
    group = create_group

    assert_not_includes group.as_json.keys, 'secret'
  end

  test 'should destroy the associated group_secret when the group is destroyed' do
    group = create_group
    group_secret_id = group.group_secret.id

    group.destroy

    assert_nil GroupSecret.find_by(id: group_secret_id)
  end

  private

  def create_group(name: 'Group One')
    Group.create!(
      name: name,
      project_name: 'Project One',
      activity: 'Activity One',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )
  end
end
