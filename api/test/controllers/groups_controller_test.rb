require 'test_helper'

class GroupsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @group = groups(:one)
  end

  test "should get index" do
    get groups_url, as: :json
    assert_response :success
  end

  test "should create group" do
    assert_difference('Group.count') do
      post groups_url, params: { group: { activity: @group.activity, fes_year_id: @group.fes_year_id, group_category_id: @group.group_category_id, name: @group.name, project_name: @group.project_name, user_id: @group.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show group" do
    get group_url(@group), as: :json
    assert_response :success
  end

  test "should update group" do
    patch group_url(@group), params: { group: { activity: @group.activity, fes_year_id: @group.fes_year_id, group_category_id: @group.group_category_id, name: @group.name, project_name: @group.project_name, user_id: @group.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy group" do
    assert_difference('Group.count', -1) do
      delete group_url(@group), as: :json
    end

    assert_response 204
  end
end
