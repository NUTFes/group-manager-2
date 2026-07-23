# frozen_string_literal: true

require 'test_helper'

class GroupIdentificationControllerTest < ActionDispatch::IntegrationTest
  setup do
    @group_identification = group_identifications(:one)
  end

  test 'should get index' do
    get group_identification_url,
        params: { fes_year_id: 0, group_category_id: 0 },
        as: :json

    assert_response :success
  end

  test 'should create group identification' do
    GroupIdentification.where(group_id: groups(:two).id).delete_all

    assert_difference('GroupIdentification.count') do
      post group_identification_url,
           params: { group_id: groups(:two).id, number: 3 },
           as: :json
    end

    assert_response :success
  end

  test 'should update group identification' do
    put "/group_identification/#{@group_identification.id}",
        params: { number: 3 },
        as: :json

    assert_response :success
    assert_equal 3, @group_identification.reload.number
  end

  test 'should destroy group identification' do
    assert_difference('GroupIdentification.count', -1) do
      delete "/group_identification/#{@group_identification.id}", as: :json
    end

    assert_response :success
  end
end
