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

  test 'should create place number' do
    assert_difference('PlaceNumber.count') do
      post place_numbers_url,
           params: { place_id: places(:two).id, group_identification_id: group_identifications(:one).id },
           as: :json
    end

    assert_response :success
  end

  test 'should update place number' do
    put "/place_numbers/#{@place_number.id}",
        params: { place_id: places(:two).id },
        as: :json

    assert_response :success
    assert_equal places(:two).id, @place_number.reload.place_id
  end

  test 'should destroy place number' do
    assert_difference('PlaceNumber.count', -1) do
      delete "/place_numbers/#{@place_number.id}", as: :json
    end

    assert_response :success
  end
end
