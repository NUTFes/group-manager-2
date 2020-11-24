require 'test_helper'

class StageOrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stage_order = stage_orders(:one)
  end

  test "should get index" do
    get stage_orders_url, as: :json
    assert_response :success
  end

  test "should create stage_order" do
    assert_difference('StageOrder.count') do
      post stage_orders_url, params: { stage_order: { cleanup_end_time: @stage_order.cleanup_end_time, cleanup_time_interval: @stage_order.cleanup_time_interval, fes_date_id: @stage_order.fes_date_id, group_id: @stage_order.group_id, is_sunny: @stage_order.is_sunny, performance_end_time: @stage_order.performance_end_time, performance_start_time: @stage_order.performance_start_time, prepare_start_time: @stage_order.prepare_start_time, prepare_time_interval: @stage_order.prepare_time_interval, stage_first: @stage_order.stage_first, stage_second: @stage_order.stage_second, use_time_interval: @stage_order.use_time_interval } }, as: :json
    end

    assert_response 201
  end

  test "should show stage_order" do
    get stage_order_url(@stage_order), as: :json
    assert_response :success
  end

  test "should update stage_order" do
    patch stage_order_url(@stage_order), params: { stage_order: { cleanup_end_time: @stage_order.cleanup_end_time, cleanup_time_interval: @stage_order.cleanup_time_interval, fes_date_id: @stage_order.fes_date_id, group_id: @stage_order.group_id, is_sunny: @stage_order.is_sunny, performance_end_time: @stage_order.performance_end_time, performance_start_time: @stage_order.performance_start_time, prepare_start_time: @stage_order.prepare_start_time, prepare_time_interval: @stage_order.prepare_time_interval, stage_first: @stage_order.stage_first, stage_second: @stage_order.stage_second, use_time_interval: @stage_order.use_time_interval } }, as: :json
    assert_response 200
  end

  test "should destroy stage_order" do
    assert_difference('StageOrder.count', -1) do
      delete stage_order_url(@stage_order), as: :json
    end

    assert_response 204
  end
end
