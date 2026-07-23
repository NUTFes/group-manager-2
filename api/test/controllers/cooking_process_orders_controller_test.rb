# frozen_string_literal: true

require 'test_helper'
require 'securerandom'

class CookingProcessOrdersControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = %w[groups food_products cooking_process_orders]

  setup do
    Role.find_or_create_by!(id: 3) { |role| role.name = 'participant' }
    @user = User.find_or_initialize_by(id: 1)
    @user.update!(
      name: 'cooking-process-test',
      email: 'cooking-process-test@example.com',
      uid: 'cooking-process-test@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 3
    )
    @group = groups(:one)
  end

  test 'create translates English tent when tent_ja is not provided' do
    food_product = create_food_product
    calls = []
    tent = unique_tent('Boil noodles and cool them with water')

    stub_deepl_translate(calls) do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               food_product_id: food_product.id,
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: tent
             }
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order = CookingProcessOrder.find(response_data['id'])
    assert_equal tent, order.tent
    assert_equal translated_text(tent), order.tent_ja
    assert_equal [[tent, 'JA']], calls
  end

  test 'create does not translate Japanese tent' do
    food_product = create_food_product
    tent = "麺をゆでる #{SecureRandom.hex(4)}"

    stub_deepl_translate_raises do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               food_product_id: food_product.id,
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: tent
             }
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order = CookingProcessOrder.find(response_data['id'])
    assert_equal tent, order.tent
    assert_nil order.tent_ja
  end

  test 'create does not translate when tent_ja is provided' do
    food_product = create_food_product
    tent = unique_tent('Boil noodles')

    stub_deepl_translate_raises do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               food_product_id: food_product.id,
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: tent,
               tent_ja: '麺をゆでる。'
             }
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order = CookingProcessOrder.find(response_data['id'])
    assert_equal tent, order.tent
    assert_equal '麺をゆでる。', order.tent_ja
  end

  test 'create stores nil tent_ja when DeepL returns the original text' do
    food_product = create_food_product
    tent = unique_tent('Boil noodles')

    stub_deepl_translate_original do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               food_product_id: food_product.id,
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: tent
             }
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order = CookingProcessOrder.find(response_data['id'])
    assert_equal tent, order.tent
    assert_nil order.tent_ja
  end

  test 'update does not translate when tent is unchanged' do
    order = create_cooking_process_order(
      tent: unique_tent('Boil noodles'),
      tent_ja: '麺をゆでる。'
    )

    stub_deepl_translate_raises do
      put cooking_process_order_url(order),
          params: {
            cooking_process_order: {
              food_product_id: order.food_product_id,
              pre_open_kitchen: false,
              during_open_kitchen: true,
              tent: order.tent
            }
          },
          headers: auth_headers,
          as: :json
    end

    assert_response :success
    order.reload
    assert_equal '麺をゆでる。', order.tent_ja
    assert_equal false, order.pre_open_kitchen
    assert_equal true, order.during_open_kitchen
  end

  test 'update translates when tent changes' do
    order = create_cooking_process_order(
      tent: unique_tent('Boil noodles'),
      tent_ja: '麺をゆでる。'
    )
    changed_tent = unique_tent('Grill noodles on a hot plate')
    calls = []

    stub_deepl_translate(calls) do
      put cooking_process_order_url(order),
          params: {
            cooking_process_order: {
              food_product_id: order.food_product_id,
              pre_open_kitchen: false,
              during_open_kitchen: true,
              tent: changed_tent
            }
          },
          headers: auth_headers,
          as: :json
    end

    assert_response :success
    order.reload
    assert_equal changed_tent, order.tent
    assert_equal translated_text(changed_tent), order.tent_ja
    assert_equal [[changed_tent, 'JA']], calls
  end

  test 'upsert does not translate and preserves tent_ja when tent is unchanged' do
    order = create_cooking_process_order(
      tent: unique_tent('Boil noodles'),
      tent_ja: '麺をゆでる。'
    )

    stub_deepl_translate_raises do
      post upsert_cooking_process_orders_url,
           params: {
             cooking_process_orders: [
               {
                 id: order.id,
                 group_id: order.group_id,
                 food_product_id: order.food_product_id,
                 pre_open_kitchen: true,
                 during_open_kitchen: true,
                 tent: order.tent
               }
             ]
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order.reload
    assert_equal '麺をゆでる。', order.tent_ja
    assert_equal true, order.pre_open_kitchen
    assert_equal true, order.during_open_kitchen
  end

  test 'upsert translates when tent changes' do
    order = create_cooking_process_order(
      tent: unique_tent('Boil noodles'),
      tent_ja: '麺をゆでる。'
    )
    changed_tent = unique_tent('Steam vegetables')
    calls = []

    stub_deepl_translate(calls) do
      post upsert_cooking_process_orders_url,
           params: {
             cooking_process_orders: [
               {
                 id: order.id,
                 group_id: order.group_id,
                 food_product_id: order.food_product_id,
                 pre_open_kitchen: true,
                 during_open_kitchen: true,
                 tent: changed_tent
               }
             ]
           },
           headers: auth_headers,
           as: :json
    end

    assert_response :success
    order.reload
    assert_equal changed_tent, order.tent
    assert_equal translated_text(changed_tent), order.tent_ja
    assert_equal [[changed_tent, 'JA']], calls
  end

  test 'create fails without food_product_id' do
    assert_no_difference('CookingProcessOrder.count') do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: unique_tent('Boil noodles')
             }
           },
           headers: auth_headers,
           as: :json
    end
    assert_response :not_found
  end

  test 'create fails with invalid food_product_id' do
    assert_no_difference('CookingProcessOrder.count') do
      post cooking_process_orders_url,
           params: {
             cooking_process_order: {
               food_product_id: -1,
               pre_open_kitchen: true,
               during_open_kitchen: false,
               tent: unique_tent('Boil noodles')
             }
           },
           headers: auth_headers,
           as: :json
    end
    assert_response :not_found
  end

  test 'upsert does not create on validation error' do
    assert_no_difference('CookingProcessOrder.count') do
      stub_deepl_translate_original do
        post upsert_cooking_process_orders_url,
             params: {
               cooking_process_orders: [
                 {
                   group_id: @group.id,
                   food_product_id: nil,
                   pre_open_kitchen: true,
                   during_open_kitchen: true,
                   tent: unique_tent('Boil noodles')
                 }
               ]
             },
             headers: auth_headers,
             as: :json
      end
    end
    assert_response :unprocessable_entity
  end

  test 'update does not change record when params invalid' do
    order = create_cooking_process_order(
      tent: unique_tent('Boil noodles'),
      tent_ja: '麺をゆでる。'
    )

    stub_deepl_translate_raises do
      put cooking_process_order_url(order),
          params: {
            cooking_process_order: {
              food_product_id: nil,
              tent: order.tent
            }
          },
          headers: auth_headers,
          as: :json
    end

    assert_response :unprocessable_entity
    order.reload
    assert_not_nil order.food_product_id
  end

  private

  def auth_headers
    @user.create_new_auth_token
  end

  def create_food_product
    FoodProduct.create!(
      group_id: @group.id,
      name: "E2E Test Food #{SecureRandom.hex(4)}",
      is_cooking: true,
      first_day_num: 1,
      second_day_num: 1,
      is_alcohol: false
    )
  end

  def create_cooking_process_order(tent:, tent_ja:)
    food_product = create_food_product
    CookingProcessOrder.create!(
      group_id: @group.id,
      food_product_id: food_product.id,
      pre_open_kitchen: false,
      during_open_kitchen: false,
      tent: tent,
      tent_ja: tent_ja
    )
  end

  def stub_deepl_translate(calls, &block)
    with_deepl_api_key do
      with_deepl_translate(lambda { |text, _source_lang, target_lang|
        calls << [text, target_lang]
        Struct.new(:text).new(translated_text(text))
      }, &block)
    end
  end

  def stub_deepl_translate_raises(&block)
    with_deepl_api_key do
      with_deepl_translate(lambda { |_text, _source_lang, _target_lang|
        raise 'DeepL.translate should not be called'
      }, &block)
    end
  end

  def stub_deepl_translate_original(&block)
    with_deepl_api_key do
      with_deepl_translate(lambda { |text, _source_lang, _target_lang|
        Struct.new(:text).new(text)
      }, &block)
    end
  end

  def with_deepl_translate(replacement)
    original = DeepL.method(:translate)
    DeepL.define_singleton_method(:translate) do |text, source_lang, target_lang|
      replacement.call(text, source_lang, target_lang)
    end
    yield
  ensure
    DeepL.define_singleton_method(:translate, original)
  end

  def with_deepl_api_key
    original = ENV.fetch('DEEPL_API_KEY', nil)
    ENV['DEEPL_API_KEY'] = 'test-deepl-api-key'
    Rails.cache.clear
    yield
  ensure
    Rails.cache.clear
    ENV['DEEPL_API_KEY'] = original
  end

  def response_data
    response.parsed_body['data']
  end

  def unique_tent(prefix)
    "#{prefix} #{SecureRandom.hex(4)}."
  end

  def translated_text(text)
    "translated: #{text}"
  end
end
