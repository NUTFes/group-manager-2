# frozen_string_literal: true

require 'test_helper'

class StockerPlacesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stocker_place = stocker_places(:with_name_en)
  end

  test 'should get index' do
    get stocker_places_url, as: :json
    assert_response :success
  end

  # name を伴わない部分更新で、登録済みの英語名が消えないこと
  test 'should keep name_en on a partial update that does not touch the name' do
    patch stocker_place_url(@stocker_place), params: { stock_item_status: true }, as: :json

    assert_response :success
    assert_equal 'Gymnasium Storage', @stocker_place.reload.name_en
  end

  # 英語名を明示的に送ったときはその値で更新されること
  test 'should update name_en when it is given' do
    patch stocker_place_url(@stocker_place), params: { name_en: 'Gym Warehouse' }, as: :json

    assert_response :success
    assert_equal 'Gym Warehouse', @stocker_place.reload.name_en
  end
end
