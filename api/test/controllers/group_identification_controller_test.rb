# frozen_string_literal: true

require 'test_helper'

class GroupIdentificationControllerTest < ActionDispatch::IntegrationTest
  setup do
    @group_identification = group_identifications(:one)
  end

  test 'should get index' do
    get group_identification_url, params: { fes_year_id: '0', group_category_id: '0' }
    assert_response :success
  end

  test 'should create group_identification' do
    assert_difference('GroupIdentification.count') do
      post group_identification_url, params: { group_id: groups(:two).id, number: 2 }, as: :json
    end

    assert_response :success
  end

  test 'should update group_identification' do
    put "/group_identification/#{@group_identification.id}", params: { group_id: @group_identification.group_id, number: @group_identification.number }, as: :json
    assert_response :success
  end

  test 'should destroy group_identification' do
    assert_difference('GroupIdentification.count', -1) do
      delete "/group_identification/#{@group_identification.id}", as: :json
    end

    assert_response :ok
  end

  test 'should not create group_identification with invalid params' do
    assert_no_difference('GroupIdentification.count') do
      post group_identification_url, params: { group_id: nil, number: nil }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test 'should not update group_identification with invalid id' do
    put '/group_identification/99999', params: { group_id: @group_identification.group_id, number: @group_identification.number }, as: :json
    assert_response :not_found
  end

  test 'should not destroy group_identification with invalid id' do
    assert_no_difference('GroupIdentification.count') do
      delete '/group_identification/99999', as: :json
    end
    assert_response :not_found
  end
end
