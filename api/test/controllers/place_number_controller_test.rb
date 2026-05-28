# frozen_string_literal: true

require 'test_helper'

class PlaceNumberControllerTest < ActionDispatch::IntegrationTest
  setup do
    @place_number = place_numbers(:one)
  end

  test 'should get index' do
    get place_numbers_url, as: :json
    assert_response :success
  end

  test 'should create place_number' do
    assert_difference('PlaceNumber.count') do
      post place_numbers_url, params: { place_id: @place_number.place_id, group_identification_id: @place_number.group_identification_id }, as: :json
    end

    assert_response :success
  end

  test 'should update place_number' do
    put "/place_numbers/#{@place_number.id}", params: { place_id: @place_number.place_id, group_identification_id: @place_number.group_identification_id }, as: :json
    assert_response :success
  end

  test 'should destroy place_number' do
    assert_difference('PlaceNumber.count', -1) do
      delete "/place_numbers/#{@place_number.id}", as: :json
    end

    assert_response :ok
  end
end
