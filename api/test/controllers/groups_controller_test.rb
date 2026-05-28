# frozen_string_literal: true

require 'test_helper'

class GroupsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @group = groups(:one)
  end

  def with_stubbed_slack
    client = Object.new
    def client.chat_postMessage(*)
      true
    end

    Slack::Web::Client.stub(:new, client) { yield }
  end

  test 'should get index' do
    get groups_url, as: :json
    assert_response :success
  end

  test 'should create group' do
    with_stubbed_slack do
      assert_difference('Group.count') do
        post groups_url, params: { activity: @group.activity, fes_year_id: @group.fes_year_id, group_category_id: @group.group_category_id, name: @group.name, project_name: @group.project_name, user_id: @group.user_id }, as: :json
      end
    end

    assert_response :success
  end

  test 'should show group' do
    get group_url(@group), as: :json
    assert_response :success
  end

  test 'should update group' do
    with_stubbed_slack do
      patch group_url(@group), params: { activity: @group.activity, fes_year_id: @group.fes_year_id, group_category_id: @group.group_category_id, name: @group.name, project_name: @group.project_name, user_id: @group.user_id }, as: :json
    end
    assert_response :ok
  end

  test 'should destroy group' do
    with_stubbed_slack do
      assert_difference('Group.count', -1) do
        delete group_url(@group), as: :json
      end
    end

    assert_response :ok
  end
end
