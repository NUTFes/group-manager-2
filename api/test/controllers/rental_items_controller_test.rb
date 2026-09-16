# frozen_string_literal: true

require 'test_helper'

class RentalItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @rental_item = RentalItem.create!(
      name: '長机',
      name_en: 'Long Table',
      is_stage_rentable: false,
      is_inside_shop_rentable: true,
      is_outside_shop_rentable: true
    )
  end

  test 'should get index' do
    get rental_items_url, as: :json
    assert_response :success
  end

  # name を伴わない部分更新で、登録済みの英語名が消えないこと
  test 'should keep name_en on a partial update that does not touch the name' do
    patch rental_item_url(@rental_item), params: { is_stage_rentable: true }, as: :json

    assert_response :success
    assert_equal 'Long Table', @rental_item.reload.name_en
    assert @rental_item.is_stage_rentable
  end

  # 英語名を明示的に送ったときはその値で更新されること
  test 'should update name_en when it is given' do
    patch rental_item_url(@rental_item), params: { name_en: 'Long Desk' }, as: :json

    assert_response :success
    assert_equal 'Long Desk', @rental_item.reload.name_en
  end
end
